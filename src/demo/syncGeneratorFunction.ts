import LockPicker, { Helpers } from "../index";
console.clear();
const lockPicker = new LockPicker(`$echo(lang()) + ' : ' + $echo(lang())`);

function* echo(str: string) {
  let i = 1;
  yield `${i++} - ${str}`;
  yield `${i++} - ${str}`;
  yield `${i++} - ${str}`;
}

lockPicker.addGeneratorFunction("$echo", echo);
lockPicker.addGeneratorFunction("lang", Helpers.iterate(["fr", "en"]));
lockPicker.addGeneratorFunction("$lang", Helpers.iterate(["fr", "en"]));

lockPicker.compile();

while (!lockPicker.done) {
  console.log(lockPicker.get());
}
