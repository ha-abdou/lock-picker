import { Expression, Node } from "@babel/types";
import Mapper from "./mapper";
import { TGeneratorWithCache } from "./generatoWithCache";
export * as Helpers from "./helpers";
declare type ILiteralValue = string | number | boolean | IJson | IJsonArray;
interface IJson {
    [x: string]: string | number | boolean | IJson | IJsonArray;
}
interface IJsonArray extends Array<string | number | boolean | IJson | IJsonArray> {
}
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
declare class LockPicker {
    rawExpression: string;
    expression: Expression;
    constants: IConstants;
    functions: IFunctions;
    generatorFunctions: IGeneratorFunctions;
    generatorInstances: IGeneratorInstances;
    modules: {
        [name: string]: any;
    };
    mapper: Mapper;
    mappedTree: Node | undefined;
    compiledExpression: string;
    done: boolean;
    constructor(expression: string);
    compile: () => void;
    get: () => any;
    next: () => boolean;
    initGenerator: (name: string, ...args: any) => void;
    injectModule: (name: string, module: any) => any;
    addFunction: (key: string, func: (...args: any) => any | (() => Generator)) => void;
    addGeneratorFunction: (key: string, generatorFunc: () => Generator<any>) => () => Generator<any>;
    addConst: (key: string, value: ILiteralValue) => string | number | boolean | IJson | IJsonArray;
    setFunctions: (func: IFunctions) => void;
    setGeneratorFunctions: (generatorFuncs: IGeneratorFunctions) => void;
    setConsts: (constants: IConstants) => IConstants;
}
export default LockPicker;
