// LICENSE : MIT
"use strict";
import traverse from "estraverse"
import {Syntax} from "estraverse"
import {parse} from "esprima"
export function injectAssertModule(AST) {
    var powerAssertDeclaration = parse(`var assert = require("power-assert")`);
    AST.body.unshift(powerAssertDeclaration.body[0]);
    return AST;
}