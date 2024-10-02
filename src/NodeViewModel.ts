import { Cell } from "ppropogator/Cell/Cell"
import { v4 as uuidv4 } from "uuid"
import { Propagator } from "ppropogator/Propagator"
import { construct_simple_generic_procedure, define_generic_procedure_handler } from "generic-handler/GenericProcedure";
import { match_args, register_predicate } from "generic-handler/Predicates";
import { type Store } from "./ReactorWrapper";
import { pipe } from "fp-ts/function";
import { map } from "ppropogator/Reactor";
import { get_base_value } from "ppropogator/Cell/CellValue";
import { to_string } from "generic-handler/built_in_generics/generic_conversation";
import { to_store } from "./ReactorWrapper";
import { readable, readonly } from "svelte/store";
export interface NodeViewModel {
    id: string;
    label: Store<string>;
    position: {
        x: number;
        y: number;
    };
    connections: string[];
} 


export function construct_node_view_model(id: string, label: Store<string>,  connections: string[]): NodeViewModel {
    return {
        id: id,
        label: label,
        position: {x: 0, y: 0},
        connections: connections
    }
}

export const to_node_view_model = construct_simple_generic_procedure(
    "to_node_view_model",
    1,
    (id: string, label: string,  connections: string[]) => {
        throw new Error("not implemented")
    }
)

const is_cell = register_predicate("is_cell", (x: any) => x instanceof Cell)

define_generic_procedure_handler(to_node_view_model, 
    match_args(is_cell),
    (cell: Cell) => {
        const label = pipe(cell.getStrongest(),
                           map(v => get_base_value(v)),
                           map(v => cell.getRelation().get_name + to_string(v)),
                           to_store)

        return construct_node_view_model(cell.getRelation().get_id(), 
                                         label, 
                                         [])
    }
)

const is_propagator = register_predicate("is_propagator", (x: any) => x instanceof Propagator)

define_generic_procedure_handler(to_node_view_model, 
    match_args(is_propagator),
    (propagator: Propagator) => {
        return construct_node_view_model(propagator.getRelation().get_id(), 
                                         readable(propagator.getRelation().get_name()), 
                                         [...propagator.getInputsID(), ...propagator.getOutputsID()])
    }
)





