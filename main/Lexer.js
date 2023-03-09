class Lexer {

    init(string){
        this._string = string;
        this._cursor = 0;
    }
    hasMoreTokens(){
        return this._cursor < this._string.length;
    }
    getNextToken(){
        if(!this.hasMoreTokens()){
            return null;
        }
        const string = this._string.slice(this._cursor);

        //Numbers:
        if(!Number.isNaN(Number(string[0]))){
            let number = '';
            while(!number.isNaN(Number(string[this._cursor]))){
                number += string[this._cursor++];
            }
            return {
                type: 'Number',
                value: number,
            };
        }
    }

}

module.exports = {
    Lexer,
};