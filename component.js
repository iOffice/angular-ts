"use strict";
/**
 * Attaches `__component` to the clazz object. If this property already exists, which can happen
 * when we extend a class, then the function creates a copy of the property and then overrides
 * its values with the new `options`.
 *
 * @param clazz The class which will hold the `__component` property.
 * @param options An object of type `INgComponentOptions`.
 */
function attach(clazz, options) {
    var component = {};
    var currentComponent = clazz.__component;
    // Copying the component
    if (currentComponent) {
        for (var key in currentComponent) {
            if (currentComponent.hasOwnProperty(key)) {
                component[key] = currentComponent[key];
            }
        }
    }
    // Overriding properties
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            component[key] = options[key];
        }
    }
    component.controller = clazz;
    clazz.__component = component;
}
/**
 * Decorator to make an angularJS component. See:
 *
 * https://docs.angularjs.org/guide/component
 * https://docs.angularjs.org/api/ng/service/$compile#life-cycle-hooks
 *
 * @param options
 * @return {(target:any)=>undefined}
 * @constructor
 */
function NgComponent(options) {
    return function (target) {
        attach(target, options);
    };
}
exports.NgComponent = NgComponent;
