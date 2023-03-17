const {Lexer} = require("./Lexer");

class Parser {
    constructor() {
        this._string = '';
        this._lexer = new Lexer();
    }

    parse(string) {
        this._string = string;
        this._lexer.init(string);

        this._lookahead = this._lexer.getNextToken();

        return this.Program();
    }

    Program() {
        return {
            type: 'Program',
            body: this.statementList(),
        };
    }

    statementList(stopLookahead = null) {
        const statementlist = [this.statement()];
        while (this._lookahead != null && this._lookahead.type !== stopLookahead) {
            statementlist.push(this.statement());
        }
        return statementlist;
    }

    statement() {
        switch (this._lookahead.type) {
            case';':
                return this.emptyStatement();
            case'{':
                return this.blockStatement();
            default:
                return this.expressionStatement();
        }
    }
    emptyStatement(){
     this._eat(';');
     return {
         type: 'EmptyStatement',
     };
    }
    blockStatement() {
        this._eat('{');
        const body = this._lookahead.type !== '}' ? this.statementList('}') : [];
        this._eat('}');
        return {
            type:  'BlockStatement',
            body,
        };
    }

    expressionStatement() {
        const expression = this.expression();
        this._eat(';');
        return {
            type: 'ExpressionStatement',
            expression,
        };
    }

    expression() {
        return this.additiveExpression();
    }
    additiveExpression() {
        return this._binaryExpression( 'multiplicativeExpression', 'ADDITIVE_OPERATOR',);
    }
    multiplicativeExpression() {
       return this._binaryExpression( 'primaryExpression', 'MULTIPLICATIVE_OPERATOR',);
    }

    _binaryExpression(builderName, operatorToken){
        let left = this[builderName]();
        while (this._lookahead.type === operatorToken) {
            const operator = this._eat(operatorToken).value;
            const right = this[builderName]();
            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right,
            };
        }
        return left;
    }

    primaryExpression(){
        switch(this._lookahead.type) {
            case '(':
                return this.parenthesizedExpression();
            default:
            return this.literal();
        }
    }

    parenthesizedExpression(){
        this._eat('(');
        const expression = this.expression();
        this._eat(')');
        return expression;
    }
    literal() {
        switch (this._lookahead.type) {
            case 'NUMBER':
                return this.numericLiteral();
            case 'STRING':
                return this.stringLiteral();
        }
        throw new SyntaxError(`Literal: unexpected literal production`);
    }

    stringLiteral() {
        const token = this._eat('STRING');
        return {
            type: 'StringLiteral',
            value: token.value.slice(1, -1),
        };
    }

    numericLiteral() {
        const token = this._eat('NUMBER');
        return {
            type: 'NumericLiteral',
            value: Number(token.value),
        };

    }

    _eat(tokenType) {
        const token = this._lookahead;
        if (token == null) {
            throw new SyntaxError(`Unexpected end of input, expected: "${tokenType}"`,);
        }
        if (token.type !== tokenType) {
            throw new SyntaxError(`Unexpected token: "${token.value}", expected: "${tokenType}"`,);
        }
        this._lookahead = this._lexer.getNextToken();
        return token;
    }
}

module.exports = {
    Parser,
};
