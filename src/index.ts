import { Inject, inject } from './injectable';
import {
  INgComponentOptions,
  NgComponent,
  NgOnInit,
  NgDoCheck,
  NgOnChanges,
  NgOnDestroy,
  NgPostLink,
} from './component';
import { Directive } from './directive';
import { ngRegister } from './ng-register';
import { mix, isinstance } from './mix';
import { loadNgModule } from './loadNgModule';

export {
  inject,
  Inject,
  INgComponentOptions,
  NgComponent,
  NgOnInit,
  NgDoCheck,
  NgOnChanges,
  NgOnDestroy,
  NgPostLink,
  Directive,
  ngRegister,
  mix,
  isinstance,
  loadNgModule,
};
