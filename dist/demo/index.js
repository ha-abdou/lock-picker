"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
console.clear();
// js expression
const lockPicker = new index_1.default(`{
  url: urlBase + users() + "/" + users() + "/" + $lang(),
  msg: sayHello('me'),
  lang: $lang(),
}`);
lockPicker.addConst("urlBase", "/root/");
lockPicker.addConst("data", { data: "some data" });
lockPicker.addFunction("sayHello", (name) => `hello ${name}`);
// if you target es5 use addGeneratorFunction, es6 you can use addFunction for generator function
lockPicker.addGeneratorFunction("users", function* () {
    yield "sam";
    yield "bob";
});
// wen function name start with $ all call return same result for the iteration
lockPicker.addGeneratorFunction("$lang", function* () {
    yield "fr";
    yield "en";
});
lockPicker.compile();
while (!lockPicker.done) {
    console.log(lockPicker.get());
}
//# sourceMappingURL=index.js.map