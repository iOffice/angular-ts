import { Configuration, optimize } from 'webpack';
import * as path from 'path';

const DEVELOPMENT: boolean = process.argv.indexOf('--watch') > 0;
const UGLIFY: boolean = process.env.UGLIFY === 'true' || !DEVELOPMENT;
const rel: Function = (x: string) => path.resolve(__dirname, x);

const config: Configuration = {
  entry: {
    'dist/all': rel('../example/src/index.ts'),
  },
  output: {
    path: rel('../example'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['', '.tsx', '.ts', '.js'],
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: [
          /node_modules/,
        ],
      },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.less$/, loader: 'style!css!less' },
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'url?limit=100000' },
    ],
  },
  plugins: [],
};

if (DEVELOPMENT) {
  config.devtool = 'eval';
}

if (UGLIFY) {
  config.plugins.push(new optimize.UglifyJsPlugin({
    mangle: true,
    compress: {
      drop_console: false,
    },
  }));
  config.devtool = undefined;
}

module.exports = config;
