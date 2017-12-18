module.exports = (app) => {
    app.get('/', app.controller.home.index);

    app.get('/api/user/info', app.controller.api.user.info)
};
