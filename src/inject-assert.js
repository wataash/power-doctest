// LICENSE : MIT
"use strict";
import { parse } from "esprima"
export function injectAssertModule(AST) {
    const powerAssertDeclaration = parse(`var assert = require("power-assert")`);
    AST.body.unshift(powerAssertDeclaration.body[0]);
    return AST;
}