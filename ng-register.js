"use strict";
/**
 * Obtained and modified from: https://github.com/michaelbromley/angular-es6
 */
var ng = require("angular");
/* tslint:disable:forin no-invalid-this */
/**
 * A helper class to simplify registering Angular components and provide a consistent syntax for
 * doing so.
 */
var NgRegister = (function () {
    function NgRegister(appName, dependencies) {
        var _this = this;
        if (dependencies === undefined) {
            this.app = ng.module(appName);
        }
        else {
            this.app = ng.module(appName, dependencies);
        }
        var methods = [
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
            'component',
            'config',
            'run',
        ];
        methods.forEach(function (name) {
            _this[name] = _this._wrapMethod(name);
        });
    }
    NgRegister.prototype._wrapMethod = function (method) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            // Casting to `any` since we are relying on access by index
            (_a = _this.app)[method].apply(_a, args);
            return _this;
            var _a;
        };
    };
    NgRegister.prototype.module = function () {
        return this.app;
    };
    NgRegister.prototype.directive = function (name, constructorFunction) {
        var constructorFn = this._normalizeConstructor(constructorFunction);
        var proto = constructorFn.prototype;
        proto.compile = proto.compile || (function () { });
        var originalCompileFn = this._cloneFunction(proto.compile);
        // Decorate the compile method to automatically return the preLink and postLink methods (if
        // they exists) and bind them to the context of the constructor (so `this` works correctly).
        // This gets around the problem of a non-lexical "this" which occurs when the directive class
        // itself returns `this.link` from within the compile function.
        this._override(proto, 'compile', function () { return function compileReturns() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            originalCompileFn.apply(this, args);
            var preLink = proto.preLink ? proto.preLink.bind(this) : function () { };
            var postLink = function () { };
            if (proto.postLink) {
                postLink = proto.postLink.bind(this);
            }
            else if (proto.link) {
                postLink = proto.link.bind(this);
            }
            return {
                pre: preLink,
                post: postLink
            };
        }; });
        var factoryArray = this._createFactoryArray(constructorFn);
        this.app.directive(name, factoryArray);
        return this;
    };
    NgRegister.prototype.factory = function (name, constructorFunction) {
        var constructorFn = this._normalizeConstructor(constructorFunction);
        var factoryArray = this._createFactoryArray(constructorFn);
        this.app.factory(name, factoryArray);
        return this;
    };
    /**
     * If the constructorFn is an array of type ['dep1', 'dep2', ..., constructor() {}]
     * we need to pull out the array of dependencies and add it as an $inject property of the
     * actual constructor function.
     */
    NgRegister.prototype._normalizeConstructor = function (input) {
        var constructorFn;
        if (Array.isArray(input)) {
            var injected = input.slice(0, input.length - 1);
            constructorFn = input[input.length - 1];
            constructorFn.$inject = injected;
        }
        else {
            constructorFn = input;
        }
        return constructorFn;
    };
    /**
     * Convert a constructor function into a factory function which returns a new instance of that
     * constructor, with the correct dependencies automatically injected as arguments.
     *
     * In order to inject the dependencies, they must be attached to the constructor function with the
     * `$inject` property annotation.
     */
    NgRegister.prototype._createFactoryArray = function (constructorFn) {
        // get the array of dependencies that are needed by this component (as contained in the
        // `$inject` array)
        var args = constructorFn.$inject || [];
        // create a copy of the array
        var factoryArray = args.slice();
        // The factoryArray uses Angular's array notation whereby each element of the array is the name
        // of a dependency, and the final item is the factory function itself.
        factoryArray.push(function () {
            var factoryArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                factoryArgs[_i - 0] = arguments[_i];
            }
            // return new constructorFn(...args);
            // typescript can't convert the next line, using the output from babel instead
            // const instance = new constructorFn(...factoryArgs);
            var instance = new (Function.prototype.bind.apply(constructorFn, [''].concat(factoryArgs)))();
            // see this: https://github.com/michaelbromley/angular-es6/issues/1
            for (var key in instance) {
                instance[key] = instance[key];
            }
            return instance;
        });
        return factoryArray;
    };
    /**
     * Clone a function
     * @param original
     * @returns {Function}
     */
    NgRegister.prototype._cloneFunction = function (original) {
        return function clonedFunction() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return original.apply(this, args);
        };
    };
    /**
     * Override an object's method with a new one specified by `callback`.
     * @param object
     * @param methodName
     * @param callback
     */
    NgRegister.prototype._override = function (object, methodName, callback) {
        object[methodName] = callback(object[methodName]);
    };
    return NgRegister;
}());
exports.NgRegister = NgRegister;
function ngRegister(appName, dependencies) {
    return new NgRegister(appName, dependencies);
}
exports.ngRegister = ngRegister;
