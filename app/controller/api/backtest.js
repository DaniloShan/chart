"use strict";

const Controller = require('egg').Controller;

class Backtest extends Controller {
    async run() {
        const { ctx: { query }, service: { backtest } } = this;
        this.ctx.body = await backtest.run(query);
    }
}

module.exports = Backtest;
