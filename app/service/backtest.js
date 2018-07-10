const moment = require('moment');
let position = require('../../position');

// TODO: 1day data, schema
// TODO: total计算，考虑已购币当前价格，总资金应动态计算，改为 last + cost

let data = [];
let offset = 0;
let buyPrice = 0.99;
let sellPrice = 1.02;
let avgPrice = 0;
let avg = [];

const getAvgPrice = () => {
    if (!avgPrice) {
        avgPrice = avg.reduce((acc, cur) => acc + cur) / avg.length;
        console.log('avgPrice init: ', avgPrice);
    } else {
        avgPrice = (avgPrice * (avg.length - 1) + avg[avg.length - 1]) / avg.length;
    }
    return avgPrice;
};

const getPercent = (price) => {
    const range = price / avgPrice;
    switch(true) {
        case range > 1.5:
            buyPrice = 0.88;
            sellPrice = 1.2;
            break;
        case range > 1.2:
            buyPrice = 0.92;
            sellPrice = 1.15;
            break;
        case range > 1:
            buyPrice = 0.95;
            sellPrice = 1.1;
            break;
        default:
            buyPrice = 0.97;
            sellPrice = 1.05;
            break;
    }
};

module.exports = app => {
    class Backtest extends app.Service {
        init(symbol) {
            position = position[symbol];
        }

        async next(symbol) {
            if (!data.length) {
                const results = await app.mysql.select(`${symbol}_price`, {
                    where: {},
                    orders: [['id', 'asc']],
                    limit: 300,
                    offset
                });
                offset += 300;
                if (results.length) {
                    data = results;
                } else {
                    return null;
                }
            }
            const result = data.splice(0, 1)[0];
            if (avg.length === 288 * 30) {
                avg = avg.splice(1);
            }
            avg.push(result.price);
            return result;
        }

        async trade(price, symbol) {
            const percent = price / position.lastPrice;
            getAvgPrice();
            // getPercent(price);
            if (percent < buyPrice) {
                // going down
                this.buyIn(price, symbol);
                position.lastPrice = price;
                return 1;
            } else if (percent > sellPrice) {
                // going up
                this.sellOut(price, symbol);
                position.lastPrice = price;
                return 2;
            }
            return 0;
        }

        async run({ symbol }) {
            this.init(symbol);
            let chunk;
            const result = [];
            while (true) {
                chunk = await this.next(symbol);
                if (chunk && chunk.time < +new Date('2018-04-01')) {
                    continue;
                }
                if (!chunk || !chunk.price) break;
                if (!position.lastPrice) {
                    position.lastPrice = chunk.price;
                }
                const res = await this.trade(chunk.price, symbol);
                if (res === 2) {
                    result.push({
                        total: +position.total.toFixed(2),
                        used: +position.used.toFixed(2),
                        date: moment(chunk.time).format('YYYY-MM-DD HH:mm:ss'),
                        buyPrice,
                        sellPrice,
                        avgPrice,
                        lastPrice: position.lastPrice
                    });
                }
            }

            let leftCoin = 0;
            Object.keys(position.hold).forEach((key) => leftCoin += position.hold[key]);
            return result;
        }

        /*
         * { price, number }
         */
        buyIn(price) {
            let number = +(position.total * (1 - buyPrice) / price).toFixed(4);
            if (number < 0.001) number = 0.001;
            const earned = number * price;
            let target = price * sellPrice;
            if (earned < position.total - position.used) {
                position.hold[price] = number;
                position.target[target] = {
                    price,
                    number
                };
                position.used += earned;
            }
        }

        /*
         * { price, number }
         */
        sellOut(priceNow) {
            Object.keys(position.target).forEach((price) => {
                const number = position.target[price].number;
                const holdPrice = position.target[price].price;
                if (+price < priceNow) {
                    position.total += +priceNow * number - holdPrice * number; // 用当前价格出售
                    position.used -= holdPrice * number;
                    delete position.hold[holdPrice];
                    delete position.target[price];
                }
            });
        }
    }

    return Backtest;
};
