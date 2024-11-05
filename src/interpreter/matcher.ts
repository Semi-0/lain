import { isSucceed } from "pmatcher/Predicates"
import { match } from "pmatcher/MatchBuilder"
import { construct_advice, install_advice } from "generic-handler/built_in_generics/generic_advice"
import type { MatchResult } from "pmatcher/MatchResult/MatchResult"
import { register_predicate } from "generic-handler/Predicates"
import { to_string } from "generic-handler/built_in_generics/generic_conversation"
import { define_generic_procedure_handler } from "generic-handler/GenericProcedure"

function no_change(a: any) {
    return a
}


export function matcher_advice() : any[]{
    var matchResult: MatchResult | null = null 

    const input_modifers =  [no_change,
                             (expr: any[]) => { 
                                return (input: any[], ...args: any[]) => {
                                    const matcher = register_predicate(to_string(expr), (input: any[]) => {
                                        matchResult = match(input, expr)
                                        return isSucceed(matchResult)
                                    })
                                    
                                    return matcher(input)
                                }
                              },
                              (handler: (exec: (...args: any[]) => any, ...args: any[]) => any) => { 
                                return (result: any, ...args: any[]) => {
                                    //@ts-ignore
                                    return handler(make_exec(matchResult), ...args)
                                }}]
    return construct_advice(input_modifers, no_change)
}

export const generic_matcher = install_advice(define_generic_procedure_handler, matcher_advice)