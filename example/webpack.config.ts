import { Configuration } from 'webpack';
import * as path from 'path';

const DEVELOPMENT: boolean = process.argv.indexOf('--watch') > 0;
const UGLIFY: boolean = process.env.UGLIFY === 'true' || !DEVELOPMENT;
const rel: Function = (x: string) => path.resolve(__dirname, x);

// NOTE: Not sure we can use mixins in libraries. Supressing declarations for this example
const config: Configuration = {
  entry: {
    'dist/all': rel('./src/index.ts'),
  },
  output: {
    path: rel('.'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: rel('../tsconfig.example.json'),
          }
        }],
        exclude: [
          /node_modules/,
        ],
      },
      { test: /\.css$/, use: [{ loader: 'style!css' }] },
      { test: /\.less$/, use: [{ loader: 'style!css!less' }] },
      { test: /\.(jpe?g|png|gif|svg)$/i, use: [{ loader: 'url?limit=100000' }] },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [],
  mode: DEVELOPMENT ? 'development' : 'production',
};

if (DEVELOPMENT) {
  config.devtool = 'eval';
}

if (UGLIFY) {
  config.devtool = undefined;
}

module.exports = config;
