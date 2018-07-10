module.exports = (app) => {
    app.get('/:path?', app.controller.route.index);
    app.get('/api/trade/kline', app.controller.api.trade.kline);
    app.get('/api/history/update', app.controller.api.history.update);
    app.get('/api/backtest', app.controller.api.backtest.run);
    app.get('/api/trend', app.controller.api.trend.run);
};
