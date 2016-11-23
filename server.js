var path = require('path');
var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var config = require("./webpack.config.js");

// https://www.npmjs.com/package/redwire
var RedWire = require('redwire');
var redwire = new RedWire({
    http: {
        port: 9000,
        websockets: true
    }
});

/**
 * Cerberus is a couple services behind a router so we can simulate that locally
 */
// redirect dashboard to the Cerberus Management Dashboard
redwire.http('http://localhost:9000/dashboard', '127.0.0.1:8000');
// redirect rule for Cerberus Management Service
redwire.http('http://localhost:9000/v1', '127.0.0.1:8080/v1');
redwire.http('http://localhost:9000/v2', '127.0.0.1:8080/v2');
// redirect /secret to Hashicoorp Vault
redwire.http('http://localhost:9000/v1/secret', '127.0.0.1:8200/v1/secret');

// configure proxy for hot module web socket
redwire.http('http://localhost:9000/sockjs-node', 'http://127.0.0.1:8000/sockjs-node');
config.entry.app.unshift("webpack-dev-server/client?http://localhost:8000/", "webpack/hot/dev-server");

// run the local server
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
    contentBase: path.resolve(__dirname, "build"),
    hot: true,
    inline: true,
    historyApiFallback: true,

    // webpack-dev-middleware options
    quiet: false,
    noInfo: false,
    lazy: false,
    filename: 'browser-bundle.js',
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    stats: { colors: false }
});
server.listen(8000, "0.0.0.0", function() {})
