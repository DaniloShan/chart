const request = require('superagent');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
require('colors');
const api = require('../utils/api');
const spider = require('../../spider');

const _date = timestamp => moment(timestamp).format('YYYY-MM-DD');
const sleep = (time = 3000) => new Promise(resolve => setTimeout(() => {
    resolve()
}, time));

// TODO: 1day data, schema

module.exports = app => {
    class History extends app.Service {
        async oneDay(symbol, start, end) {
            const { err, body: { price_usd } } = await request
                .get(api.price(symbol, start, end))
                .set({
                    host: api.host
                });
            if (!err) {
                return {
                    success: true,
                    data: price_usd
                };
            }
            return {
                success: false,
                err
            };
        }

        async update({ symbol = 'bitcoin' }) {
            let { [symbol]: { last, initiate } } = spider;
            let start, end;
            if (!last) start = initiate;
            else start = last;
            while(true) {
                end = await this.next(symbol, start);
                start = end;
                spider[symbol].last = end;
                fs.writeFileSync(path.resolve(__dirname + '../../../spider.json'), JSON.stringify(spider));
                if (end > +new Date() - 3600 * 24 * 1000) break;
                await sleep();
            }

            return 'doing...';
        }

        async next(symbol, start) {
            let end, rows = [], sqlRes;

            end = 24 * 3600 * 1000 + start;

            let { success, data, err } = await this.oneDay(symbol, start, end);

            if (!success) {
                return err;
            }
            data.forEach((item) => {
                rows.push({
                    date: _date(item[0]),
                    time: item[0],
                    price: item[1]
                })
            });
            sqlRes = await this.app.mysql.insert(`${symbol}_price`, rows);
            console.log(`${_date(start)}`.underline.blue, ` done`.green, `, ${JSON.stringify(sqlRes)}`);
            console.log('++++++++++++++++++++++++++++++');
            return end;
        }
    }

    return History;
};
