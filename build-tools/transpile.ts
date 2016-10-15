import {
  IProject,
  IFileErrorsMap,
  IFileMessages,
  compile,
  getProjectConfig,
  formatResults,
} from '.';
import * as yargs from 'yargs';
import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';
import * as _ from 'lodash';

interface IArgs {
  _: string[];
  force: boolean;
}

const argv: IArgs = yargs.usage('usage: $0 project')
  .demand(1)
  .option('f', {
    alias: 'force',
    describe: 'force transpilation for all files in the project',
    type: 'boolean',
  })
  .help('help')
  .argv;

const tsconfig: ts.CompilerOptions = getProjectConfig('tsconfig').compilerOptions;
tsconfig.outDir = './build';
tsconfig.declaration = true;
const tslint: Lint.ILinterOptionsRaw = getProjectConfig('tslint');

const projects: IProject[] = [
  {
    name: 'build-tools',
    files: [
      'build-tools/transpile.ts',
      'build-tools/karma.config.ts',
      'build-tools/webpack.config.ts',
    ],
  },
];

const projectName: string = argv._[0];
if (!_.find(projects, x => x.name === projectName)) {
  process.stderr.write(`project must be one of: [${projects.map(x => x.name)}]\n`);
  process.exit(1);
}

const project: IProject = _.find(projects, (x) => x.name === projectName);
const results: IFileErrorsMap = compile(project, tsconfig, tslint, argv.force);
let numMessages: number = 0;
_.each(results, (file: IFileMessages) => {
  numMessages += file.messages.length;
});

if (numMessages) {
  process.stderr.write(formatResults(results));
  process.exit(1);
}
