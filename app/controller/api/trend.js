"use strict";

const Controller = require('egg').Controller;

class Trend extends Controller {

    async run() {
        const { ctx: { query }, service: { trend } } = this;
        this.ctx.body = await trend.run(query);
    }
}

module.exports = Trend;
