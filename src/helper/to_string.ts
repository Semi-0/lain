import { to_string } from "generic-handler/built_in_generics/generic_conversation";
import { define_generic_procedure_handler } from "generic-handler/GenericProcedure";
import { is_layered_object, type LayeredObject } from "sando-layer/Basic/LayeredObject";
import { get_type_annotate, get_value, is_lisp_list, is_typed_object } from "./type_layer";
import { match_args } from "generic-handler/Predicates";
import { reduce } from "generic-handler/built_in_generics/generic_array_operation"
import { match } from "fp-ts/lib/EitherT";

export function load_to_string_helper(){

}

define_generic_procedure_handler(to_string,
    match_args(is_typed_object),
    (a: LayeredObject) => {
        return a.describe_self()
    }
)

define_generic_procedure_handler(to_string, 
    match_args(is_lisp_list),
    (a: LayeredObject) => {
        return   "[" + reduce(get_value(a), (acc: string, v: LayeredObject) => acc + " " + to_string(v), "") + "]"
    }
)