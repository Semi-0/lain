import { type Cell } from "ppropogator/Cell/Cell"
import { v4 as uuidv4 } from "uuid"
import { type Propagator } from "ppropogator/Propagator/Propagator"
import { construct_simple_generic_procedure, define_generic_procedure_handler } from "generic-handler/GenericProcedure";
import { match_args, register_predicate } from "generic-handler/Predicates";
import {  type Store } from "../convertor/cell_to_store";
import { pipe } from "fp-ts/function";
import { map } from "ppropogator/Shared/Reactivity/Reactor";
import { get_base_value } from "ppropogator/Cell/CellValue";
import { to_string } from "generic-handler/built_in_generics/generic_conversation";
import { reactor_to_store } from "../convertor/cell_to_store";
import { readable, readonly } from "svelte/store";
import { is_cell } from "ppropogator/Cell/Cell"; 
import { is_propagator } from "ppropogator/Propagator/Propagator";
// TODO: use particle spring to auto calculate position
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


define_generic_procedure_handler(to_node_view_model, 
    match_args(is_cell),
    (cell: Cell) => {
        const label = pipe(cell.getStrongest(),
                           map(v => get_base_value(v)),
                           map(v => cell.getRelation().get_name + " " + to_string(v)),
                           reactor_to_store)

        return construct_node_view_model(cell.getRelation().get_id(), 
                                         label, 
                                         [])
    }
)


define_generic_procedure_handler(to_node_view_model, 
    match_args(is_propagator),
    (propagator: Propagator) => {
        return construct_node_view_model(propagator.getRelation().get_id(), 
                                         readable(propagator.getRelation().get_name()), 
                                         [...propagator.getInputsID(), ...propagator.getOutputsID()])
    }
)





// function tooltip(node, options) {
// 	const tooltip = tippy(node, options);

// 	return {
// 		update(options) {
// 			tooltip.setProps(options);
// 		},
// 		destroy() {
// 			tooltip.destroy();
// 		}
// 	};
// }