import { mix, isinstance } from '../main/mix';
import { expect } from 'chai';

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

  getAC(): number {
    return this.ac;
  }
}

class D extends mix(AB, AC) {
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

describe('mix-diamond:simple', () => {
  describe('extending a simple class', () => {
    class DerivedA extends A {}
    const instance: DerivedA = new DerivedA(100);

    it('should allow us to use its methods', () => {
      expect(instance.getA()).to.eq(100);
    });

    it('should be an instance of the base class', () => {
      expect(instance instanceof A).to.eq(true);
    });
  });

  describe('mixing classes', () => {
    const obj: D = new D(1, 2, 3, 4);

    it('should allow us to use its methods', () => {
      expect(obj.getA()).to.eq(1);
      expect(obj.getAB()).to.eq(2);
      expect(obj.getAC()).to.eq(3);
      expect(obj.getD()).to.eq(4);
    });

    it('should fail when using instanceof on parent classes', () => {
      expect(obj instanceof A).to.eq(false);
      expect(obj instanceof AB).to.eq(false);
      expect(obj instanceof AC).to.eq(false);
      expect(obj instanceof D).to.eq(true);
    });

    it('should be able to use isinstance', () => {
      expect(isinstance(obj, A)).to.eq(true);
      expect(isinstance(obj, AB)).to.eq(true);
      expect(isinstance(obj, AC)).to.eq(true);
      expect(isinstance(obj, D)).to.eq(true);
      expect(isinstance(obj, [A, AB])).to.eq(true);
    });
  });
});
