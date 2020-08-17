import { Identifier, CallExpression, ObjectExpression, ObjectProperty, BinaryExpression, ArrayExpression, SpreadElement, Node } from "@babel/types";
declare class Mapper {
    static literalHasValue: string[];
    identifiers: string[];
    callExpressions: string[];
    generatorCallExpressions: string[];
    generatorCalls: Array<{
        name: string;
        id: number;
        depth: number;
    }>;
    private generatorCounter;
    private callExpressionDepth;
    map: (node: Node) => any;
    setIdentifiers: (identifiers: string[]) => string[];
    setCallExpressions: (callExpressions: string[]) => string[];
    setGeneratorCallExpressions: (generatorCallExpressions: string[]) => void;
    Identifier: (node: Identifier) => Node;
    CallExpression: (node: CallExpression) => Node;
    ObjectExpression: (node: ObjectExpression) => ObjectExpression;
    ObjectProperty: (node: ObjectProperty) => ObjectProperty;
    BinaryExpression: (node: BinaryExpression) => BinaryExpression;
    ArrayExpression: (node: ArrayExpression) => ArrayExpression;
    SpreadElement: (node: SpreadElement) => SpreadElement;
    static hasLetiralValue: (type: string) => boolean;
}
export default Mapper;
