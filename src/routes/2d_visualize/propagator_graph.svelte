<script lang="ts">
    import { observe_cell_array, observe_propagator_array } from "ppropogator/Shared/PublicState";
    import { cells_to_store, propagators_to_store } from "../../convertor/cell_to_store";
    import { network_to_displayable } from "../../convertor/network_to_visualizable";
    import { make_better_set, set_get_length, to_array } from "generic-handler/built_in_generics/generic_better_set";
    import { type LayeredObject } from "sando-layer/Basic/LayeredObject";
    import { pipe } from "fp-ts/lib/function";
    import { safe_get_node_pos } from "../../physics/types";
    import { translate, make_vector } from "../../helper/vector";
    import { get_x, get_y } from "../../helper/vector";
    import { type Link, type Node } from "../../physics/types";
    import Graph from "./graph.svelte";
    import { ensure_node } from "../../convertor/network_to_visualizable";
    import { to_string } from "generic-handler/built_in_generics/generic_conversation";
    import { operation } from "../../NetworkDefinition.ts/SimpleTest";
    const cells = cells_to_store(observe_cell_array)
    const propagators = propagators_to_store(observe_propagator_array) 

    let displayables = $derived(network_to_displayable(make_better_set($cells), make_better_set($propagators)))
    

    operation()

</script>

{#snippet cell_view(cell: LayeredObject | Node)}
    <!-- @ts-ignore -->
    {@const node =  ensure_node(cell)}
    {@const position = pipe(safe_get_node_pos(node), translate(make_vector(300, 300)))}
    <circle
        cx={get_x(position)}
        cy={get_y(position)}
        r="5"
        fill="#69b3a2"
        stroke="#fff"
        stroke-width="1.5"
    />
{/snippet}

{#snippet link_view(link: Link)}
    {@const source = pipe(safe_get_node_pos(link.source), translate(make_vector(300, 300)))}
    {@const target = pipe(safe_get_node_pos(link.target), translate(make_vector(300, 300)))}

    <line
        x1={get_x(source)}
        y1={get_y(source)}
        x2={get_x(target)}
        y2={get_y(target)}
        stroke="#69b3a2"
        stroke-width="3"
    />
{/snippet}

<Graph connectables={to_array(displayables.nodes)} connectable_visualizer={cell_view} links={to_array(displayables.links)} link_visualizer={link_view} />