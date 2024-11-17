
// PHYSICS LAYER CONTAIN PHYSICS DATA AS NODES
import { make_annotation_layer } from "sando-layer/Basic/Layer";
import { type Node } from "./types";
import { type Layer } from "sando-layer/Basic/Layer";
import { construct_layer_ui, is_layered_object, type LayeredObject } from "sando-layer/Basic/LayeredObject";
import { to_string } from "generic-handler/built_in_generics/generic_conversation";
import { match_args, register_predicate } from "generic-handler/Predicates";
import { define_generic_procedure_handler } from "generic-handler/GenericProcedure";
import { guard, throw_error } from "generic-handler/built_in_generics/other_generic_helper";
import { is_node } from "./types";
import { make_node } from "./types";

define_generic_procedure_handler(to_string, match_args(is_node), (node: Node) => {
    return `Node(${node.id}, ${node.x}, ${node.y})`
})


export const physics_layer = make_annotation_layer(
    "physics", 
    (get_name: () => string,
    has_value: (object: any) => boolean,
    get_value: (object: any) => any,
    is_equal: (a: LayeredObject, b: LayeredObject) => boolean): Layer => {

    return {
        identifier: "layer",
        get_name,
        has_value,
        get_value,
        get_default_value: () => {return {id: "unknown", x: 0, y: 0}},
        get_procedure: (name: string, arity: number) => {
            return () => {
                console.log("physics layer has no default procedure")
            }
        }, 
        summarize_self: () => {
            return ["physics"]
        },
        summarize_value: (object: LayeredObject) => {
            return [to_string(get_value(object))]
        },
        is_equal
    }
})

export const has_physics_data = register_predicate("has_physics_data", (object: any) => {
    return is_layered_object(object) && physics_layer.has_value(object)
})

export function guarantee_has_physics_data(a: LayeredObject){
    guard(has_physics_data(a), throw_error("guaranee_has_physics_data:", 
        "object do not have physics data", to_string(a)
    ))
}

export function construct_physical_node(base_value: any, ...values: any[]): Node {
    guard(values.length === 1, throw_error("construct_physical_node:", 
        "try to set type layer with more than one type",
         to_string(values)
    ))
    if (is_node(values[0])){
        return values[0]
    }
    else{
        return make_node(values[0])
    }
}

export const make_physical = construct_layer_ui(physics_layer,
    construct_physical_node,
    (new_value: any, old_values: any[]) => {
        throw Error("try to set type layer with more than one type")
    }
)