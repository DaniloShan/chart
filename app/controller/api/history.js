"use strict";

const Controller = require('egg').Controller;

class History extends Controller {

    async update() {
        const { ctx: { query }, service: { history } } = this;
        this.ctx.body = await history.update(query);
    }

    async backtest() {
        const { ctx: { query }, service: { history } } = this;
        this.ctx.body = await history.backtest(query);
    }
}

module.exports = History;
