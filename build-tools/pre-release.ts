import { exec } from 'child_process';

exec('git checkout pre-release', (err) => {
  if (err) {
    return process.stderr.write(err.toString());
  }
});
