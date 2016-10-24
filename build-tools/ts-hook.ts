import {
  formatResults,
  move,
  run,
  compileProject,
} from 'ts-publish';
import * as _ from 'lodash';

function hook(): void {
  const projectResult = compileProject('angular-ts', './build-tools/ts-publish');
  if (projectResult.numMessages) {
    process.stderr.write(formatResults(projectResult.results));
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
