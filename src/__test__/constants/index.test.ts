import testHelper from "..";

describe("Constants: ", () => {
  test("string", () => {
    const exp = `constant`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addConst("constant", "xxx");
      })
    ).toMatchSnapshot();
  });

  test("number", () => {
    const exp = `constant`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addConst("constant", 111);
      })
    ).toMatchSnapshot();
  });

  test("boolean", () => {
    const exp = `constant`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addConst("constant", true);
      })
    ).toMatchSnapshot();
  });

  test("null", () => {
    const exp = `constant`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addConst("constant", null);
      })
    ).toMatchSnapshot();
  });

  test("undefined", () => {
    const exp = `constant`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addConst("constant", undefined);
      })
    ).toMatchSnapshot();
  });

  test("array", () => {
    const exp = `constant`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addConst("constant", ["sss", 777, false, null, undefined]);
      })
    ).toMatchSnapshot();
  });

  test("json", () => {
    const exp = `constant`;
    expect(
      testHelper(exp, (lockPicker) => {
        lockPicker.addConst("constant", {
          number: 111,
          string: "111",
          boolean: false,
          array: ["sss", 777, false, null, undefined],
          object: { ee: 3 },
          null: null,
          undefined: undefined,
        });
      })
    ).toMatchSnapshot();
  });
});
