import LockPicker from "../index";

console.clear();
// js expression
const lockPicker = new LockPicker(`{
  url: urlBase + users() + "/" + users() + "/" + $lang(),
  msg: sayHello('me'),
  lang: $lang(),
}`);

lockPicker.addConst("urlBase", "/root/");
lockPicker.addConst("data", { data: "some data" });
lockPicker.addFunction("sayHello", (name: string) => `hello ${name}`);
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
