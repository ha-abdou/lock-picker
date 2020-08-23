import { CallExpression, Node } from "@babel/types";
declare class Mapper {
    static literalHasValue: string[];
    identifiers: string[];
    callExpressions: string[];
    generatorCallExpressions: string[];
    generatorCalls: Array<{
        funcName: string;
        instanceName: string;
        sync: boolean;
        depth: number;
    }>;
    generatorCounter: {
        [name: string]: number;
    };
    private callExpressionDepth;
    map: (node: Node) => any;
    setIdentifiers: (identifiers: string[]) => string[];
    setCallExpressions: (callExpressions: string[]) => string[];
    setGeneratorCallExpressions: (generatorCallExpressions: string[]) => void;
    handleExpressionAsCallee: (node: CallExpression) => CallExpression;
    private Identifier;
    private CallExpression;
    private ObjectExpression;
    private ObjectProperty;
    private BinaryExpression;
    private ArrayExpression;
    private SpreadElement;
    static hasLetiralValue: (type: string) => boolean;
}
export default Mapper;
