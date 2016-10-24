function _addBase(clazz: any, mixin: any): void {
  if (clazz.$$mixins.indexOf(mixin) === -1) {
    clazz.$$mixins.unshift(mixin);
    if (mixin.$$mixins) {
      mixin.$$mixins.forEach((base: any) => {
        _addBase(clazz, base);
      });
    }
    const parent: any = Object.getPrototypeOf(mixin.prototype);
    if (parent) {
      _addBase(clazz, parent.constructor);
    }
  }
}

class IMixin {
  constructor(...args: Array<any>[]) {
    args.forEach((arg: any[]) => {
      const clazz: any = arg[0];
      const constructorArgs: any[] = arg.slice(1);
      clazz.call(this, ...constructorArgs);
    });
  }

  callBase(base: any, method: string, ...args: any[]): any {
    return base.prototype[method].call(this, ...args);
  }
}

function mix(...mixins: any[]): typeof IMixin {
  class Mix extends IMixin {
    [key: string]: any;
    static $$mixins: any[] = [];
  }

  mixins.forEach((mixin: any) => {
    // Addding parent mixins
    _addBase(Mix, mixin);
    // Necessary to inherit static methods
    for (const p in mixin) {
      if (p !== '$$mixins') {
        // Not sure how to specify the index signature of `Mix`. Casting to any.
        (Mix as any)[p] = mixin[p];
      }
    }
    // tslint:disable:forin
    for (const prop in mixin.prototype) {
      Mix.prototype[prop] = mixin.prototype[prop];
    }
  });

  return Mix;
}

function _isinstance(object: any, classinfo: any): boolean {
  const proto: any = Object.getPrototypeOf(object);
  const mixins: any[] = proto.constructor.$$mixins;

  let result: boolean = object instanceof classinfo;
  if (!result && mixins) {
    for (const index in mixins) {
      if (mixins[index].prototype === classinfo.prototype) {
        result = true;
        break;
      }
    }
  }
  return result;
}

function isinstance(object: any, classinfo: any): boolean {
  if (Array.isArray(classinfo)) {
    let result: boolean = false;
    for (const index in classinfo) {
      if (_isinstance(object, classinfo[index])) {
        result = true;
        break;
      }
    }
    return result;
  }
  return _isinstance(object, classinfo);
}

export {
  IMixin,
  mix,
  isinstance,
};
