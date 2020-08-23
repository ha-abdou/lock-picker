import testHelper from "..";

function hi(name: string) {
  return "hi " + name;
}

function echo(str: string) {
  return str;
}

function returnFunction(param1: string) {
  return (param2: string) => param1 + " - " + param2;
}

const name = "lolo";

describe("Functions: ", () => {
  test("simple", () => {
    const exp = `hi("ee")`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addFunction("hi", hi);
      })
    ).toMatchSnapshot();
  });

  test("nested", () => {
    const exp = `hi(hi("ee"))`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addFunction("hi", hi);
      })
    ).toMatchSnapshot();
  });

  test("super nested", () => {
    const exp = `echo(echo(echo(echo(hi(hi(name))))))`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addConst("name", name);
        lockPicker.addFunction("echo", echo);
        lockPicker.addFunction("hi", hi);
      })
    ).toMatchSnapshot();
  });

  test("function return function", () => {
    const exp = `echo(f("param 1")("param 2"))`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addFunction("echo", echo);
        lockPicker.addFunction("f", returnFunction);
      })
    ).toMatchSnapshot();
  });
});
