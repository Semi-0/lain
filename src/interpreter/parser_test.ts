import { parse, State } from "parse-combinator"
import { parseExpr } from "./parser"
import { to_string } from "generic-handler/built_in_generics/generic_conversation"
import { load_to_string_helper } from "../helper/to_string"

load_to_string_helper()

const test = parse(parseExpr, new State("(lambda (x) (+ 1 2))"))
//@ts-ignore
console.log(to_string(test.value))