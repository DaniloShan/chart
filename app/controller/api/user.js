"use strict";

const Controller = require('egg').Controller;

class User extends Controller {
    async info() {
        this.ctx.body = await this.ctx.service.user.find('uid_xxxxx');
    }
}

module.exports = User;
