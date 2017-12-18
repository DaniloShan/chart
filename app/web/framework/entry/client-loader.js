module.exports = function (source) {
    this.cacheable();
    const resourcePath = this.resourcePath;
    return `
        import React from 'react';
        import ReactDom from 'react-dom';
        import App from '${resourcePath.replace(/\\/g, '\\\\')}';
        ReactDom.render(<App />, document.getElementById('app'));
    `;
};
