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
  [key: string]: (...args: any) => Generator<any>;
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
    this.mapper.generatorCalls.map(
      (call) => (this.generatorInstances[call.instanceName] = null)
    );
  };

  get = (): any => {
    if (this.done) {
      return;
    }
    const getVar = (name: string) => this.constants[name];
    const callFunc = (name: string, ...args: any) =>
      this.functions[name](...args);
    const callGeneratorFunc = (
      funcName: string,
      instanceName: string,
      ...args: any
    ) => {
      if (
        this.generatorInstances[instanceName] === null ||
        this.generatorInstances[instanceName]?.().done
      ) {
        this.initGenerator(funcName, instanceName, ...args);
      }
      return this.generatorInstances[instanceName]?.().value;
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
      const { sync, instanceName, funcName } = this.mapper.generatorCalls[i];

      if (
        (sync && this.syncGeneratorIterate(funcName)) ||
        (!sync && this.generatorIterate(instanceName))
      ) {
        continue;
      }
      return true;
    }
    this.done = true;
    return false;
  };

  syncGeneratorIterate = (funcName: string) => {
    let done: boolean | undefined = false;

    this.mapper.generatorCalls.map((cc) => {
      if (cc.funcName === funcName && this.generatorIterate(cc.instanceName)) {
        done = true;
      }
    });
    return done;
  };

  generatorIterate = (instanceName: string) => {
    this.generatorInstances[instanceName]?._next();
    return this.generatorInstances[instanceName]?.().done;
  };

  initGenerator = (funcName: string, instanceName: string, ...args: any) => {
    this.generatorInstances[instanceName] = functionGeneratorWithCache(
      this.generatorFunctions[funcName],
      ...args
    );
  };

  injectModule = (name: string, module: any) => (this.modules[name] = module);

  addFunction = (key: string, func: (...args: any) => any) =>
    (this.functions[key] = func);

  addGeneratorFunction = (
    key: string,
    generatorFunc: (...args: any) => Generator<any>
  ) => (this.generatorFunctions[key] = generatorFunc);

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
