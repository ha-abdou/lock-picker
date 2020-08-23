//@ts-nocheck

export type TGeneratorWithCache = ((...args: any) => { done: boolean; value: any }) & {
  _next: () => void;
  _reset: () => void;
};

function functionGeneratorWithCache(func: () => Generator, ...args: any): TGeneratorWithCache {
  return function thisFunc(): any {
    if (typeof thisFunc._func == 'undefined') {
      thisFunc._func = func(...args);
    }
    if (typeof thisFunc._last_call == 'undefined') {
      thisFunc._last_call = thisFunc._func.next();
    }
    if (typeof thisFunc._reset == 'undefined') {
      thisFunc._reset = () => {
        thisFunc._func = func(...args);
        thisFunc._last_call = undefined;
      };
    }
    if (typeof thisFunc._next == 'undefined') {
      thisFunc._next = () => (thisFunc._last_call = thisFunc._func.next());
    }
    return thisFunc._last_call;
  };
}

export default functionGeneratorWithCache;
