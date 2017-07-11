import {
  Inject,
  inject,
  NgComponent,
  NgOnInit,
  NgPostLink,
} from '../../src/index';
import ExService from './ex-service';

@NgComponent({
  selector: 'ex-component',
  template: '<div>I\'m a component!</div>',
})
@Inject([
  '$element',
  '$interval',
  'exService',
])
class ExComponent implements NgOnInit, NgPostLink {
  $element: JQuery;
  $interval: any;
  exService: ExService;

  constructor(...args: any[]) {
    inject(this, args);
  }

  move(element: JQuery): void {
    element.css('left', `${Math.random() * this.exService.getRange()}px`);
    element.css('top', `${Math.random() * this.exService.getRange()}px`);
  }

  $onInit(): void {
    this.$element.css('position', 'absolute');
  }

  $postLink(...args: any[]): void {
    this.$interval(() => this.move(this.$element), 2500);
  }
}

@NgComponent({
  selector: 'ex-red-component',
})
@Inject(['$log'])
class ExRedComponent extends ExComponent implements NgOnInit {
  $log: ng.ILogService;

  constructor(...args: any[]) {
    super(...args);
  }

  move(element: JQuery): void {
    super.move(element);
    this.$log.log('Component move called. Injection: ', this.exService);
  }

  $onInit(): void {
    super.$onInit();
    this.$element.css('color', 'red');
  }
}

export {
  ExComponent,
  ExRedComponent,
};
