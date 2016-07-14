declare class IMixin {
    constructor(...args: Array<any>[]);
    callBase(base: any, method: string, ...args: any[]): any;
}
declare function mix(...mixins: any[]): typeof IMixin;
declare function isinstance(object: any, classinfo: any): boolean;
export { IMixin, mix, isinstance };
