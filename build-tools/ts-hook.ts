import {
  formatResults,
  move,
  run,
  compileProject,
  cout,
  changePackageVersion,
  pushTags,
} from 'ts-publish';

function hook(action: string, options?: any): void {
  const target = options ? options.target : '';
  const projectResult = compileProject('angular-ts', './build-tools/ts-publish.json', true);
  if (projectResult.numMessages) {
    process.stderr.write(formatResults(projectResult.results));
    throw Error('messages found');
  }

  if (action === 'trial') {
    move('build/lib/', target);
  } else {
    const files = move('build/lib/', '.');
    files.forEach((file) => {
      run(`git add ${file} -f`);
    });
  }
}

function publish(action: string, version: string): void {
  const date = new Date();
  const finalVersion = action === 'pre-release' ? `${version}-beta.${date.valueOf()}` : version;
  cout(`Publishing version ${finalVersion}\n`);
  if (action === 'pre-release') {
    changePackageVersion(finalVersion);
    run(`git commit -m "[pre-release] v${finalVersion}"`);
    run('npm publish --tag next');
  } else {
    run(`git commit -m "[release] v${finalVersion}"`);
    run('npm publish --tag latest');
  }
  pushTags(`v${finalVersion}`);
}

export {
  hook,
  publish,
}
