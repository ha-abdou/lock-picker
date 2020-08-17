import { parseExpression } from "@babel/parser";
import { Expression, Node } from "@babel/types";
import generate from "@babel/generator";
import Mapper from "./mapper";
import functionGeneratorWithCache, {
  TGeneratorWithCache,
} from "./generatoWithCache";
export * as Helpers from "./helpers";

type ILiteralValue = string | number | boolean | IJson | IJsonArray;

interface IJson {
  [x: string]: string | number | boolean | IJson | IJsonArray;
}
interface IJsonArray
  extends Array<string | number | boolean | IJson | IJsonArray> {}

export interface IConstants {
  [key: string]: ILiteralValue;
}

interface IFunctions {
  [key: string]: (...args: any) => any;
}

interface IGeneratorInstances {
  [key: string]: TGeneratorWithCache | null;
}

interface IGeneratorFunctions {
  [key: string]: () => Generator<any>;
}

class LockPicker {
  rawExpression: string;
  expression: Expression;
  constants: IConstants = {};
  functions: IFunctions = {};
  generatorFunctions: IGeneratorFunctions = {};
  generatorInstances: IGeneratorInstances = {};
  modules: { [name: string]: any } = {};
  mapper = new Mapper();
  mappedTree: Node | undefined;
  compiledExpression: string = "";
  done = false;

  constructor(expression: string) {
    if (!expression || typeof expression !== "string" || expression === "") {
      throw new Error("Not valide string expression");
    }
    this.rawExpression = expression;
    this.expression = parseExpression(expression);
  }

  compile = () => {
    this.mapper.setIdentifiers(Object.keys(this.constants));
    this.mapper.setCallExpressions(Object.keys(this.functions));
    this.mapper.setGeneratorCallExpressions(
      Object.keys(this.generatorFunctions)
    );
    this.mappedTree = this.mapper.map(this.expression);
    this.compiledExpression = generate(this.mappedTree as Node).code;
    this.mapper.generatorCalls.sort((a, b) => a.depth - b.depth);
    this.mapper.generatorCalls = this.mapper.generatorCalls.map((call) => {
      this.generatorInstances[`_${call.id}_${call.name}`] = null;
      return {
        ...call,
        name: `_${call.id}_${call.name}`,
      };
    });
  };

  get = (): any => {
    if (this.done) {
      return;
    }
    const getVar = (name: string) => this.constants[name];
    const callFunc = (name: string, ...args: any) =>
      this.functions[name](...args);
    const callGeneratorFunc = (name: string, ...args: any) => {
      if (
        this.generatorInstances[name] === null ||
        this.generatorInstances[name]?.().done
      ) {
        this.initGenerator(name, ...args);
      }
      return this.generatorInstances[name]?.().value;
    };
    let modules = "";
    for (const name in this.modules) {
      modules += `const ${name} = this.modules['${name}'];`;
    }
    const res = eval(`${modules} (${this.compiledExpression})`);
    this.next();
    return res;
  };

  next = (): boolean => {
    const callsLength = this.mapper.generatorCalls.length;

    for (let i = 0; i < callsLength; i++) {
      const call = this.mapper.generatorCalls[i];

      this.generatorInstances[call.name]?._next();
      if (this.generatorInstances[call.name]?.().done) {
        continue;
      }
      return true;
    }
    this.done = true;
    return false;
  };

  initGenerator = (name: string, ...args: any) => {
    const realName = name.replace(/^\_[0-9]+\_/, "");

    this.generatorInstances[name] = functionGeneratorWithCache(
      this.generatorFunctions[realName],
      ...args
    );
  };

  injectModule = (name: string, module: any) => (this.modules[name] = module);

  addFunction = (
    key: string,
    func: (...args: any) => any | (() => Generator)
  ) => {
    if (func.constructor.name === "GeneratorFunction") {
      this.generatorFunctions[key] = (func as unknown) as () => Generator<any>;
      return;
    }
    this.functions[key] = func;
  };

  addGeneratorFunction = (key: string, generatorFunc: () => Generator<any>) =>
    (this.generatorFunctions[key] = generatorFunc);

  addConst = (key: string, value: ILiteralValue) =>
    (this.constants[key] = value);

  setFunctions = (func: IFunctions) => {
    this.functions = {};
    for (const key in func) {
      this.addFunction(key, func[key]);
    }
  };

  setGeneratorFunctions = (generatorFuncs: IGeneratorFunctions) => {
    this.generatorFunctions = {};
    for (const key in generatorFuncs) {
      this.addGeneratorFunction(key, generatorFuncs[key]);
    }
  };

  setConsts = (constants: IConstants) => (this.constants = constants);
}

export default LockPicker;
