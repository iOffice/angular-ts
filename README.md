# Angular TS

This library provides the `ngRegister` function which is a modified copy of Michael Bromley's
[`register.js`][1].

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
use the `Inject`. This allows us to write the previous example as

```typescript
import { ngRegister, inject } from 'angular-ts';

@Inject(['dependency1', 'dependency2']);
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
    this.requires: ['other directives']
    ...
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
    this.requires: ['other directives']
    ...
    // and so on ...
  }

}
```

This should tell the typescript compiler that the class already declares `template`, `requires` and
all the other options that a directive provides. Note that the internally all a `Directive` does is
call `inject` as it has been previously done, so do not forget to call the `super` constructor with
`args`.

For other examples see `example/js/ex-directive.js`. One thing to mention here is that
`compile`, `link`, `preLink` and `postLink` are optional methods. Please note however that if
`postLink` and `link` are both declared then only the `postLink` method will be called. These two
methods should be one and the same so only declare one.


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


[1]: https://github.com/michaelbromley/angular-es6
