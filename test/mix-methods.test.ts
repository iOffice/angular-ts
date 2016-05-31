import { mix } from '../src/mix';


class A {

  a: number;

  constructor(a: number) {
    this.a = a;
  }

  getA(): number {
    return this.a;
  }

}


class AB extends A {

  ab: number;

  constructor(a: number, ab: number) {
    super(a);
    this.ab = ab;
  }

  getA(): number {
    return this.a + 1000;
  }

  getAB(): number {
    return this.ab;
  }

}


class AC extends A {

  ac: number;

  constructor(a: number, ac: number) {
    super(a);
    this.ac = ac;
  }

  getA(): number {
    return super.getA() + 2000;
  }

  getAC(): number {
    return this.ac;
  }

}


class D1 extends mix(AB, AC) {

  d: number;

  // Inherited methods
  getA: () => number;
  getAB: () => number;
  getAC: () => number;

  constructor(a: number, ab: number, ac: number, d: number) {
    super([AB, a, ab], [AC, a, ac]);
    this.d = d;
  }

  getD(): number {
    return this.d;
  }
}


class D2 extends mix(AB, AC) {

  d: number;

  // Inherited methods
  getAC: () => number;

  constructor(a: number, ab: number, ac: number, d: number) {
    super([AB, a, ab], [AC, a, ac]);
    this.d = d;
  }

  getA(): number {
    // gives 1
    // same as A.prototype.getA.call(this);
    const fromA: number = this.callBase(A, 'getA');
    // gives 1001
    const fromAB: number = this.callBase(AB, 'getA');
    // gives 2001
    const fromAC: number = this.callBase(AC, 'getA');
    return fromA + fromAB + fromAC;
  }

  getAB(): number {
    return -this.callBase(AB, 'getAB');
  }

  getD(): number {
    return this.d;
  }
}


describe('mix-method:override', () => {

  describe('extending classes should allow us to override', () => {
    const obj1: D1 = new D1(1, 2, 3, 4);
    const obj2: D2 = new D2(1, 2, 3, 4);

    it('should use the method of last mixin when using super', () => {
      expect(obj1.getA()).toBe(2001);
      expect(obj1.getAB()).toBe(2);
      expect(obj1.getAC()).toBe(3);
      expect(obj1.getD()).toBe(4);
    });

    it('should use allow us to use any of the methods from the parents', () => {
      expect(obj2.getA()).toBe(3003);
      expect(obj2.getAB()).toBe(-2);
    });

  });

});
