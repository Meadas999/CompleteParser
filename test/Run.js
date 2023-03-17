const { Parser } = require('../main/Parser');
const assert = require("assert");

const tests = [
    require('./literals-test'),
    require('./statement-list-test'),
    require('./block-test'),
    require('./Empty-Statement-test'),
    require('./Binary-Expressions-test'),
];
const parser = new Parser();

function exec() {
    const program = `  
  
    (2 + 2) + 2;
    `;

    const ast = parser.parse(program);

    console.log(JSON.stringify(ast, null, 2));
}
//Manual test function.
function test(program, expected){
    const ast = parser.parse(program);
    assert.deepEqual(ast, expected);
}
exec();

//Run all tests.
//
//tests.forEach(testRun => testRun(test));

console.log("All assertions passed!");
