/// <reference types="jasmine" />
import 'ts-helpers';

declare var require: any;

const context: any = require.context('.', true, /\.test\.ts$/);
context.keys().forEach(context);