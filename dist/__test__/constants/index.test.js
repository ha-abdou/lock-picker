"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
describe("Constants: ", () => {
    test("string", () => {
        const exp = `constant`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addConst("constant", "xxx");
        })).toMatchSnapshot();
    });
    test("number", () => {
        const exp = `constant`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addConst("constant", 111);
        })).toMatchSnapshot();
    });
    test("boolean", () => {
        const exp = `constant`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addConst("constant", true);
        })).toMatchSnapshot();
    });
    test("null", () => {
        const exp = `constant`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addConst("constant", null);
        })).toMatchSnapshot();
    });
    test("undefined", () => {
        const exp = `constant`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addConst("constant", undefined);
        })).toMatchSnapshot();
    });
    test("array", () => {
        const exp = `constant`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addConst("constant", ["sss", 777, false, null, undefined]);
        })).toMatchSnapshot();
    });
    test("json", () => {
        const exp = `constant`;
        expect(__1.default(exp, (lockPicker) => {
            lockPicker.addConst("constant", {
                number: 111,
                string: "111",
                boolean: false,
                array: ["sss", 777, false, null, undefined],
                object: { ee: 3 },
                null: null,
                undefined: undefined,
            });
        })).toMatchSnapshot();
    });
});
//# sourceMappingURL=index.test.js.map