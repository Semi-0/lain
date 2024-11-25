import type { BetterSet } from "generic-handler/built_in_generics/generic_better_set";
import { base_layer, make_annotation_layer, type Layer } from "sando-layer/Basic/Layer";
import { construct_layer_ui, type LayeredObject } from "sando-layer/Basic/LayeredObject";

import { construct_better_set, merge_set } from "generic-handler/built_in_generics/generic_better_set";
import { to_string } from "generic-handler/built_in_generics/generic_conversation";
import { default_merge_procedure } from "sando-layer/Basic/LayerGenerics";
import { deep_equal } from "sando-layer/Equality";
import { first } from "generic-handler/built_in_generics/generic_array_operation";
import { is_layered_object } from "ppropogator/Helper/Predicate";
import { register_predicate } from "generic-handler/Predicates";
import { guard, throw_error } from "generic-handler/built_in_generics/other_generic_helper";


export enum LispType{
    string = "String",
    number = "Number",
    boolean = "Boolean",
    symbol = "Symbol",
    quoted = "Quoted",
    list = "List",
    expression = "Expression",
    lambda = "Lambda",
    let = "Let",
    call = "Call",
    closure = "Closure",
    primitiveFunc = "PrimitiveFunc",
    unknown = "Unknown",
}


export const type_layer = make_annotation_layer(
    "type", 
    (get_name: () => string, 
    has_value: (object: any) => boolean,
    get_value: (object: any) => any,
    is_equal: (a: LayeredObject, b: LayeredObject) => boolean): Layer => {

    function get_default_value(): any{
         return LispType.unknown
    } 

    function get_procedure(name: string, arity: number): any | undefined{
        return  () => {
            console.log("type layer has no default procedure")
        }
    }

    function summarize_self(): string[]{
        return ["type"]
    }

    function summarize_value(object: LayeredObject): string[]{
    //@ts-ignore
        return   [to_string(get_value(object))]
    }




return {
    identifier: "layer",
    get_name,
    has_value,
    get_value,
    get_default_value,
    get_procedure,
    summarize_self,
    summarize_value,
    is_equal, 
}
})




export function construct_type_annotation(base_value: any, ...values: LispType[]): BetterSet<string>{
    if (values.length == 1){
        const t = first(values)
        return t
    }
    else {
        throw Error("try to set type layer with more than one type")
    }
  
}

export const as_type = construct_layer_ui(type_layer,
    construct_type_annotation,
    (new_value: any, old_values: any[]) => {
        throw Error("try to set type layer with more than one type")
    }
)

export function _is_type(t: LispType){
    return (a: any) => {
        return is_typed_object(a) && type_layer.get_value(a) === t
    }
}

export function has_type_layer(a: LayeredObject): boolean{
    return is_layered_object(a) && type_layer.has_value(a)
}

export const is_typed_object  = register_predicate("is_lisp_type", has_type_layer)

export const is_lisp_list = register_predicate("is_lisp_list", _is_type(LispType.list))



export function guarantee_type_object(a: LayeredObject){
    guard(is_typed_object(a), throw_error("get_type_annotate", 
        "try to get type from a object is not typed object",
        a.describe_self()))
}

export function get_type_annotate(a: LayeredObject): LispType{
    guarantee_type_object(a) 
    return type_layer.get_value(a)
}

export function get_value(a: LayeredObject): LispType{
    guarantee_type_object(a)
    return base_layer().get_value(a)
}