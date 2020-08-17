"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("@babel/parser");
const generator_1 = require("@babel/generator");
const mapper_1 = require("./mapper");
const generatoWithCache_1 = require("./generatoWithCache");
class LockPicker {
    constructor(expression) {
        this.constants = {};
        this.functions = {};
        this.generatorFunctions = {};
        this.generatorInstances = {};
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
            this.mapper.generatorCalls = this.mapper.generatorCalls.map((call) => {
                this.generatorInstances[`_${call.id}_${call.name}`] = null;
                return Object.assign(Object.assign({}, call), { name: `_${call.id}_${call.name}` });
            });
        };
        this.get = () => {
            if (this.done) {
                return;
            }
            const getVar = (name) => this.constants[name];
            const callFunc = (name, ...args) => this.functions[name](...args);
            const callGeneratorFunc = (name, ...args) => {
                var _a, _b, _c, _d;
                if (this.generatorInstances[name] === null || ((_b = (_a = this.generatorInstances)[name]) === null || _b === void 0 ? void 0 : _b.call(_a).done)) {
                    this.initGenerator(name, ...args);
                }
                return (_d = (_c = this.generatorInstances)[name]) === null || _d === void 0 ? void 0 : _d.call(_c).value;
            };
            const res = eval("(" + this.compiledExpression + ")");
            this.next();
            return res;
        };
        this.next = () => {
            var _a, _b, _c;
            const callsLength = this.mapper.generatorCalls.length;
            for (let i = 0; i < callsLength; i++) {
                const call = this.mapper.generatorCalls[i];
                (_a = this.generatorInstances[call.name]) === null || _a === void 0 ? void 0 : _a._next();
                if ((_c = (_b = this.generatorInstances)[call.name]) === null || _c === void 0 ? void 0 : _c.call(_b).done) {
                    continue;
                }
                return true;
            }
            this.done = true;
            return false;
        };
        this.initGenerator = (name, ...args) => {
            const realName = name.replace(/^\_[0-9]+\_/, "");
            this.generatorInstances[name] = generatoWithCache_1.default(this.generatorFunctions[realName], ...args);
        };
        this.addFunction = (key, func) => {
            if (func.constructor.name === "GeneratorFunction") {
                this.generatorFunctions[key] = func;
                return;
            }
            this.functions[key] = func;
        };
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