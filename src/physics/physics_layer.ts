
// PHYSICS LAYER CONTAIN PHYSICS DATA AS NODES
import { make_annotation_layer } from "sando-layer/Basic/Layer";
import { get_node_pos, type Node } from "./physical_node";
import { type Layer } from "sando-layer/Basic/Layer";
import { construct_layer_ui, is_layered_object, type LayeredObject } from "sando-layer/Basic/LayeredObject";
import { to_string } from "generic-handler/built_in_generics/generic_conversation";
import { match_args, register_predicate } from "generic-handler/Predicates";
import { construct_simple_generic_procedure, define_generic_procedure_handler } from "generic-handler/GenericProcedure";
import { guard, throw_error } from "generic-handler/built_in_generics/other_generic_helper";
import { is_node } from "./physical_node";
import { make_node } from "./physical_node";
import { compose } from "generic-handler/built_in_generics/generic_combinator";
import { is_string } from "generic-handler/built_in_generics/generic_predicates";
import { get_x, make_vector, type Vector } from "./vector";
import { construct_reactor, construct_readonly_reactor, construct_stateful_reactor, type Reactor, type ReadOnlyReactor, type StandardReactor, type StatefulReactor } from "ppropogator/Shared/Reactivity/Reactor";
import { map } from "ppropogator/Shared/Reactivity/Reactor";
// TODO: a reactive object to make svelte happy
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


const observable_store = new Map<string, StandardReactor<Node>>()


export function construct_reactive_node(id: string): Node{
    const inner: StatefulReactor<Node> = construct_stateful_reactor(make_node(id))
    observable_store.set(id, inner)
    
    return {
        id: id,
        get x(): number | undefined{
            return inner.get_value().x 
        },
        set x(value: number | undefined){
            inner.next({...inner.get_value(), x: value})
        },
        get y(): number | undefined{
            return inner.get_value().y
        },
        set y(value: number | undefined){
            inner.next({...inner.get_value(), y: value})
        },
        get vx(): number {
            return inner.get_value().vx
        },
        set vx(value: number){
            inner.next({...inner.get_value(), vx: value})
        },
        get vy(): number{
            return inner.get_value().vy
        },
        set vy(value: number){
            inner.next({...inner.get_value(), vy: value})
        }
    }
}



export const is_reactive_node = register_predicate("is_reactive_node", (n: Node) => {
    return observable_store.has(n.id)
})

export function fetch_observable_from_node(n: Node): ReadOnlyReactor<Node>{
    guard(is_reactive_node(n), throw_error("fetch_observable:", 
        "object is not a reactive node", to_string(n)
    ))

    //@ts-ignore
    return construct_readonly_reactor(observable_store.get(n.id))
}

export function construct_physical_node(base_value: any, ...values: any[]): Node {
    guard(values.length === 1, throw_error("construct_physical_node:", 
        "try to set type layer with more than one type",
         to_string(values)
    ))
    if (is_node(values[0])){
        return  construct_reactive_node(values[0].id)
    }
    else{
        return construct_reactive_node(values[0])
    }
}
// @ts-ignore
export const observe_physical_data: (o:LayeredObject) =>  Reactor<Node> = compose(physics_layer.get_value, fetch_observable_from_node)

// @ts-ignore
export const observe_position: (o: LayeredObject) => Reactor<Vector> = compose(observe_physical_data, map(get_node_pos))

//@ts-ignore
export const observe_x: (o:LayeredObject) => Reactor<number> = compose(observe_position, map(get_x))


export const make_physical = construct_layer_ui(physics_layer,
    construct_physical_node,
    (new_value: any, old_values: any[]) => {
        throw Error("try to set type layer with more than one type")
    }
)


export const get_position = construct_simple_generic_procedure("get_position", 1, 
    
    (o) => {
        throw new Error("get_position not implemented:" + o)
    })



define_generic_procedure_handler(get_position, match_args(is_node), get_node_pos)
// means it is node id
define_generic_procedure_handler(get_position, match_args(is_string), get_node_pos)

define_generic_procedure_handler(get_position, match_args(has_physics_data), compose(physics_layer.get_value, get_position))