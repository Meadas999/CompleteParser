const {Lexer} = require("./Lexer");
//Default AST node factories
const DefaultFactory = {
    Program(body) {
        return {
            type: 'Program',
            body,
        };
    },

    emptyStatement() {
        return {
            type: 'EmptyStatement'
        };
    },

    blockStatement(body) {
        return {
            type: 'BlockStatement',
            body,
        };
    },

    expressionStatement(expression) {
        return {
            type: 'ExpressionStatement',
            expression,
        };
    },
    stringLiteral(value) {
        return {
            type: 'StringLiteral',
            value,
        };
    },

    numericLiteral(value) {
        return {
            type: 'NumericLiteral',
            value,
        };
    },
};

//S-expression AST node factories
const SExpressionFactory = {
    Program(body) {
        return ['begin', body];
    },

    emptyStatement() {
    },

    blockStatement(body) {
        return ['begin', body];
    },

    expressionStatement(expression) {
        return expression;
    },

    stringLiteral(value) {
        return `"value"`;
    },

    numericLiteral(value) {
        return value;
    },

};

const AST_MODE = 'default';
const factory = AST_MODE === 'default' ? DefaultFactory : SExpressionFactory;

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
        return factory.Program(this.statementList());
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

    emptyStatement() {
        this._eat(';');
        return factory.emptyStatement();
    }

    blockStatement() {
        this._eat('{');
        const body = this._lookahead.type !== '}' ? this.statementList('}') : [];
        this._eat('}');
        return factory.blockStatement(body);
    }

    expressionStatement() {
        const expression = this.expression();
        this._eat(';');
        return factory.expressionStatement(expression);
    }

    expression() {
        return this.literal();
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
        return factory.stringLiteral(token.value.slice(1, -1));
    }


    numericLiteral() {
        const token = this._eat('NUMBER');
        return factory.numericLiteral(token.value);
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
