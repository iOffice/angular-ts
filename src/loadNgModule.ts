import ILazyLoad = oc.ILazyLoad;
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
function loadNgModule(callback: Function): Function {
  return ($q: ng.IQService, $ocLazyLoad: ILazyLoad) => {
    return $q((resolve: Function) => {
      callback((file: any) => {
        const module: any = file.default;
        $ocLazyLoad.load({ name: module.name, files: [] });
        resolve(module.name);
      });
    });
  };
}

export default loadNgModule;
