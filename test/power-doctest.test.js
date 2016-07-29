const assert = require("assert");
import astEqual from "ast-equal"
import {convertAST, convertCode} from "../src/power-doctest"
import {parse} from "esprima"
function parseAndConvert(code) {
    var options = {
        range: true,
        comment: true,
        attachComment: true,
        tokens: true,
        sourceType: 'module'
    };
    var AST = parse(code, options);
    return convertAST(AST);
}

describe("power-doctest", function() {
    describe("#convertCode", function() {
        it("should convert code to code", function() {
            var code = `function addPrefix(text, prefix = "デフォルト:") {
                return prefix + text;
            }`;
            var result = convertCode(code);
            assert.equal(result, `
var assert = require('power-assert');
function addPrefix(text, prefix = 'デフォルト:') {
    return prefix + text;
} 
            `.trim());
        });
    });
    describe("#convertAST", function() {
        it("add assert module to header", function() {
            var code = "var a = 1;";
            var resultAST = parseAndConvert(code);
            astEqual(resultAST, `
            var assert = require("power-assert");
            var a = 1;
            `);
        });
        it("module type", function() {
            var code = `
            export default function hello() {
                var a = 1;
            }
                `;
            var resultAST = parseAndConvert(code);
            astEqual(resultAST, `
            var assert = require("power-assert");
            export default function hello() {
                var a = 1;
            }
                `);
        });
        it("convert assert to power-assert format", function() {
            var code = `
            var a = 1;
            a; // => 1`;
            var resultAST = parseAndConvert(code);
            astEqual(resultAST, `
                var assert = require("power-assert");
                var a = 1;
                assert.equal(assert._expr(assert._capt(a, 'arguments/0'), {
                   content: 'assert.equal(a, 1)',
                       line: 3
                 }), 1);
            `);
        });
    });
});

