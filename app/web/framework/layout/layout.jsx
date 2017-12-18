import React, { Component } from 'react';

export default class Layout extends Component {
    render() {
        return (
            <html>
            <head>
                <title>{this.props.title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" />
                <meta name="keywords" content={this.props.keywords} />
                <meta name="description" content={this.props.description} />
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            </head>
            <body>
                <div id="app">{this.props.children}</div>
            </body>
            </html>
        );
    }
}
