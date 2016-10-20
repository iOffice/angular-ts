import { run } from 'ts-publish';

function hook(): void {
  run('ts-compile angular-ts --config build-tools/ts-publish');
}

export {
  hook,
}
