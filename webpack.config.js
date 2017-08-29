var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

var isProd = process.env.NODE_ENV === 'production'; //get the environment variable and get true or false
var cssDev = ['style-loader', 'css-loader', 'sass-loader'];
var cssProd = ExtractTextPlugin.extract({
    fallbackLoader: 'style-loader',
    use: ['css-loader', 'sass-loader'],
    publicPath: '/dist'
});

var cssConfig = isProd ? cssProd : cssDev;

module.exports = {
    entry: {
        app: './js/game.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: cssConfig
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(gif|svg|png|jpe?g)$/i,
                use: [
                    'file-loader',
                    {    //this shouldn't be an object, just the name of the loader but a bug make it crash
                        loader:'image-webpack-loader',
                        options:{}
                    }
                ]
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
        hot: true,
        stats: 'errors-only',
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Phaser Game',
            hash: true,
            excludeChunks: ['contact'],
            filename: './index.html',
            template: './index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
}
