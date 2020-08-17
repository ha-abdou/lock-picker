import {
  Identifier,
  CallExpression,
  ObjectExpression,
  ObjectProperty,
  BinaryExpression,
  ArrayExpression,
  SpreadElement,
  Node,
} from "@babel/types";
import { parseExpression } from "@babel/parser";

class Mapper {
  static literalHasValue = [
    "StringLiteral",
    "NumericLiteral",
    "BooleanLiteral",
    "BigIntLiteral",
    "DecimalLiteral",
  ];
  identifiers: string[] = [];
  callExpressions: string[] = [];
  generatorCallExpressions: string[] = [];
  generatorCalls: Array<{
    name: string;
    id: number;
    depth: number;
  }> = [];
  private generatorCounter: { [name: string]: number } = {};
  private callExpressionDepth = 0;

  map = (node: Node): any => {
    if (Mapper.hasLetiralValue(node.type)) {
      return node;
    }
    // @ts-ignore
    if (typeof this[node.type] === "function") {
      // @ts-ignore
      return this[node.type](node);
    }
    throw new TypeError(node.type + " not managed yet");
    return node;
  };

  setIdentifiers = (identifiers: string[]) => (this.identifiers = identifiers);

  setCallExpressions = (callExpressions: string[]) =>
    (this.callExpressions = callExpressions);

  setGeneratorCallExpressions = (generatorCallExpressions: string[]) => {
    this.generatorCallExpressions = generatorCallExpressions;
    generatorCallExpressions.map((name) => (this.generatorCounter[name] = 0));
  };

  Identifier = (node: Identifier): Node => {
    if (this.identifiers.includes(node.name)) {
      return parseExpression(`getVar('${node.name}')`);
    }
    return node;
  };

  CallExpression = (node: CallExpression): Node => {
    if (node.callee.type === "CallExpression") {
      this.callExpressionDepth++;
      node.callee = this.map(node.callee);
      this.callExpressionDepth++;
      node.arguments = [...node.arguments.map(this.map)];
      this.callExpressionDepth -= 2;
      return node;
    } else if (node.callee.type !== "Identifier") {
      return node;
    }
    let expression;
    const name = node.callee.name;
    const count = this.generatorCounter[name];
    // if is generator function
    if (this.generatorCallExpressions.includes(name)) {
      // if is sync generator function that wos added to generatorCalls list
      if (name.startsWith("$") && count !== 0) {
        expression = `callGeneratorFunc('_0_${name}')`;
      } else {
        expression = `callGeneratorFunc('_${count}_${name}')`;
        this.generatorCalls.push({
          name,
          depth: this.callExpressionDepth,
          id: count,
        });
        this.generatorCounter[name]++;
      }
    } else if (this.callExpressions.includes(name)) {
      expression = `callFunc('${name}')`;
    } else {
      return node;
    }
    const newNode = parseExpression(expression) as CallExpression;
    this.callExpressionDepth++;
    newNode.arguments = [...newNode.arguments, ...node.arguments.map(this.map)];
    this.callExpressionDepth--;
    return newNode;
  };

  ObjectExpression = (node: ObjectExpression): ObjectExpression => {
    node.properties = node.properties.map(this.map);
    return node;
  };

  ObjectProperty = (node: ObjectProperty): ObjectProperty => {
    if (!Mapper.hasLetiralValue(node.value.type)) {
      node.value = this.map(node.value);
    }
    return node;
  };

  BinaryExpression = (node: BinaryExpression) => {
    if (!Mapper.hasLetiralValue(node.left.type)) {
      node.left = this.map(node.left);
    }
    if (!Mapper.hasLetiralValue(node.right.type)) {
      node.right = this.map(node.right);
    }
    return node;
  };

  ArrayExpression = (node: ArrayExpression) => {
    // @ts-ignore
    node.elements = node.elements.map(this.map);
    return node;
  };

  SpreadElement = (node: SpreadElement) => {
    node.argument = this.map(node.argument);
    return node;
  };

  static hasLetiralValue = (type: string): boolean =>
    Mapper.literalHasValue.includes(type);
}

export default Mapper;
