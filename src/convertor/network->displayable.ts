// Convert Cell and Propagator to Node and Links
import { cell_id, is_cell, type Cell } from "ppropogator/Cell/Cell"
import { is_propagator, type Propagator } from "ppropogator/Propagator/Propagator"
import { type Node, type Link } from "../physics/types"
import { make_better_set, set_flat_map, set_map, set_union, type BetterSet } from "generic-handler/built_in_generics/generic_better_set"
import { construct_better_set } from "generic-handler/built_in_generics/generic_better_set"
import { propagator_id } from "ppropogator/Propagator/Propagator"
import { pipe } from "fp-ts/lib/function"
import { define_generic_procedure_handler } from "generic-handler/GenericProcedure"
import { to_string } from "generic-handler/built_in_generics/generic_conversation"
import { match_args } from "generic-handler/Predicates"


define_generic_procedure_handler(to_string, match_args(is_cell), (cell: Cell) => {
    return cell_id(cell)
})

define_generic_procedure_handler(to_string, match_args(is_propagator), (propagator: Propagator) => {
    return propagator_id(propagator)
})


export function network_to_displayable(cells: BetterSet<Cell>, propagators: BetterSet<Propagator>){
    return {
        nodes: set_union(set_map(cells, cell_to_node), set_map(propagators, propagator_to_node)),
        links: set_flat_map(propagators, propagator_to_links)
    }
}


function cell_to_node(cell: Cell): Node{
    return {
        id: cell_id(cell),
        x: 0,
        y: 0
    }
}

function propagator_to_node(propagator: Propagator): Node{
    return {
        id: propagator_id(propagator),
        x: 0,
        y: 0
    }
}

function propagator_to_links(propagator: Propagator): BetterSet<Link>{
    // TODO: handle bi-directional links
    var inputs = make_better_set(propagator.getInputsID())
    var outputs = make_better_set(propagator.getOutputsID())

    return pipe(set_union(inputs, outputs),
                (ids: BetterSet<string>) => set_map(ids, (id: string) => {
                    return {
                        source: {id: propagator_id(propagator)},
                        target: {id: id}
                    }
                }))
}