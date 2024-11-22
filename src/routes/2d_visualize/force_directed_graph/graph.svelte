<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    import { type Node, type Link } from "../../../physics/physical_node"

    import {  type LayeredObject } from 'sando-layer/Basic/LayeredObject';

    import { ensure_node } from '../../../convertor/network_to_visualizable.svelte';

    import NodeVisualize from '../primitive_visualization/node_visualize.svelte';
    import LinkVisualize from '../primitive_visualization/link_visualize.svelte';

    interface Props{
        connectables: LayeredObject[],
        links: Link[], 
    }   

    let parameters : Props = $props()

    var nodes = parameters.connectables.map(ensure_node)
    let update = $state(false)

    let simulation = $state(d3.forceSimulation(nodes)
                            .force("link", d3.forceLink(parameters.links).id((n, i, d) => nodes[i].id))
                            .force("charge", d3.forceManyBody())
                            .force("center", d3.forceCenter())
                            .on("tick", () => {
                              update = !update 
                            })
                        )
                        
    $effect(() => {
        nodes = parameters.connectables.map(ensure_node)
        simulation.nodes(nodes)
        simulation.force("link", d3.forceLink(parameters.links).id((n, i, d) => nodes[i].id))
    })

</script>


{#key update}
    <svg class="responsive-svg" 
        width  = 10000
        height = 10000
        role="img"
        transform={`scale(2)`}>

        <!-- Draw links first so they appear behind nodes -->
        {#each parameters.links as link} 
            <LinkVisualize link={link} />
        {/each}
        
        <!-- Draw nodes -->
        {#each parameters.connectables as input}
            <NodeVisualize node={input} />
        {/each}
    </svg>
{/key}

<style>
    .responsive-svg {
        overflow: visible;
        width: 100%;
        height: 100%;
        max-width: 1000px; /* Optional: set a max width */
        max-height: 1000px; /* Optional: set a max height */
    }
</style>