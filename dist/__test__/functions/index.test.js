"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
function hi(name) {
    return "hi " + name;
}
function echo(str) {
    return str;
}
function returnFunction(param1) {
    return (param2) => param1 + " - " + param2;
}
const name = "lolo";
describe("Functions: ", () => {
    test("simple", () => {
        const exp = `hi("ee")`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addFunction("hi", hi);
        })).toMatchSnapshot();
    });
    test("nested", () => {
        const exp = `hi(hi("ee"))`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addFunction("hi", hi);
        })).toMatchSnapshot();
    });
    test("super nested", () => {
        const exp = `echo(echo(echo(echo(hi(hi(name))))))`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addConst("name", name);
            lockPicker.addFunction("echo", echo);
            lockPicker.addFunction("hi", hi);
        })).toMatchSnapshot();
    });
    test("function return function", () => {
        const exp = `echo(f("param 1")("param 2"))`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addFunction("echo", echo);
            lockPicker.addFunction("f", returnFunction);
        })).toMatchSnapshot();
    });
});
//# sourceMappingURL=index.test.js.map