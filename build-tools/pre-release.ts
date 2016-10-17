import { execSync } from 'child_process';
import 'colors';

function cout(msg: string): void {
  process.stdout.write(msg);
}

function exit(code: number): void {
  process.exit(code);
}

function run(cmd: string, callback?: Function): void {
  const output: Buffer = execSync(cmd);
  if (callback) {
    callback(output.toString());
  }
}

run('git status -s', (stdout: string) => {
  if (stdout) {
    cout(`${'ERROR:'.red} There are uncommitted changes:\n`);
    cout(stdout);
    exit(0);
  }
});

run('node ./build/transpile.js build-tools');
