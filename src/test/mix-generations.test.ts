import { mix, isinstance } from '../main/mix';
import { expect } from 'chai';

/**
 * Tree Representation
 *
 * X -> Y -> A -> B ---
 *           |         |
 *           | -> C ---|
 *                     | -> D --
 *                               |
 *                               | -> F
 * E --------------------------- |
 */

class X {
  x: string;

  constructor(x: string) {
    this.x = x;
  }

  getX(): string {
    return this.x;
  }

  static sayX(): string {
    return 'X';
  }
}

class Y extends X {
  y: string;

  constructor(y: string) {
    super('x');
    this.y = y;
  }

  getY(): string {
    return this.y;
  }

  static sayY(): string {
    return 'Y';
  }
}

class A extends Y {
  a: string;

  constructor(a: string) {
    super('y');
    this.a = a;
  }

  getA(): string {
    return this.a;
  }
}

class B extends A {
  b: string;

  constructor(a: string, b: string) {
    super(a);
    this.b = b;
  }

  getB(): string {
    return this.b;
  }

  getA(): string {
    return `[getA() -> ${super.getA()} from B]`;
  }
}

class C extends A {
  c: string;

  constructor(a: string, c: string) {
    super(a);
    this.c = c;
  }

  getC(): string {
    return this.c;
  }

  getA(): string {
    return `[getA() -> ${super.getA()} from C]`;
  }
}

class D extends mix(B, C) {
  d: string;

  // inherited methods
  getY: () => string;
  getA: () => string;
  getB: () => string;
  getC: () => string;

  constructor(a: string, b: string, c: string, d: string) {
    super([B, a, b], [C, a, c]);
    this.d = d;
  }

  getD(): string {
    return this.d;
  }

  getX(): string {
    return `[getX() -> ${this.callBase(X, 'getX')} from D]`;
  }
}

class E {
  e: string;

  constructor(e: string) {
    this.e = e;
  }

  getE(): string {
    return this.e;
  }
}

class F extends mix(D, E) {
  // inherited methods
  getX: () => string;
  getY: () => string;
  getA: () => string;
  getB: () => string;
  getC: () => string;
  getD: () => string;
  getE: () => string;
  static sayX: () => string;

  constructor() {
    super([D, 'a', 'b', 'c', 'd'], [E, 'e']);
  }
}

class Dummy {}

describe('mix-generations:isinstance', () => {

  describe('isinstance should work through generations', () => {
    const f: F = new F();

    it('should use the method of last mixin when using super', () => {
      expect(f.getX()).to.eq('[getX() -> x from D]');
      expect(f.getY()).to.eq('y');
      expect(f.getA()).to.eq('[getA() -> a from C]');
      expect(f.getB()).to.eq('b');
      expect(f.getC()).to.eq('c');
      expect(f.getD()).to.eq('d');
      expect(f.getE()).to.eq('e');
      expect(F.sayX()).to.eq('X');
    });

    it('should allow us to use instance of correctly', () => {
      expect(isinstance(f, X)).to.eq(true);
      expect(isinstance(f, Y)).to.eq(true);
      expect(isinstance(f, A)).to.eq(true);
      expect(isinstance(f, B)).to.eq(true);
      expect(isinstance(f, C)).to.eq(true);
      expect(isinstance(f, [Dummy, C])).to.eq(true);
      expect(isinstance(f, D)).to.eq(true);
      expect(isinstance(f, E)).to.eq(true);
      expect(isinstance(f, F)).to.eq(true);
      expect(isinstance(f, Dummy)).to.eq(false);
    });

  });

});
