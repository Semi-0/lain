import { Cell } from "ppropogator/Cell/Cell"
import { v4 as uuidv4 } from "uuid"
import { Propagator } from "ppropogator/Propagator"
import { construct_simple_generic_procedure, define_generic_procedure_handler } from "generic-handler/GenericProcedure";
import { match_args, register_predicate } from "generic-handler/Predicates";
export interface NodeViewModel {
    id: string;
    label: string;
    position: {
        x: number;
        y: number;
    };
    connections: string[];
} 


export function construct_node_view_model(id: string, label: string,  connections: string[]): NodeViewModel {
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
        return construct_node_view_model(cell.getRelation().get_id(), 
                                         cell.getRelation().get_name(), 
                                         [])
    }
)

const is_propagator = register_predicate("is_propagator", (x: any) => x instanceof Propagator)

define_generic_procedure_handler(to_node_view_model, 
    match_args(is_propagator),
    (propagator: Propagator) => {
        return construct_node_view_model(propagator.getRelation().get_id(), 
                                         propagator.getRelation().get_name(), 
                                         [...propagator.getInputsID(), ...propagator.getOutputsID()])
    }
)





