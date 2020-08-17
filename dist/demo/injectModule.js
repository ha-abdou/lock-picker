"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const faker = require("faker");
console.clear();
const lockPicker = new index_1.default(`{
  email: faker.internet.email(),
}`);
lockPicker.injectModule("faker", faker);
lockPicker.compile();
while (!lockPicker.done) {
    console.log(lockPicker.get());
}
//# sourceMappingURL=injectModule.js.map