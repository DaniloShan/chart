"use strict";

const Controller = require('egg').Controller;

class Trade extends Controller {
    async kline() {
        const { ctx: { query: { symbol, type } }, service: { trade } } = this;
        this.ctx.body = await trade.kline(symbol, type);
    }
}

module.exports = Trade;
