// Convert Cell and Propagator to Node and Links
import { cell_id, is_cell, type Cell } from "ppropogator/Cell/Cell"
import { is_propagator, type Propagator } from "ppropogator/Propagator/Propagator"
import { type Node, type Link, is_node } from "../physics/types"
import { make_better_set, set_flat_map, set_map, set_union, type BetterSet } from "generic-handler/built_in_generics/generic_better_set"
import { construct_better_set } from "generic-handler/built_in_generics/generic_better_set"
import { propagator_id } from "ppropogator/Propagator/Propagator"
import { pipe } from "fp-ts/lib/function"
import { define_generic_procedure_handler } from "generic-handler/GenericProcedure"
import { to_string } from "generic-handler/built_in_generics/generic_conversation"
import { match_args } from "generic-handler/Predicates"
import { has_physics_data, make_physical, physics_layer } from "../physics/physics_layer"
import { compose } from "generic-handler/built_in_generics/generic_combinator"
import type { LayeredObject } from "sando-layer/Basic/LayeredObject"


define_generic_procedure_handler(to_string, match_args(is_cell), (cell: Cell) => {
    return cell_id(cell)
})

define_generic_procedure_handler(to_string, match_args(is_propagator), (propagator: Propagator) => {
    return propagator_id(propagator)
})

define_generic_procedure_handler(to_string, match_args(has_physics_data), (object: any) => {
    return physics_layer.get_value(object).id
})

export interface Displayable{
    nodes: BetterSet<Node | LayeredObject>,
    links: BetterSet<Link>
}

export function ensure_node(n : LayeredObject | Node) : Node {
    // just to make compiler happy
    if (has_physics_data(n)) {
        // @ts-ignore
        return physics_layer.get_value(n)
    }
    else if (is_node(n)) {
        // @ts-ignore
        return n
    }
    else {
        throw new Error("Not a node")
    }
}

export function network_to_displayable(cells: BetterSet<Cell>, propagators: BetterSet<Propagator>){
    return {
        nodes: set_union(set_map(cells, cell_to_connectable), set_map(propagators, propagator_to_connectable)),
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

function cell_to_connectable(cell: Cell): LayeredObject{
    return make_physical(cell, cell_id(cell))
}


function propagator_to_node(propagator: Propagator): Node{
    return {
        id: propagator_id(propagator),
        x: 0,
        y: 0
    }
}

function propagator_to_connectable(propagator: Propagator): LayeredObject{
    return make_physical(propagator, propagator_id(propagator))
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