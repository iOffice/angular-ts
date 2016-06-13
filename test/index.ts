// tslint:disable
import 'ts-helpers';
const context = require.context('.', true, /\.test\.ts$/);
context.keys().forEach(context);
