const moment = require('moment');

module.exports = app => {
    class Trend extends app.Service {
        constructor(...props) {
            super(...props);
            this.offset = 0;
            this.limit = 1000;
            this.lastHigh = 0;
            this.lastLow = 0;
            this.data = [];
            this.direction = 0;
        }

        async next(symbol) {
            const results = await app.mysql.select(`${symbol}_price`, {
                where: {},
                orders: [['id', 'asc']],
                limit: this.limit,
                offset: this.offset
            });
            this.offset += this.limit;
            return results;
        }

        async run({ symbol, percent = 0.06, start, end }) {
            if (start) {
                const result = await app.mysql.query(`SELECT * FROM \`${symbol}_price\` WHERE time > ${+new Date(start)} LIMIT 1;`);
                if (result && result.length) {
                    this.offset = result[0].id
                }
            }
            let chunk;
            while(true) {
                chunk = await this.next(symbol);
                if (!chunk || !chunk.length) break;
                if (end && chunk[0].time > +new Date(end)) break;
                if (!this.lastHigh) this.lastHigh = chunk[0].price;
                if (!this.lastLow) this.lastLow = chunk[0].price;
                this.generate(chunk, +percent);
            }
            return this.ctx.helper.resWrap(this.data);
        }

        generate(chunk, percent) {
            // 当前价格上涨幅度大于 percent，将 lastLow 计入，反之将 lastHigh 计入
            chunk.forEach(({ price, time }) => {
                if (price / this.lastHigh > 1 + percent) {
                    if (true || !this.direction) {
                        this.data.push({
                            date: moment(time).format('YYYY-MM-DD HH:mm:ss'),
                            price: this.lastLow
                        });
                    }
                    this.direction = 1;
                    this.lastHigh = price;
                    this.lastLow = price;
                } else if (this.lastLow / price > 1 + percent) {
                    if (true || this.direction) {
                        this.data.push({
                            date: moment(time).format('YYYY-MM-DD HH:mm:ss'),
                            price: this.lastHigh
                        });
                    }
                    this.direction = 0;
                    this.lastHigh = price;
                    this.lastLow = price;
                }
            });
        }
    }
    return Trend;
};
