"use strict";

const Controller = require('egg').Controller;

class Route extends Controller {
    async index() {
        await this.ctx.renderClient('route/index.js');
    }
}

module.exports = Route;
