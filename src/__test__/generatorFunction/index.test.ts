import testHelper from "..";

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

function* tags() {
  yield "taged";
  yield "tageddd";
}

describe("Generator functions:", () => {
  test("simple", () => {
    const exp = `hi("ee")`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addGeneratorFunction("hi", hi);
      })
    ).toMatchSnapshot();
  });

  test("nested", () => {
    const exp = `hi(hi("ee"))`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addGeneratorFunction("hi", hi);
      })
    ).toMatchSnapshot();
  });

  test("super nested", () => {
    const exp = `hi(hi(hi(hi(hi("ee")))))`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addGeneratorFunction("hi", hi);
      })
    ).toMatchSnapshot();
  });

  test("super nested 2", () => {
    const exp = `hi(hi(hi(hi(hi(names())))))`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addGeneratorFunction("hi", hi);
        lockPicker.addGeneratorFunction("names", names);
      })
    ).toMatchSnapshot();
  });

  test("function return function", () => {
    const exp = `hi(tag('taged')(names()))`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addGeneratorFunction("hi", hi);
        lockPicker.addGeneratorFunction("names", names);
        lockPicker.addGeneratorFunction("tag", tag);
      })
    ).toMatchSnapshot();
  });

  test("function return function 2", () => {
    const exp = `hi(tag(tags())(names()))`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addGeneratorFunction("hi", hi);
        lockPicker.addGeneratorFunction("names", names);
        lockPicker.addGeneratorFunction("tag", tag);
        lockPicker.addGeneratorFunction("tags", tags);
      })
    ).toMatchSnapshot();
  });
});
