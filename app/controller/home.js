"use strict";

const Controller = require('egg').Controller;

class Home extends Controller {
    async index() {
        await this.ctx.renderClient('home/home.js');
    }
}

module.exports = Home;
