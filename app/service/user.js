module.exports = app => {
    class User extends app.Service {
        async find(uid) {
            return await this.ctx.helper.resWrap({
                name: 'ethan'
            });
        }
    }
    return User;
};
