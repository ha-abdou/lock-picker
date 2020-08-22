"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("@babel/parser");
const generator_1 = __importDefault(require("@babel/generator"));
const mapper_1 = __importDefault(require("./mapper"));
const generatoWithCache_1 = __importDefault(require("./generatoWithCache"));
exports.Helpers = __importStar(require("./helpers"));
class LockPicker {
    constructor(expression) {
        this.constants = {};
        this.functions = {};
        this.generatorFunctions = {};
        this.generatorInstances = {};
        this.modules = {};
        this.mapper = new mapper_1.default();
        this.compiledExpression = "";
        this.done = false;
        this.compile = () => {
            this.mapper.setIdentifiers(Object.keys(this.constants));
            this.mapper.setCallExpressions(Object.keys(this.functions));
            this.mapper.setGeneratorCallExpressions(Object.keys(this.generatorFunctions));
            this.mappedTree = this.mapper.map(this.expression);
            this.compiledExpression = generator_1.default(this.mappedTree).code;
            this.mapper.generatorCalls.sort((a, b) => a.depth - b.depth);
            this.mapper.generatorCalls.map((call) => (this.generatorInstances[call.instanceName] = null));
        };
        this.get = () => {
            if (this.done) {
                return;
            }
            const getVar = (name) => this.constants[name];
            const callFunc = (name, ...args) => this.functions[name](...args);
            const callGeneratorFunc = (funcName, instanceName, ...args) => {
                var _a, _b, _c, _d;
                if (this.generatorInstances[instanceName] === null || ((_b = (_a = this.generatorInstances)[instanceName]) === null || _b === void 0 ? void 0 : _b.call(_a).done)) {
                    this.initGenerator(funcName, instanceName, ...args);
                }
                return (_d = (_c = this.generatorInstances)[instanceName]) === null || _d === void 0 ? void 0 : _d.call(_c).value;
            };
            let modules = "";
            for (const name in this.modules) {
                modules += `const ${name} = this.modules['${name}'];`;
            }
            const res = eval(`${modules} (${this.compiledExpression})`);
            this.next();
            return res;
        };
        this.next = () => {
            const callsLength = this.mapper.generatorCalls.length;
            for (let i = 0; i < callsLength; i++) {
                const { sync, instanceName, funcName } = this.mapper.generatorCalls[i];
                if ((sync && this.syncGeneratorIterate(funcName)) ||
                    (!sync && this.generatorIterate(instanceName))) {
                    continue;
                }
                return true;
            }
            this.done = true;
            return false;
        };
        this.syncGeneratorIterate = (funcName) => {
            let done = false;
            this.mapper.generatorCalls.map((cc) => {
                if (cc.funcName === funcName && this.generatorIterate(cc.instanceName)) {
                    done = true;
                }
            });
            return done;
        };
        this.generatorIterate = (instanceName) => {
            var _a, _b, _c;
            (_a = this.generatorInstances[instanceName]) === null || _a === void 0 ? void 0 : _a._next();
            return (_c = (_b = this.generatorInstances)[instanceName]) === null || _c === void 0 ? void 0 : _c.call(_b).done;
        };
        this.initGenerator = (funcName, instanceName, ...args) => {
            this.generatorInstances[instanceName] = generatoWithCache_1.default(this.generatorFunctions[funcName], ...args);
        };
        this.injectModule = (name, module) => (this.modules[name] = module);
        this.addFunction = (key, func) => (this.functions[key] = func);
        this.addGeneratorFunction = (key, generatorFunc) => (this.generatorFunctions[key] = generatorFunc);
        this.addConst = (key, value) => (this.constants[key] = value);
        this.setFunctions = (func) => {
            this.functions = {};
            for (const key in func) {
                this.addFunction(key, func[key]);
            }
        };
        this.setGeneratorFunctions = (generatorFuncs) => {
            this.generatorFunctions = {};
            for (const key in generatorFuncs) {
                this.addGeneratorFunction(key, generatorFuncs[key]);
            }
        };
        this.setConsts = (constants) => (this.constants = constants);
        if (!expression || typeof expression !== "string" || expression === "") {
            throw new Error("Not valide string expression");
        }
        this.rawExpression = expression;
        this.expression = parser_1.parseExpression(expression);
    }
}
exports.default = LockPicker;
//# sourceMappingURL=index.js.map