/**
 * Obtained and modified from: https://github.com/michaelbromley/angular-es6
 */
import * as ng from 'angular';
import { INgComponentOptions } from './component';

function toCamelCase(str: string, pascal: boolean = false): string {
  const words = str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1));
  if (!pascal) {
    words[0] = words[0].toLowerCase();
  }
  return words.join('');
}

/* tslint:disable:forin no-invalid-this */
/**
 * A helper class to simplify registering Angular components and provide a consistent syntax for
 * doing so.
 */
class NgRegister {
  app: ng.IModule;
  requires: Function;
  name: Function;
  provider: Function;
  service: Function;
  value: Function;
  constant: Function;
  decorator: Function;
  animation: Function;
  filter: Function;
  controller: Function;
  config: Function;
  run: Function;
  [key: string]: any;

  constructor(appName: string, dependencies?: string[]) {
    if (dependencies === undefined) {
      this.app = ng.module(appName);
    } else {
      this.app = ng.module(appName, dependencies);
    }
    const methods: string[] = [
      'requires',
      'name',
      'provider',
      // 'factory',
      'service',
      'value',
      'constant',
      'decorator',
      'animation',
      'filter',
      'controller',
      // 'directive',
      // 'component',
      'config',
      'run',
    ];
    methods.forEach((name: string) => {
      this[name] = this._wrapMethod(name);
    });
  }

  _wrapMethod(method: string): Function {
    return (...args: any[]) => {
      // Casting to `any` since we are relying on access by index
      (this.app as any)[method](...args);
      return this;
    };
  }

  module(): ng.IModule {
    return this.app;
  }

  component(constructorFunction: Function): NgRegister {
    const component = (constructorFunction as any).__component as INgComponentOptions;
    const name = toCamelCase(component.selector);
    this.app.component(name, component);
    return this;
  }

  directive(name: string, constructorFunction: Function): NgRegister {
    const constructorFn: Function = this._normalizeConstructor(constructorFunction);
    const proto: any = constructorFn.prototype;

    proto.compile = proto.compile || (() => {});
    const originalCompileFn: Function = this._cloneFunction(proto.compile);

    // Decorate the compile method to automatically return the preLink and postLink methods (if
    // they exists) and bind them to the context of the constructor (so `this` works correctly).
    // This gets around the problem of a non-lexical "this" which occurs when the directive class
    // itself returns `this.link` from within the compile function.
    this._override(proto, 'compile', () => function compileReturns(...args: any[]): {} {
      originalCompileFn.apply(this, args);
      const preLink: Function = proto.preLink ? proto.preLink.bind(this) : () => {};
      let postLink: Function = () => {};
      if (proto.postLink) {
        postLink = proto.postLink.bind(this);
      } else if (proto.link) {
        postLink = proto.link.bind(this);
      }
      return {
        pre: preLink,
        post: postLink,
      };
    });

    const factoryArray: any[] = this._createFactoryArray(constructorFn);
    this.app.directive(name, factoryArray);
    return this;
  }

  factory(name: string, constructorFunction: Function): NgRegister {
    const constructorFn: Function = this._normalizeConstructor(constructorFunction);
    const factoryArray: any[] = this._createFactoryArray(constructorFn);
    this.app.factory(name, factoryArray);
    return this;
  }

  /**
   * If the constructorFn is an array of type ['dep1', 'dep2', ..., constructor() {}]
   * we need to pull out the array of dependencies and add it as an $inject property of the
   * actual constructor function.
   */
  _normalizeConstructor(input: Function|Array<any>): Function {
    let constructorFn: Function;
    if (Array.isArray(input)) {
      const injected: string[] = input.slice(0, input.length - 1);
      constructorFn = input[input.length - 1];
      constructorFn.$inject = injected;
    } else {
      constructorFn = input;
    }
    return constructorFn;
  }

  /**
   * Convert a constructor function into a factory function which returns a new instance of that
   * constructor, with the correct dependencies automatically injected as arguments.
   *
   * In order to inject the dependencies, they must be attached to the constructor function with the
   * `$inject` property annotation.
   */
  _createFactoryArray(constructorFn: Function): any[] {
    // get the array of dependencies that are needed by this component (as contained in the
    // `$inject` array)
    const args: string[] = constructorFn.$inject || [];
    // create a copy of the array
    const factoryArray: any[] = args.slice();
    // The factoryArray uses Angular's array notation whereby each element of the array is the name
    // of a dependency, and the final item is the factory function itself.
    factoryArray.push((...factoryArgs: string[]) => {
      // return new constructorFn(...args);
      // typescript can't convert the next line, using the output from babel instead
      // const instance = new constructorFn(...factoryArgs);
      const instance: any = new (Function.prototype.bind.apply(
          constructorFn,
          [''].concat(factoryArgs))
      )();
      // see this: https://github.com/michaelbromley/angular-es6/issues/1
      for (const key in instance) {
        instance[key] = instance[key];
      }
      return instance;
    });

    return factoryArray;
  }

  /**
   * Clone a function
   * @param original
   * @returns {Function}
   */
  _cloneFunction(original: Function): Function {
    return function clonedFunction(...args: any[]): any {
      return original.apply(this, args);
    };
  }

  /**
   * Override an object's method with a new one specified by `callback`.
   * @param object
   * @param methodName
   * @param callback
   */
  _override(object: any, methodName: string, callback: Function): void {
    object[methodName] = callback(object[methodName]);
  }
}

function ngRegister(appName: string, dependencies?: string[]): NgRegister {
  return new NgRegister(appName, dependencies);
}

export {
  NgRegister,
  ngRegister,
};
