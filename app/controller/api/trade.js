"use strict";

const Controller = require('egg').Controller;

class Trade extends Controller {
    async kline() {
        const { ctx: { query }, service: { trade } } = this;
        this.ctx.body = await trade.kline(query);
    }
}

module.exports = Trade;
