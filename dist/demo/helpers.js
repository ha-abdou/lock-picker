"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
console.clear();
const lockPicker = new index_1.default(`{
  url: lang() + "-" + $lang() + "-" + $lang(),
}`);
lockPicker.addGeneratorFunction("lang", index_1.Helpers.iterate(["fr", "en"]));
lockPicker.addGeneratorFunction("$lang", index_1.Helpers.iterate(["fr", "en"]));
lockPicker.compile();
while (!lockPicker.done) {
    console.log(lockPicker.get());
}
//# sourceMappingURL=helpers.js.map