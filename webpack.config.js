const path = require('path');
var webpack = require('webpack');

var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
pixi = path.join(phaserModule, 'build/custom/pixi.js'),
p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
  entry: './js/game.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist',
    port: 3000
  },
  module: {
        loaders: [
            { test: /pixi.js/, use: "script-loader" },
            { test: /p2\.js/, use: 'script-loader' }
        ]
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi.js': pixi,
            'p2': p2,
        }
    }
};
