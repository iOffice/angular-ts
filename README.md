# Angular TS

This library provides the `ngRegister` function which is a modified copy of Michael Bromley's
[`register.js`][1].

## Example

The library allows us to declare classes and register them as angular components. Here is a summary

```javascript
import { ngRegister } from 'angular-es6';


class MyAngularComponent {

    constructor(dependency1, dependency2) {
        this.dependency1 = dependency1;
        // stuff happens here
    }
    someMethods() {
        this.dependency1.doThatThing();
        // more stuff here
    }
}
MyAngularComponent.$inject = ['dependency1', 'dependency2'];


ngRegister('app')
    .controller('MyController', MyAngularComponent)
    .service('myService', MyAngularComponent)
    .provider('myOtherService', MyAngularComponent)
    .factory('myFactory', MyAngularComponent)
    .directive('myDirective', MyAngularComponent);
```

or if you prefer to use the dependencies without declaring them you may inherit from `Injectable`.

```javascript
import { ngRegister, Injectable } from 'angular-ts';


class MyAngularComponent extends Injectable {

    constructor(...args) {
        super(...args);
        // stuff happens here
    }
    someMethods() {
        this.dependency1.doThatThing();
        // more stuff here
    }
}
Injectable.inject(MyAngularComponent, ['dependency1', 'dependency2']);


ngRegister('app')
    .controller('MyController', MyAngularComponent)
    .service('myService', MyAngularComponent)
    .provider('myOtherService', MyAngularComponent)
    .factory('myFactory', MyAngularComponent)
    .directive('myDirective', MyAngularComponent);
```

**NOTE:** Do not forget to call the `super` constructor with `...args`.

If you need to make a component that is `Injectable` and extends from some other class you may
use the `mix` function provided by this library. For instance:

```javascript
import { Injectable, mix } from 'angular-ts';


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

class SomeController extends mix(Injectable, OtherClass) {

  constructor(...args) {
    super([Injectable, ...args], [OtherClass, 1, 2, 3]);
  }

  doSomething() {
    console.log('Calling OtherClass method: ', this.getA());
    console.log('Using dependencies: ', this.dep1.somemethod);
  }

}
Injectable.inject(SomeController, [
  'dep1',
  'dep2',
  // and so on ...
]);
```

If we have `experimentalDecorators` turned on on the typescript compiler we may write an angular
component as follows:

```javascript
import { ngRegister, Injectable, Inject } from 'angular-ts';


@Inject(['dependency1', 'dependency2'])
class MyAngularComponent extends Injectable {

    constructor(...args) {
        super(...args);
        // stuff happens here
    }
    someMethods() {
        this.dependency1.doThatThing();
        // more stuff here
    }
}


ngRegister('app')
    .controller('MyController', MyAngularComponent)
    .service('myService', MyAngularComponent)
    .provider('myOtherService', MyAngularComponent)
    .factory('myFactory', MyAngularComponent)
    .directive('myDirective', MyAngularComponent);
```


NOTE: Do not use `instanceof` when using `mix`. Instead use the `isinstance` function provided by
the library.

### Creating directives

See `example/js/ex-directive.js`. One thing to mention here is that `compile`, `link`, `preLink` and
`postLink` are optional methods. Please note however that if `postLink` and `link` are both declared
then only the `postLink` method will be called. These two methods should be one and the same so only
declare one.

### IE & Babel WARNING

When using inheritance using babel we need the following polyfill in IE:

```javascript
const key = 'setPrototypeOf';
if (typeof Object[key] === 'undefined') {
  Object[key] = require('babel-runtime/helpers/defaults.js').default;
}
```

[1]: https://github.com/michaelbromley/angular-es6
