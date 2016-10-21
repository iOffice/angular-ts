import {
  IFileMessages,
  getConfig,
  parseTsPublishConfig,
  compile,
  formatResults,
  move,
  run,
} from 'ts-publish';
import * as _ from 'lodash';

function hook(): void {
  const project = parseTsPublishConfig('./build-tools/ts-publish')[0];
  const lintOptions: any = getConfig('tslint');

  const results = compile(project, project.compilerOptions, lintOptions);
  let numMessages: number = 0;
  _.each(results, (file: IFileMessages) => {
    numMessages += file.messages.length;
  });

  if (numMessages) {
    process.stderr.write(formatResults(results));
    // throw Error('messages found');
  }

  const files = move('build/lib/*', '.');
  _.each(files, (file) => {
    run(`git add ${file} -f`);
  });
}

export {
  hook,
}
