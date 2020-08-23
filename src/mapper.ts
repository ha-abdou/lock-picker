import {
  Identifier,
  CallExpression,
  ObjectExpression,
  ObjectProperty,
  BinaryExpression,
  ArrayExpression,
  SpreadElement,
  Node,
} from '@babel/types';
import { parseExpression } from '@babel/parser';

class Mapper {
  static literalHasValue = ['StringLiteral', 'NumericLiteral', 'BooleanLiteral', 'BigIntLiteral', 'DecimalLiteral'];
  identifiers: string[] = [];
  callExpressions: string[] = [];
  generatorCallExpressions: string[] = [];
  generatorCalls: Array<{
    funcName: string;
    instanceName: string;
    sync: boolean;
    depth: number;
  }> = [];
  generatorCounter: { [name: string]: number } = {};
  private callExpressionDepth = 0;

  map = (node: Node): any => {
    if (Mapper.hasLetiralValue(node.type)) {
      return node;
    }
    // @ts-ignore
    if (typeof this[node.type] === 'function') {
      // @ts-ignore
      return this[node.type](node);
    }
    // throw new TypeError(node.type + " not managed yet");
    return node;
  };

  setIdentifiers = (identifiers: string[]) => (this.identifiers = identifiers);

  setCallExpressions = (callExpressions: string[]) => (this.callExpressions = callExpressions);

  setGeneratorCallExpressions = (generatorCallExpressions: string[]) => {
    this.generatorCallExpressions = generatorCallExpressions;
    generatorCallExpressions.map((name) => (this.generatorCounter[name] = 0));
  };

  handleExpressionAsCallee = (node: CallExpression) => {
    this.callExpressionDepth++;
    node.callee = this.map(node.callee);
    this.callExpressionDepth++;
    node.arguments = [...node.arguments.map(this.map)];
    this.callExpressionDepth -= 2;
    return node;
  };

  private Identifier = (node: Identifier): Node => {
    if (this.identifiers.includes(node.name)) {
      return parseExpression(`getVar('${node.name}')`);
    }
    return node;
  };

  private CallExpression = (node: CallExpression): Node => {
    if (node.callee.type === 'CallExpression') {
      return this.handleExpressionAsCallee(node);
    } else if (node.callee.type !== 'Identifier') {
      return node;
    }
    let expression;
    const name = node.callee.name;

    if (this.generatorCallExpressions.includes(name)) {
      const count = this.generatorCounter[name];
      const instanceName = `_${count}_${name}`;

      expression = `callGeneratorFunc('${name}', '${instanceName}')`;
      this.generatorCalls.push({
        sync: name.startsWith('$'),
        funcName: name,
        instanceName: instanceName,
        depth: this.callExpressionDepth,
      });
      this.generatorCounter[name]++;
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

  private ObjectExpression = (node: ObjectExpression): ObjectExpression => {
    node.properties = node.properties.map(this.map);
    return node;
  };

  private ObjectProperty = (node: ObjectProperty): ObjectProperty => {
    if (!Mapper.hasLetiralValue(node.value.type)) {
      node.value = this.map(node.value);
    }
    return node;
  };

  private BinaryExpression = (node: BinaryExpression) => {
    if (!Mapper.hasLetiralValue(node.left.type)) {
      node.left = this.map(node.left);
    }
    if (!Mapper.hasLetiralValue(node.right.type)) {
      node.right = this.map(node.right);
    }
    return node;
  };

  private ArrayExpression = (node: ArrayExpression) => {
    // @ts-ignore
    node.elements = node.elements.map(this.map);
    return node;
  };

  private SpreadElement = (node: SpreadElement) => {
    node.argument = this.map(node.argument);
    return node;
  };

  static hasLetiralValue = (type: string): boolean => Mapper.literalHasValue.includes(type);
}

export default Mapper;
