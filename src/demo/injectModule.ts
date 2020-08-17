import LockPicker from "../index";
const faker = require("faker");

console.clear();

const lockPicker = new LockPicker(`{
  email: faker.internet.email(),
}`);

lockPicker.injectModule("faker", faker);
lockPicker.compile();

while (!lockPicker.done) {
  console.log(lockPicker.get());
}
