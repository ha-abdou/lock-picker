"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
function* hi(name) {
    let i = 0;
    yield `hi ${name} - ${i++}`;
    yield `hi ${name} - ${i++}`;
    yield `hi ${name} - ${i}`;
}
function* names() {
    yield "lolo";
    yield "toto";
}
function* tag(tag) {
    yield (name) => `${name} ${tag}`;
    yield (name) => `${name} ${tag}`;
}
function* tags() {
    yield "taged";
    yield "tageddd";
}
describe("Generator functions:", () => {
    test("simple", () => {
        const exp = `hi("ee")`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addGeneratorFunction("hi", hi);
        })).toMatchSnapshot();
    });
    test("nested", () => {
        const exp = `hi(hi("ee"))`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addGeneratorFunction("hi", hi);
        })).toMatchSnapshot();
    });
    test("super nested", () => {
        const exp = `hi(hi(hi(hi(hi("ee")))))`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addGeneratorFunction("hi", hi);
        })).toMatchSnapshot();
    });
    test("super nested 2", () => {
        const exp = `hi(hi(hi(hi(hi(names())))))`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addGeneratorFunction("hi", hi);
            lockPicker.addGeneratorFunction("names", names);
        })).toMatchSnapshot();
    });
    test("function return function", () => {
        const exp = `hi(tag('taged')(names()))`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addGeneratorFunction("hi", hi);
            lockPicker.addGeneratorFunction("names", names);
            lockPicker.addGeneratorFunction("tag", tag);
        })).toMatchSnapshot();
    });
    test("function return function 2", () => {
        const exp = `hi(tag(tags())(names()))`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addGeneratorFunction("hi", hi);
            lockPicker.addGeneratorFunction("names", names);
            lockPicker.addGeneratorFunction("tag", tag);
            lockPicker.addGeneratorFunction("tags", tags);
        })).toMatchSnapshot();
    });
});
//# sourceMappingURL=index.test.js.map