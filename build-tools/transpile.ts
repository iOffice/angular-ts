import { IFileErrorsMap, IFileMessages, compile, getProjectConfig, formatResults } from '.';
import { argv } from 'yargs';
import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';
import * as _ from 'lodash';

const tsconfig: ts.CompilerOptions = getProjectConfig('tsconfig');
tsconfig.outDir = './build';
tsconfig.declaration = true;
const tslint: Lint.ILinterOptionsRaw = getProjectConfig('tslint');

const files: string[] = [];
if (argv['build-tools']) {
  files.push(...[
    'build-tools/transpile.ts',
    'build-tools/karma.config.ts',
    'build-tools/webpack.config.ts',
  ]);
}

const results: IFileErrorsMap = compile(files, tsconfig, tslint);
let numMessages: number = 0;
_.each(results, (file: IFileMessages) => {
  numMessages += file.messages.length;
});

if (numMessages) {
  process.stderr.write(formatResults(results));
  process.exit(1);
}
