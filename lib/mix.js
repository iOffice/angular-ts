"use strict";
function _addBase(clazz, mixin) {
    if (clazz.$$mixins.indexOf(mixin) === -1) {
        clazz.$$mixins.unshift(mixin);
        if (mixin.$$mixins) {
            mixin.$$mixins.forEach(function (base) {
                _addBase(clazz, base);
            });
        }
        var parent_1 = Object.getPrototypeOf(mixin.prototype);
        if (parent_1) {
            _addBase(clazz, parent_1.constructor);
        }
    }
}
var IMixin = (function () {
    function IMixin() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        args.forEach(function (arg) {
            var clazz = arg[0];
            var constructorArgs = arg.slice(1);
            clazz.call.apply(clazz, [_this].concat(constructorArgs));
        });
    }
    IMixin.prototype.callBase = function (base, method) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return (_a = base.prototype[method]).call.apply(_a, [this].concat(args));
        var _a;
    };
    return IMixin;
}());
exports.IMixin = IMixin;
// tslint:disable:typedef
function mix() {
    var mixins = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        mixins[_i - 0] = arguments[_i];
    }
    var Mix = (function (_super) {
        __extends(Mix, _super);
        function Mix() {
            _super.apply(this, arguments);
        }
        Mix.$$mixins = [];
        return Mix;
    }(IMixin));
    mixins.forEach(function (mixin) {
        // Addding parent mixins
        _addBase(Mix, mixin);
        // Necessary to inherit static methods
        for (var p in mixin) {
            if (p !== '$$mixins') {
                Mix[p] = mixin[p];
            }
        }
        // tslint:disable:forin
        for (var prop in mixin.prototype) {
            Mix.prototype[prop] = mixin.prototype[prop];
        }
    });
    return Mix;
}
exports.mix = mix;
// tslint:enable:typedef
function _isinstance(object, classinfo) {
    var proto = Object.getPrototypeOf(object);
    var mixins = proto.constructor.$$mixins;
    var result = object instanceof classinfo;
    if (!result && mixins) {
        for (var index in mixins) {
            if (mixins[index].prototype === classinfo.prototype) {
                result = true;
                break;
            }
        }
    }
    return result;
}
function isinstance(object, classinfo) {
    if (Array.isArray(classinfo)) {
        var result = false;
        for (var index in classinfo) {
            if (_isinstance(object, classinfo[index])) {
                result = true;
                break;
            }
        }
        return result;
    }
    return _isinstance(object, classinfo);
}
exports.isinstance = isinstance;
