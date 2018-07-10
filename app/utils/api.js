const host = 'graphs2.coinmarketcap.com';
const protocol = 'https';

const api =  {
    host,
    price: (symbol, start, end) => {
        return `${protocol}://${host}/currencies/${symbol}/${start}/${end}`
    }
};

module.exports = api;
