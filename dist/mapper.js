"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("@babel/parser");
class Mapper {
    constructor() {
        this.identifiers = [];
        this.callExpressions = [];
        this.generatorCallExpressions = [];
        this.generatorCalls = [];
        this.generatorCounter = {};
        this.callExpressionDepth = 0;
        this.map = (node) => {
            if (Mapper.hasLetiralValue(node.type)) {
                return node;
            }
            // @ts-ignore
            if (typeof this[node.type] === "function") {
                // @ts-ignore
                return this[node.type](node);
            }
            // throw new TypeError(node.type + " not managed yet");
            return node;
        };
        this.setIdentifiers = (identifiers) => (this.identifiers = identifiers);
        this.setCallExpressions = (callExpressions) => (this.callExpressions = callExpressions);
        this.setGeneratorCallExpressions = (generatorCallExpressions) => {
            this.generatorCallExpressions = generatorCallExpressions;
            generatorCallExpressions.map((name) => (this.generatorCounter[name] = 0));
        };
        this.handleExpressionAsCallee = (node) => {
            this.callExpressionDepth++;
            node.callee = this.map(node.callee);
            this.callExpressionDepth++;
            node.arguments = [...node.arguments.map(this.map)];
            this.callExpressionDepth -= 2;
            return node;
        };
        this.Identifier = (node) => {
            if (this.identifiers.includes(node.name)) {
                return parser_1.parseExpression(`getVar('${node.name}')`);
            }
            return node;
        };
        this.CallExpression = (node) => {
            if (node.callee.type === "CallExpression") {
                return this.handleExpressionAsCallee(node);
            }
            else if (node.callee.type !== "Identifier") {
                return node;
            }
            let expression;
            const name = node.callee.name;
            if (this.generatorCallExpressions.includes(name)) {
                const count = this.generatorCounter[name];
                const instanceName = `_${count}_${name}`;
                expression = `callGeneratorFunc('${name}', '${instanceName}')`;
                this.generatorCalls.push({
                    sync: name.startsWith("$"),
                    funcName: name,
                    instanceName: instanceName,
                    depth: this.callExpressionDepth,
                });
                this.generatorCounter[name]++;
            }
            else if (this.callExpressions.includes(name)) {
                expression = `callFunc('${name}')`;
            }
            else {
                return node;
            }
            const newNode = parser_1.parseExpression(expression);
            this.callExpressionDepth++;
            newNode.arguments = [...newNode.arguments, ...node.arguments.map(this.map)];
            this.callExpressionDepth--;
            return newNode;
        };
        this.ObjectExpression = (node) => {
            node.properties = node.properties.map(this.map);
            return node;
        };
        this.ObjectProperty = (node) => {
            if (!Mapper.hasLetiralValue(node.value.type)) {
                node.value = this.map(node.value);
            }
            return node;
        };
        this.BinaryExpression = (node) => {
            if (!Mapper.hasLetiralValue(node.left.type)) {
                node.left = this.map(node.left);
            }
            if (!Mapper.hasLetiralValue(node.right.type)) {
                node.right = this.map(node.right);
            }
            return node;
        };
        this.ArrayExpression = (node) => {
            // @ts-ignore
            node.elements = node.elements.map(this.map);
            return node;
        };
        this.SpreadElement = (node) => {
            node.argument = this.map(node.argument);
            return node;
        };
    }
}
Mapper.literalHasValue = [
    "StringLiteral",
    "NumericLiteral",
    "BooleanLiteral",
    "BigIntLiteral",
    "DecimalLiteral",
];
Mapper.hasLetiralValue = (type) => Mapper.literalHasValue.includes(type);
exports.default = Mapper;
//# sourceMappingURL=mapper.js.map