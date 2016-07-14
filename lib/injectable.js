"use strict";
function inject(clazz, injectables) {
    if (typeof clazz !== 'function') {
        clazz.constructor.$inject.forEach(function (name, index) {
            clazz[name] = injectables[index];
        });
        return;
    }
    if (!clazz.$inject) {
        clazz.$inject = [];
    }
    else {
        clazz.$inject = clazz.$inject.slice(0);
    }
    injectables.forEach(function (injectable) {
        if (clazz.$inject.indexOf(injectable) === -1) {
            clazz.$inject.push(injectable);
        }
    });
}
exports.inject = inject;
function Inject(args) {
    return function (target) {
        inject(target, args);
    };
}
exports.Inject = Inject;
