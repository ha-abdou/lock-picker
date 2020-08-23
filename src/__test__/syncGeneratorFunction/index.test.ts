import testHelper from "..";

function* names(name: string) {
  yield `lolo`;
  yield `toto`;
  yield `fofo`;
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

function* tag(tag: string) {
  yield (name: string) => `${name} ${tag}`;
  yield (name: string) => `${name} ${tag}`;
}

describe("Sync generator functions", () => {
  test("simple", () => {
    const exp = `$lang() + $lang()`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addGeneratorFunction("$lang", lang);
      })
    ).toMatchSnapshot();
  });

  test("simple 2", () => {
    const exp = `$lang() + "/" + $names() + "/" + $lang()`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addGeneratorFunction("$lang", lang);
        lockPicker.addGeneratorFunction("$names", names);
      })
    ).toMatchSnapshot();
  });

  test("nested", () => {
    const exp = '$lang() + "/" + tag(tags())(names())';

    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addGeneratorFunction("$lang", lang);
        lockPicker.addGeneratorFunction("names", names);
        lockPicker.addGeneratorFunction("tags", tags);
        lockPicker.addGeneratorFunction("tag", tag);
      })
    ).toMatchSnapshot();
  });

  test("nested 2", () => {
    const exp = '$lang() + "/" + tag($lang())(names())';

    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addGeneratorFunction("$lang", lang);
        lockPicker.addGeneratorFunction("names", names);
        lockPicker.addGeneratorFunction("tag", tag);
      })
    ).toMatchSnapshot();
  });
});
