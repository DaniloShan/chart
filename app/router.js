module.exports = (app) => {
    app.get('/', app.controller.home.index);
    app.get('/api/trade/kline', app.controller.api.trade.kline);
};
