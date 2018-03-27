import { ngRegister } from '../../src/main/index';
import { ExDirective } from './ex-directive';
import { ExComponent, ExRedComponent } from './ex-component';
import { ExService } from './ex-service';

class DemoController {}

ngRegister('DemoApp', [])
  .run(() => {
    console.log('Calling angular.module run function...');
  })
  .component(ExComponent)
  .component(ExRedComponent)
  .controller('DemoController', DemoController)
  .directive('exDirective', ExDirective)
  .service('exService', ExService)
;

export {
  DemoController,
};
