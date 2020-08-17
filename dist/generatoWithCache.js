"use strict";
//@ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
function functionGeneratorWithCache(func, ...args) {
    return function thisFunc() {
        if (typeof thisFunc._func == "undefined") {
            thisFunc._func = func(...args);
        }
        if (typeof thisFunc._last_call == "undefined") {
            thisFunc._last_call = thisFunc._func.next();
        }
        if (typeof thisFunc._reset == "undefined") {
            thisFunc._reset = () => {
                thisFunc._func = func(...args);
                thisFunc._last_call = undefined;
            };
        }
        if (typeof thisFunc._next == "undefined") {
            thisFunc._next = () => (thisFunc._last_call = thisFunc._func.next());
        }
        return thisFunc._last_call;
    };
}
exports.default = functionGeneratorWithCache;
//# sourceMappingURL=generatoWithCache.js.map