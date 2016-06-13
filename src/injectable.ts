function inject(clazz: any, injectables: (string | any)[]): void {
  if (typeof clazz !== 'function') {
    clazz.constructor.$inject.forEach((name: string, index: number) => {
      clazz[name] = injectables[index];
    });
    return;
  }
  if (!clazz.$inject) {
    clazz.$inject = [];
  } else {
    clazz.$inject = clazz.$inject.slice(0);
  }
  injectables.forEach((injectable: string) => {
    if (clazz.$inject.indexOf(injectable) === -1) {
      clazz.$inject.push(injectable);
    }
  });
}


function Inject(args: string[]): Function {
  return (target: any) => {
    inject(target, args);
  };
}


export {
  Inject,
  inject,
};
