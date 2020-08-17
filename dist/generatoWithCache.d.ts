export declare type TGeneratorWithCache = ((...args: any) => {
    done: boolean;
    value: any;
}) & {
    _next: () => void;
    _reset: () => void;
};
declare function functionGeneratorWithCache(func: () => Generator, ...args: any): TGeneratorWithCache;
export default functionGeneratorWithCache;
