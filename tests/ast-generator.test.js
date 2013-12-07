var assertAST = require("./lib/chai.assert.ast").equalAstToFn;
var assert = require('chai').assert;
var escodegen = require("escodegen");
var sinon = require("sinon");
var path = require("path");
describe("power-doctest", function () {
    var docPower;
    beforeEach(function () {
        docPower = require("../lib/power-doctest");
    });
    afterEach(function () {
        delete(require.cache[path.resolve("../lib/power-doctest")]);
    });
    describe("mixin-assert", function () {
        it("should transform code to deepEqual", function () {
            var code = "var a = 1;" +
                "a; // => 1";
            var resultAST = docPower.convertFromCodeToTree(code, {
                astGenerator: require("../lib/ast-generator/mixin-assert-loc")
            });
            assertAST(resultAST, function () {
                var a = 1;
                try {
                    if (typeof a === 'object' && typeof 1 === 'object') {
                        assert.deepEqual(a, 1);
                    } else {
                        assert(a === 1);
                    }
                } catch (error) {
                    var newError = new Error(error.message);
                    newError.loc = {
                        start: {
                            column: 10,
                            line: 1
                        },
                        end: {
                            column: 12,
                            line: 1
                        }
                    };
                    throw newError;
                }
            });
        });
    });
});