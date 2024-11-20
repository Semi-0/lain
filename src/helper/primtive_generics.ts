import { compose } from "generic-handler/built_in_generics/generic_combinator";
import { throw_error } from "generic-handler/built_in_generics/other_generic_helper";
import { construct_simple_generic_procedure, define_generic_procedure_handler } from "generic-handler/GenericProcedure";
import { match_args, register_predicate } from "generic-handler/Predicates";

import { cell_id, cell_name, cell_strongest, cell_strongest_value, is_cell } from "ppropogator/Cell/Cell";

import { is_propagator, propagator_id, propagator_name, type Propagator } from "ppropogator/Propagator/Propagator";
import { get_base_value } from "sando-layer/Basic/Layer";
import { reactor_to_store } from "../convertor/cell_to_store";






export const get_name = construct_simple_generic_procedure("get_name", 1,
     (a: {name: string}) => { throw new Error("get_name not implemented:" + a)})


const is_layered_cell = register_predicate("is_layered_cell", compose(get_base_value, is_cell))
const is_layered_propagator = register_predicate("is_layered_propagator",  compose(get_base_value, is_propagator))

define_generic_procedure_handler(get_name,
    match_args(is_layered_cell),
    compose(get_base_value, cell_name)
)

define_generic_procedure_handler(get_name,
    match_args(is_layered_propagator),
    compose(get_base_value, propagator_name))


export const get_id = construct_simple_generic_procedure("get_id", 1, 
    (a: {id: number}) => { throw new Error("get_id not implemented:" + a)})


define_generic_procedure_handler(get_id,
    match_args(is_layered_cell),
    compose(get_base_value, cell_id)
)

define_generic_procedure_handler(get_id,
    match_args(is_layered_propagator),
    compose(get_base_value, propagator_id))


export const get_strongest_value = construct_simple_generic_procedure("get_strongest_value", 1,
    (a: any) => { throw new Error("get_strongest_value not implemented:" + a)})

define_generic_procedure_handler(get_strongest_value,
    match_args(is_layered_cell),
    compose(get_base_value, cell_strongest_value, get_base_value)
)

define_generic_procedure_handler(get_strongest_value,
    match_args(is_layered_propagator),
    (a: any) => " "
)

export const get_value_publisher = construct_simple_generic_procedure("get_value_publisher", 1, throw_error("get_value publisher", "unimplemented", "nil"))
// for cell get its reactive state for strongest value
// for propagator get its reactive state for activator


define_generic_procedure_handler(get_value_publisher, 
    match_args(is_layered_cell),
    compose(get_base_value, cell_strongest)
)


const propagator_activator = (p : Propagator) => p.getActivator()

define_generic_procedure_handler(get_value_publisher,
    match_args(is_layered_propagator),
    compose(get_base_value, propagator_activator))


// publisher conforms to svelte store
export const get_value_store = compose(get_value_publisher, reactor_to_store)