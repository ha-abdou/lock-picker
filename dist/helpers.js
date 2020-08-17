"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate = void 0;
function iterate(arr) {
    return function* () {
        for (let i = 0; i < arr.length; i++) {
            yield arr[i];
        }
    };
}
exports.iterate = iterate;
//# sourceMappingURL=helpers.js.map