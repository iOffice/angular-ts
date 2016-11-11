/// <reference types="angular" />
/**
 * Obtained and modified from: https://github.com/michaelbromley/angular-es6
 */
import * as ng from 'angular';
/**
 * A helper class to simplify registering Angular components and provide a consistent syntax for
 * doing so.
 */
declare class NgRegister {
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
    component: Function;
    config: Function;
    run: Function;
    [key: string]: any;
    constructor(appName: string, dependencies?: string[]);
    _wrapMethod(method: string): Function;
    module(): ng.IModule;
    directive(name: string, constructorFunction: Function): NgRegister;
    factory(name: string, constructorFunction: Function): NgRegister;
    /**
     * If the constructorFn is an array of type ['dep1', 'dep2', ..., constructor() {}]
     * we need to pull out the array of dependencies and add it as an $inject property of the
     * actual constructor function.
     */
    _normalizeConstructor(input: Function | Array<any>): Function;
    /**
     * Convert a constructor function into a factory function which returns a new instance of that
     * constructor, with the correct dependencies automatically injected as arguments.
     *
     * In order to inject the dependencies, they must be attached to the constructor function with the
     * `$inject` property annotation.
     */
    _createFactoryArray(constructorFn: Function): any[];
    /**
     * Clone a function
     * @param original
     * @returns {Function}
     */
    _cloneFunction(original: Function): Function;
    /**
     * Override an object's method with a new one specified by `callback`.
     * @param object
     * @param methodName
     * @param callback
     */
    _override(object: any, methodName: string, callback: Function): void;
}
declare function ngRegister(appName: string, dependencies?: string[]): NgRegister;
export { NgRegister, ngRegister };
export default ngRegister;
