const request = require('superagent');

const date = (timestamp, type) => {
    const d = new Date(timestamp);
    switch (true) {
        case type.indexOf('day') > -1:
            return `${d.getMonth() + 1}/${d.getDate()}`;
        case type.indexOf('hour') > -1:
            return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}`;
        default:
            return `${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    }

};

module.exports = app => {
    class Trade extends app.Service {
        async kline({ symbol = 'qtum', type = '1day', size = '200', since, offsetIndex }) {
            const { helper: { settings } } = this.ctx;
            const coinNameList = symbol.split(',');
            // if (coinNameList[0] !== 'btc') coinNameList.unshift('btc');
            if (!coinNameList.length) {
                return this.ctx.helper.resWrap(400);
            }
            const urls = coinNameList.map(coinName =>
                ({
                    url: settings.urls.okex.kline(coinName, type, size, since),
                    name: coinName
                })
            );
            const _res = await Promise.all(urls.map(coin =>
                new Promise(resolve =>
                    request
                        .get(coin.url)
                        .end((err, res) =>
                            resolve(res && res.ok ? {
                                name: coin.name,
                                data: res.body
                            } : null)
                        )
                )
            ));
            const uni = {};
            let offset = 0;
            _res.forEach(({ name, data }) => {
                if (name === 'btc') {
                    offset = data[+offsetIndex] ? data[+offsetIndex][4] : 10000;
                } else if (!offset) {
                    offset = data[+offsetIndex] ? data[+offsetIndex][4] : 10000;
                }
            });
            _res.forEach(({ name, data }) => {
                const offsetValue = data[+offsetIndex] ? data[+offsetIndex] : data[data.length - 1];
                const percent = name === 'btc' ? 1 : Math.floor(offset / +offsetValue[4]);
                data.forEach((item) => {
                    const d = date(item[0], type);
                    if (!uni[d]) {
                        uni[d] = {};
                        coinNameList.forEach(name => {
                            uni[d][name] = 0;
                        })
                    }
                    uni[d][name] = percent ? +item[4] * percent : +item[4];
                });
            });
            const res = Object.keys(uni)
                .map(key => {
                    const listItem = { name: key };
                    Object.keys(uni[key]).forEach(coinName =>
                        listItem[coinName] = isNaN(+uni[key][coinName]) ? 0 : uni[key][coinName]
                    );
                    return listItem;
                });
            return this.ctx.helper.resWrap(res);
        }
    }

    return Trade;
};
