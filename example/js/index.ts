import { ngRegister } from '../../src/index';
import ExDirective from './ex-directive';
import ExService from './ex-service';


class DemoController {}

ngRegister('DemoApp', [])
  .run(() => {
    console.log('Calling angular.module run function...');
  })
  .controller('DemoController', DemoController)
  .directive('exDirective', ExDirective)
  .service('exService', ExService)
;
