import { inject } from './injectable';


interface Directive {
  controller?: any;
  controllerAs?: string;
  bindToController?: boolean | Object;
  multiElement?: boolean;
  name?: string;
  priority?: number;
  replace?: boolean;
  require?: string | string[] | {[controller: string]: string};
  restrict?: string;
  scope?: boolean | Object;
  template?: string | Function;
  templateNamespace?: string;
  templateUrl?: string | Function;
  terminal?: boolean;
  transclude?: boolean | string | {[slot: string]: string};

  compile?(
    templateElement: ng.IAugmentedJQuery,
    templateAttributes: ng.IAttributes,
    transclude?: ng.ITranscludeFunction
  ): void;

  link?(
    scope: ng.IScope,
    instanceElement: ng.IAugmentedJQuery,
    instanceAttributes: ng.IAttributes,
    controller: any,
    transclude: ng.ITranscludeFunction
  ): void;

  preLink?(
    scope: ng.IScope,
    instanceElement: ng.IAugmentedJQuery,
    instanceAttributes: ng.IAttributes,
    controller: any,
    transclude: ng.ITranscludeFunction
  ): void;

  postLink?(
    scope: ng.IScope,
    instanceElement: ng.IAugmentedJQuery,
    instanceAttributes: ng.IAttributes,
    controller: any,
    transclude: ng.ITranscludeFunction
  ): void;

}


class Directive {

  constructor(args: any[]) {
    inject(this, args);
  }

}


export {
  Directive,
};
