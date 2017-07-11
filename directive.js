"use strict";
var injectable_1 = require('./injectable');
var Directive = (function () {
    function Directive(args) {
        injectable_1.inject(this, args);
    }
    return Directive;
}());
exports.Directive = Directive;
