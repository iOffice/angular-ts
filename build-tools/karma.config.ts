import { Config, ConfigOptions } from 'karma';
import { Configuration } from 'webpack';

interface IConfigOptions extends ConfigOptions {
  webpack: Configuration;
  webpackServer: any;
}

function karmaExports(config: Config): void {
  const options: IConfigOptions = {
    frameworks: ['jasmine'],
    files: [
      '../test/index.ts',
    ],
    preprocessors: {
      '../test/index.ts': ['webpack'],
    },
    webpack: {
      resolve: {
        extensions: ['', '.tsx', '.ts', '.js'],
        alias: {
          sinon: 'sinon/pkg/sinon',
        },
      },
      module: {
        loaders: [
          { test: /\.ts$/, loader: 'ts-loader', exclude: [/node_modules\//] },
          { test: /\.css$/, loader: 'style!css' },
          { test: /\.less$/, loader: 'style!css!less' },
          { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'url?limit=100000' },
          { test: /sinon\.js$/, loader: 'imports?define=>false,require=>false' },
        ],
      },
      watch: true,
    },
    webpackServer: {
      noInfo: true,
    },
    reporters: ['progress'],
    port: 9876,
    plugins: [
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-jasmine',
    ],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
  };
  config.set(options);
}

export = karmaExports;