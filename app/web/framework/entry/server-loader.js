module.exports = function (source) {
    this.cacheable();
    return `
        import React, { Component } from 'react';
        import App from '${this.resourcePath.replace(/\\/g, '\\\\')}';
        export default class Page extends Component {
            render() {
                return <App {...this.props} />;
            }
        }
    `;
};
