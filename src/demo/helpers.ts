import LockPicker, { Helpers } from "../index";

console.clear();
const lockPicker = new LockPicker(`{
  url: lang() + "-" + $lang() + "-" + $lang(),
}`);

lockPicker.addGeneratorFunction("lang", Helpers.iterate(["fr", "en"]));
lockPicker.addGeneratorFunction("$lang", Helpers.iterate(["fr", "en"]));
lockPicker.compile();

while (!lockPicker.done) {
  console.log(lockPicker.get());
}
