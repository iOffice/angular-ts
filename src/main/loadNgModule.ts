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
function loadNgModule(callback: any): any[] {
  return ['$q', '$ocLazyLoad', ($q: ng.IQService, $ocLazyLoad: any) => {
    return $q((resolve: Function) => {
      callback((file: any) => {
        const modules = Object.keys(file).filter(key => key.endsWith('Module'));
        if (modules.length !== 1) {
          throw new Error('More than one module is exported in lazy module');
        }

        const module: any = file[modules[0]];
        $ocLazyLoad.load({ name: module.name });
        resolve(module.name);
      });
    });
  }];
}

export {
  loadNgModule,
};
