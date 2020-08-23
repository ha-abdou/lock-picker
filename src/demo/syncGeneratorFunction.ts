import LockPicker, { Helpers } from "../index";
console.clear();

function* hi(name: string) {
  let i = 0;
  yield `hi ${name} - ${i++}`;
  yield `hi ${name} - ${i++}`;
  yield `hi ${name} - ${i}`;
}

function* names() {
  yield "lolo";
  yield "toto";
}

function* tag(tag: string) {
  yield (name: string) => `${name} ${tag}`;
  yield (name: string) => `${name} ${tag}`;
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

// `$lang() + "/" + $tag($lang())(names())`
const lockPicker = new LockPicker(`hi(tag(tags())(names()))`);

lockPicker.addGeneratorFunction("$lang", lang);
lockPicker.addGeneratorFunction("lang", lang);
lockPicker.addGeneratorFunction("names", names);
lockPicker.addGeneratorFunction("tag", tag);
lockPicker.addGeneratorFunction("tags", tags);

lockPicker.addGeneratorFunction("hi", hi);
lockPicker.addGeneratorFunction("names", names);
lockPicker.addGeneratorFunction("tag", tag);
lockPicker.addGeneratorFunction("tags", tags);

lockPicker.compile();

while (!lockPicker.done) {
  console.log(lockPicker.get());
}
