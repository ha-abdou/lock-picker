"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
function* names(name) {
    yield `lolo`;
    yield `toto`;
    yield `fofo`;
}
function* lang() {
    yield "fr";
    yield "en";
    yield "it";
}
function* tags() {
    yield "tag1";
    yield "tag2";
}
function* tag(tag) {
    yield (name) => `${name} ${tag}`;
    yield (name) => `${name} ${tag}`;
}
describe("Sync generator functions", () => {
    test("simple", () => {
        const exp = `$lang() + $lang()`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addGeneratorFunction("$lang", lang);
        })).toMatchSnapshot();
    });
    test("simple 2", () => {
        const exp = `$lang() + "/" + $names() + "/" + $lang()`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addGeneratorFunction("$lang", lang);
            lockPicker.addGeneratorFunction("$names", names);
        })).toMatchSnapshot();
    });
    test("nested", () => {
        const exp = '$lang() + "/" + tag(tags())(names())';
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addGeneratorFunction("$lang", lang);
            lockPicker.addGeneratorFunction("names", names);
            lockPicker.addGeneratorFunction("tags", tags);
            lockPicker.addGeneratorFunction("tag", tag);
        })).toMatchSnapshot();
    });
    test("nested 2", () => {
        const exp = '$lang() + "/" + tag($lang())(names())';
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addGeneratorFunction("$lang", lang);
            lockPicker.addGeneratorFunction("names", names);
            lockPicker.addGeneratorFunction("tag", tag);
        })).toMatchSnapshot();
    });
});
//# sourceMappingURL=index.test.js.map