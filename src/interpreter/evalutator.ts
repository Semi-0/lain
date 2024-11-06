// import { construct_simple_generic_procedure } from "generic-handler/GenericProcedure";
// import { make_matcher } from "../helper/matcher";
// import { type LayeredObject } from "sando-layer/Basic/LayeredObject";
// import { define_generic_matcher } from "./matcher";
// import { P } from "pmatcher/MatchBuilder";
// import { isSucceed } from "pmatcher/Predicates";
// import { get_length, first, second, rest } from "pmatcher/GenericArray";


// type EvalHandler = (exec: (...args: any[]) => any, env: Environment, continuation: (result: LayeredObject, env: Environment) => LayeredObject) => any;

// export const evaluate = construct_simple_generic_procedure("evaluate", 3, (expr, env, continuation) => {
//     return default_eval(expr, env, continuation)
// })

// export function is_continuation(any: any): boolean{
//     return any instanceof Function
// }

// const match_application = make_matcher([P.begin, [P.wildcard, P.wildcard, "..."], 
//                                                  [[P.element, "operator"], [P.segment, "operands"]]])


// function default_eval(expression: LayeredObject, env: Environment, continuation: (result: LayeredObject, env: Environment) => LayeredObject): LayeredObject{
//     const application = match_application(expression)

//     if (isSucceed(application)){
//         return apply_matched((operator: LayeredObject, operands: LayeredObject[]) => {
//             return apply_interp(continuation(operator, env), operands, env, continuation)
//         }, application)
//     }
//     else{
//         throw Error("unknown expression type" + expression.toString() + "in environment" + env.toString())
//     }   
// }

// function make_application(operator: LayeredObject, operands: LayeredObject[]): LayeredObject{
//     return schemeList([operator, ...operands])
// }


// const self_evaluating_expr = [P.element, "expr", is_self_evaluating]

// define_generic_matcher(evaluate, self_evaluating_expr, 
//     ((exec, env, continuation): EvalHandler => {
//         return exec((expr: LayeredObject) => {
//             return expr;
//         });
//     }) as EvalHandler
// )


// const var_expr = [P.element, "expr", is_scheme_symbol]   

// define_generic_matcher(evaluate,
//     var_expr,
//     ((exec, env, continuation): EvalHandler => {
//         return exec((expr: LayeredObject) => {
//             const v = lookup(expr, env)
//             if (v !== undefined && v !== null){
//                 return v
//             }
//             else{
//                 throw Error("unknown variable" + v + "in environment" + env.toString())
//             }
//         });
//     }) as EvalHandler
// )

// const quoted_expr = ["quote", [P.element, "expr"]]

// define_generic_matcher(evaluate, quoted_expr, ((exec, env, continuation): EvalHandler => {
//     return exec((expr: LayeredObject) => {
//         return expr
//     });
// }) as EvalHandler)


// const if_expr = ["if", [P.element, "predicate"],  
//                          [P.element, "consequent"], 
//                          [P.element, "alternative"]]

// function make_if(predicate: LayeredObject, consequent: LayeredObject, alternative: LayeredObject): LayeredObject{
//     return schemeList([schemeSymbol("if"), predicate, consequent, alternative])
// }

// define_generic_matcher(evaluate, if_expr, ((exec, env, continuation): EvalHandler => {
//     return exec((predicate: LayeredObject, consequent: LayeredObject, alternative: LayeredObject) => {
//         if (is_true(continuation(predicate, env))){
//             return continuation(consequent, env)
//         }
//         else{
//             return continuation(alternative, env)
//         }
//     });
// }) as EvalHandler)


// const lambda_expr = ["lambda", [[P.segment_independently, "parameters"]], [P.segment, "body"]]

// define_generic_matcher(evaluate, lambda_expr, ((exec, env, continuation): EvalHandler => {
//     return exec((parameters: LayeredObject[], body: LayeredObject[]) => {
//         return   schemeClosure(parameters, seq_to_begin(body), env)
//     });
// }) as EvalHandler)

// function make_lambda(parameters: LayeredObject[], body: LayeredObject[]): LayeredObject{

//     return schemeList([schemeSymbol("lambda"), schemeList(parameters), seq_to_begin(body)])
// }

// function seq_to_begin(seq: LayeredObject[]): LayeredObject{
    
