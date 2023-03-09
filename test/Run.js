const { Parser } = require('../main/Parser');

const parser = new Parser();
const program = '3000';

const ast = parser.parse(program);

console.log(JSON.stringify(ast, null, 2));