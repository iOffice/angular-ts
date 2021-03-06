import { DerivedController } from './ex-controller';
import { Directive, Inject } from '../../src/main/index';

@Inject(['$interval'])
class ExDirective extends Directive {
  $interval: any;

  constructor(...args: any[]) {
    super(args);
    console.log('ExDirective: ', this);
    this.template = '<div>I\'m a directive!</div>';
    this.restrict = 'EA';
    this.scope = {};
    this.controller = DerivedController;
    // etc. for the usual config options
  }

  // optional compile function
  compile(tElement: JQuery): void {
    tElement.css('position', 'absolute');
  }

  // optional link function
  link(_scope: any, element: any, _attr: any, ctrl: DerivedController): void {
    this.$interval(() => ctrl.move(element), 2500);
  }
}

export {
  ExDirective,
};