//     const already_begin = make_matcher(begin_expr)(seq)
//     if (isSucceed(already_begin)){
//         return already_begin
//     }
//     else if (get_length(seq) === 1){
//         return first(seq)
//     }
//     else{
//         console.log(seq)
//         return schemeList([schemeSymbol("begin"), ...seq])
//     }
// }


// const begin_expr = ["begin", [P.segment, "actions"]]

// define_generic_matcher(evaluate, begin_expr, ((exec, env, continuation): EvalHandler => {
//     return exec((actions: LayeredObject[]) => {
//         return continuation_sequence(actions, env, continuation)
//     });
// }) as EvalHandler)

// function continuation_sequence(actions: LayeredObject[], env: Environment, continuation: (result: LayeredObject, env: Environment) => LayeredObject): LayeredObject{
//     if (is_empty(actions)){
//         throw Error("empty sequence in evaluate_sequence")
//     }
//     else if (get_length(actions) === 1){
//         return continuation(first(actions), env)
//     }
//     else{
//         continuation(first(actions), env)
//         return continuation_sequence(rest(actions), env, continuation)
//     }
// }


// const cond_expr = ["cond", [[P.many, [[P.element, "predicates"], [P.element, "consequents"]]]]]

// define_generic_matcher(evaluate, cond_expr, 
//     ((exec, env, continuation): EvalHandler => {
//     return exec((predicates: LayeredObject[], consequents: LayeredObject[]) => {
//         console.log("cond", predicates, consequents)
//         return continuation(cond_to_if(predicates, consequents), env)
//     });
// }) as EvalHandler)

// function cond_to_if(predicates: LayeredObject[], consequents: LayeredObject[]): LayeredObject{
//     function expand(predicates: LayeredObject[], consequents: LayeredObject[]): LayeredObject{
//         if (is_empty(predicates)){
//             throw Error("empty predicates in cond_to_if")
//         }
//         else if (get_length(predicates) === 1){
//             if (first(predicates).value === schemeSymbol("else").value){
//                 return first(consequents)
//             }
//             else{
//                 throw Error("no else in cond_to_if, " + first(predicates).toString())
//             }
//         }
//         else{
//             return make_if(first(predicates), first(consequents), expand(rest(predicates), rest(consequents)))
//         }
//     }
//     return expand(predicates, consequents)
// }


// const let_expr = ["let", [[P.many, [[P.element, "names"], [P.element, "values"]]]], [P.segment, "body"]]

// define_generic_matcher(evaluate, let_expr, ((exec, env, continuation): EvalHandler => {
//     return exec((names: LayeredObject[], values: LayeredObject[], body: LayeredObject[]) => {
//         console.log("let", names, values, body)
//         return continuation(let_to_combination(names, values, body), env);
//     });
// }) as EvalHandler);

// function let_to_combination(names: LayeredObject[], values: LayeredObject[], body: LayeredObject[]): LayeredObject{
//     return make_application(make_lambda(names, body), values)
// }

// const assignment_expr = ["set!", [P.element, "name", is_scheme_symbol], [P.element, "value"]]

// define_generic_matcher(evaluate, assignment_expr, ((exec, env, continuation): EvalHandler => {
//     return exec((name: LayeredObject, value: LayeredObject) => {
//        return set(name, continuation(value, env), env)
//     });
// }) as EvalHandler);


// export const define_expr =  [P.new, ["parameters"], 
//                                 [P.choose,
//                                     ["define", [[P.element, "name", is_scheme_symbol], [P.segment, "parameters"]], [P.segment, "body"]],
//                                     ["define", [P.element, "name", is_scheme_symbol], [P.segment, "body"]],
//                                     ]]
// define_generic_matcher(evaluate, define_expr, ((exec, env, continuation): EvalHandler => {
//     return exec((name: LayeredObject, parameters: LayeredObject[] | string, body: LayeredObject[]) => {
//         console.log("define",'name', name, 'parameters', parameters, 'body', body)
//         if (parameters === will_define){
           
//             return define(name, continuation(seq_to_begin(body), env), env)
//         }
//         else{
//             // @ts-ignore
//             return define(name, continuation(make_lambda(parameters, body), env), env)
//         }
//     });
// }) as EvalHandler);

