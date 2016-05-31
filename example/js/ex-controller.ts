/**
 * TOOD: What happens when we mix to Injectables? The super constructor will be messy, please don't
 * go there. Just don't.
 */
import { Injectable, Inject, mix } from '../../src/index';
import ExService from './ex-service';


class Swimmer {

  swim(): void {
    console.log('swimming...');
  }

}


@Inject(['exService'])
class ExController extends mix(Injectable, Swimmer) {

  exService: ExService;

  constructor(...args: any[]) {
    super([Injectable, ...args], [Swimmer]);
  }

  move(element: JQuery): ExController {
    // Next line will work only if we call it from a DerivedController, if called from
    // an instance of ExController then it won't.
    // console.log('Am I aware of derived injections? ', this.$log);
    element.css('left', `${Math.random() * this.exService.getRange()}px`);
    element.css('top', `${Math.random() * this.exService.getRange()}px`);
    return this;
  }

}


@Inject(['$log'])
class DerivedController extends ExController {

  $log: ng.ILogService;
  exService: ExService;

  constructor(...args: any[]) {
    super(...args);
  }

  move(element: JQuery): DerivedController {
    super.move(element);
    this.$log.log('It has been called. Hey look, its injection: ', this.exService);
    return this;
  }

}


console.log('CHECK EM: ', DerivedController.$inject, ExController.$inject);

export default DerivedController;
