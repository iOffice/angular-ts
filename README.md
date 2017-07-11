# Angular TS

[![NPM Version](https://img.shields.io/npm/v/angular-ts.svg)](https://www.npmjs.com/package/angular-ts)
[![License](https://img.shields.io/npm/l/angular-ts.svg)](LICENSE)


This library provides `ngRegister`, a modified version of Michael Browmley's [`register.js`][1].

## Example

`angular-ts` allows us to declare classes and register them as angular components. Here is a summary

```typescript
import { ngRegister } from 'angular-ts';

class MyAngularComponent {
  constructor(dependency1, dependency2) {
    this.dependency1 = dependency1;
    this.dependency2 = dependency2;
    // stuff happens here
  }

  someMethods() {
    this.dependency1.doThatThing();
    this.dependency2.doThatOtherThing();
    // more stuff here
  }
}
MyAngularComponent.$inject = ['dependency1', 'dependency2'];

ngRegister('app')
  .controller('MyController', MyAngularComponent)
  .service('myService', MyAngularComponent1)
  .provider('myOtherService', MyAngularComponent2)
  .factory('myFactory', MyAngularComponent3)
  .directive('myDirective', MyAngularComponent4);
```

or if you prefer to use the dependencies without declaring them you may use the `inject` function.

```typescript
import { ngRegister, inject } from 'angular-ts';

class MyAngularComponent {
  constructor(...args) {
    inject(this, args);
    // stuff happens here
  }

  someMethods() {
    this.dependency1.doThatThing();
    this.dependency2.doThatOtherThing();
    // more stuff here
  }
}
inject(MyAngularComponent, ['dependency1', 'dependency2']);

ngRegister('app')
  .controller('MyController', MyAngularComponent)
  .service('myService', MyAngularComponent1)
  .provider('myOtherService', MyAngularComponent2)
  .factory('myFactory', MyAngularComponent3)
  .directive('myDirective', MyAngularComponent4);
```

If you are using the `experimentalDecorators` option in the typescript compiler you may wish to
use the `Inject` decorator. This allows us to write the previous example as

```typescript
import { ngRegister, inject } from 'angular-ts';

@Inject(['dependency1', 'dependency2'])
class MyAngularComponent {
  constructor(...args) {
    inject(this, args);
    // stuff happens here
  }

  someMethods() {
    this.dependency1.doThatThing();
    // more stuff here
  }
}

ngRegister('app')
  .controller('MyController', MyAngularComponent)
  .service('myService', MyAngularComponent1)
  .provider('myOtherService', MyAngularComponent2)
  .factory('myFactory', MyAngularComponent3)
  .directive('myDirective', MyAngularComponent4);
```

## Directives

The angular-1.x directives usually have a lot of options that you can provide. At some point it can
get annoying writing something like


```typescript
import { Inject } from 'angular-ts';

@Inject(['a', 'b'])
class MyDirective {
  // Directive options
  template: string;
  requires: string[];
  // ... other directive options

  // Injected Dependencies
  a: any;
  b: any;

  constructor(...args: any[]) {
    inject(this, args);
    this.template = 'template goes here';
    this.requires = ['other directives'];
    // ...
    // and so on ...
  }

}
```


Instead, we may extend from `Directive` and skip declaring the directive options.

```typescript
import { Directive, Inject } from 'angular-ts';

@Inject(['a', 'b'])
class MyDirective extends Directive {
  // Injected Dependencies
  a: any;
  b: any;

  constructor(...args: any[]) {
    super(args);
    this.template = 'template goes here';
    this.requires = ['other directives'];
    // ...
    // and so on ...
  }
}
```

This tells the typescript compiler that the class already declares `template`, `requires` and
all the other options that a directive provides. Note that all a `Directive` does is call `inject`
during initialization as it has been previously done, so do not forget to call the `super`
constructor with `args`.

For other examples see `example/js/ex-directive.js`. One thing to mention here is that
`compile`, `link`, `preLink` and `postLink` are optional methods. Please note however that if
`postLink` and `link` are both declared then only the `postLink` method will be called. These two
methods should be one and the same so only declare one.


## Component

Angular 1.5 introduces `components`. These are were made to make migration to Angular 2 a bit
easier. In order to migrate we can write components as follows:

```typescript
import {
  Inject,
  inject,
  NgComponent,
  NgOnInit,
  NgPostLink,
} from 'angular-ts';

@NgComponent({
  selector: 'ex-component',
  template: '<div>This is the template</div>',
})
@Inject([
  '$element',
])
class ExComponent implements NgOnInit, NgPostLink {
  $element: JQuery;

  constructor(...args: any[]) {
    inject(this, args);
  }

  $onInit(): void {
    this.$element.css('color', 'red');
  }

  $postLink(): void {
    console.log('This is the postLink hook, analogous to the ngAfterViewInit and ngAfterContentInit hooks in Angular 2');
  }
}

export {
  ExComponent,
};
```

To register the component you don't have to provide the selector name since this is already defined
in the `NgComponent` decorator.

```typescript
import { ExComponent } from 'ExComponent'

ngRegister('app')
  .component(ExComponent);
```

See <https://docs.angularjs.org/guide/component> for more information on components and
<https://docs.angularjs.org/api/ng/service/$compile#life-cycle-hooks> for an in depth explanation
on the life cycle hooks.

## Mixins

If you need to make a component that is a `Directive` and extends from some other class you may
use the `mix` function provided by this library. For instance:


```typescript
import { Directive, Inject, mix } from 'angular-ts';

class OtherClass {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  getA() {
    return this.a;
  }
}

@Inject([
  'dep1',
  'dep2',
  // and so on ...
])
class SomeController extends mix(Directive, OtherClass) {
  constructor(...args) {
    super([Directive, args], [OtherClass, 1, 2, 3]);
  }

  doSomething() {
    console.log('Calling OtherClass method: ', this.getA());
    console.log('Using dependencies: ', this.dep1.somemethod);
  }
}
```

NOTE: Do not use `instanceof` when using `mix`. Instead use the `isinstance` function provided by
the library.


## API

#### `inject(clazz: any, injectables: (string | any)[]): void`

Can be used after a class declaration to inject its dependencies as well as inside the constructor
to attach the dependencies to an instance of the class.

```typescript
import { inject } from 'angular-ts';

class A {
  constructor(...args: any[]) {
    inject(this, args);
  }
}
inject(A, ['a', 'b']);
```

Note that when using after the declaration we must provide the class object and not an instance as
we have done in the constructor.

#### `Inject(args: string[]): Function`

A decorator to replace using `inject` after the class declaration. This allows us to see the
dependencies that an angular component uses right in the class declaration.

```typescript
import { Inject, inject } from 'angular-ts';

@Inject(['a', 'b'])
class A {
  constructor(...args: any[]) {
    inject(this, args);
  }
}
```

### `class Directive`

Utility class which provides the following interface:

```typescript
interface Directive {
    controller?: any;
    controllerAs?: string;
    bindToController?: boolean | Object;
    multiElement?: boolean;
    name?: string;
    priority?: number;
    replace?: boolean;
    require?: string | string[] | {
        [controller: string]: string;
    };
    restrict?: string;
    scope?: boolean | Object;
    template?: string | Function;
    templateNamespace?: string;
    templateUrl?: string | Function;
    terminal?: boolean;
    transclude?: boolean | string | {
        [slot: string]: string;
    };
    compile?(templateElement: ng.IAugmentedJQuery, templateAttributes: ng.IAttributes, transclude?: ng.ITranscludeFunction): void;
    link?(scope: ng.IScope, instanceElement: ng.IAugmentedJQuery, instanceAttributes: ng.IAttributes, controller: any, transclude: ng.ITranscludeFunction): void;
    preLink?(scope: ng.IScope, instanceElement: ng.IAugmentedJQuery, instanceAttributes: ng.IAttributes, controller: any, transclude: ng.ITranscludeFunction): void;
    postLink?(scope: ng.IScope, instanceElement: ng.IAugmentedJQuery, instanceAttributes: ng.IAttributes, controller: any, transclude: ng.ITranscludeFunction): void;
}
```

Any angular component extending from `Directive` will need to call `super` with the constructors
`arguments`.

```typescript
import { Directive, Inject } from 'angular-ts';

@Inject(['a', 'b'])
class A extends Directive {
  constructor(...args: any[]) {
    super(args);
  }
}
```

#### `ngRegister(appName: string, dependencies?: string[]): NgRegister`

Provides a wrapper for `angular.module`, we can create a brand new angular module by providing the
module dependencies or get the angular module by omitting them. This will return an instance of
`NgRegister` which provides all the methods an angular module has: `controller`, `directive`,
`service`, etc. To obtain the non-wrapped angular module use the method `module`.

```typescript
import { ngRegister } from 'angular-ts';

const app = ngRegister('mymodule', [])
  .controller('ctrl', Ctr)
  .directive('dir', Dir)
  // ...
  .module();
```

#### `mix(...mixins: any[]): typeof IMixin`

Allows us to create a custom class which combines all the methods of the specified `mixins`.

```typescript
class A {
  a: number;
  constructor(a: number) {
    this.a = a;
  }
  printA() { console.log(this.a); }
}

class B {
  b: number;
  constructor(b: number) {
    this.b = b;
  }
  printB() { console.log(this.b); }
}

class C extends mix(A, B) {
  c: number;
  constructor(a: number, b: number, c: number) {
    super([A, a], [B, b]);
    this.c = c;
  }
  printC() { console.log('c'); }
}

const obj: C = new C(1, 2, 3);
obj.printA();
obj.printB();
obj.printC();
```

#### `isinstance(object: any, classinfo: any): boolean`

Used to check if an object is an instance of a given class. We may provide an array in the second
argument if we want to check if an object is an instance of any of classes in the array.


#### `loadNgModule(callback: Function): any[]`,

Utility function to help lazy load angular modules. To use it first require the module with
webpacks `bundle` loader:

    const lazyBundleCallback = require('bundle?lazy!./realative/path/to/angular/module');

Then on the router load it on a resolve, for instance:

    .state('somestate', {
      url: 'someurl/',
      views: {...},
      resolve: {
         lazyLoadModule: loadNgModule(lazyBundleCallback),
      }
    });

You may call `lazyLoadModule` anything you want, this is just a function that will resolve.

Note: You will need to register `ocLazyLoad` with the app in order for this to work.


[1]: https://github.com/michaelbromley/angular-es6
