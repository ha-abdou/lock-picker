"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
function testHelper(exp, callback) {
    const lockPicker = new __1.default(exp);
    const res = [];
    callback(lockPicker);
    lockPicker.compile();
    while (!lockPicker.done) {
        res.push(lockPicker.get());
    }
    return res;
}
exports.default = testHelper;
//# sourceMappingURL=index.js.map