"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
console.clear();
function* hi(name) {
    let i = 0;
    yield `hi ${name} - ${i++}`;
    yield `hi ${name} - ${i++}`;
    yield `hi ${name} - ${i}`;
}
function* names() {
    yield "lolo";
    yield "toto";
}
function* tag(tag) {
    yield (name) => `${name} ${tag}`;
    yield (name) => `${name} ${tag}`;
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
const lockPicker = new index_1.default(`hi(tag(tags())(names()))`);
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
//# sourceMappingURL=syncGeneratorFunction.js.map