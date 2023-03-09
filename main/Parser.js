const {Lexer} = require("./Lexer");

class Parser{
    constructor() {
        this._string = '';
        this._lexer = new Lexer();
    }
    parse(string){
        this._string = string;
        this._lexer.init(string);

        this._lookahead = this._lexer.getNextToken();

        return this.Program();
    }

    Program() {
        return {
            type: 'Program',
            body: this.numericLiteral()
        };
    }
    numericLiteral(){
        const token = this._eat('NUMBER');
        return {type: 'NumericLiteral', value: Number(token.value),};
    }

    _eat(){
        const token = this._lookahead;
    }
}

module.exports = {
    Parser,
};