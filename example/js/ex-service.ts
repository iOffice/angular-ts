class ExService {

  range: number;

  constructor() {
    this.range = 500;
  }

  setRange(range: number): ExService {
    this.range = range;
    return this;
  }

  getRange(): number {
    return this.range;
  }

}

export default ExService;
