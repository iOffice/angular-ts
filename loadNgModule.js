"use strict";
/**
 * Utility function to help lazy load angular modules. To use it first require the module with
 * webpacks `bundle` loader:
 *
 *     const lazyBundleCallback = require('bundle?lazy!./realative/path/to/angular/module');
 *
 * Then on the router load it on a resolve, for instance:
 *
 *     .state('somestate', {
 *       url: 'someurl/',
 *       views: {...},
 *       resolve: {
 *          lazyLoadModule: loadNgModule(lazyBundleCallback),
 *       }
 *     });
 *
 * You may call `lazyLoadModule` anything you want, this is just a function that will resolve.
 */
function loadNgModule(callback) {
    return ['$q', '$ocLazyLoad', function ($q, $ocLazyLoad) {
            return $q(function (resolve) {
                callback(function (file) {
                    var module = file["default"];
                    $ocLazyLoad.load({ name: module.name });
                    resolve(module.name);
                });
            });
        }];
}
exports.loadNgModule = loadNgModule;
