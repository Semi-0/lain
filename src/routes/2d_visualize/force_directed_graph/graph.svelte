<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    import { type Node, type Link, is_node } from "../../../physics/physical_node"
    import type { Snippet } from 'svelte';
    import { is_layered_object, type LayeredObject } from 'sando-layer/Basic/LayeredObject';

    import { ensure_node } from '../../../convertor/network_to_visualizable';
    import type { StandardReactor } from 'ppropogator/Shared/Reactivity/Reactor';

    interface Props{
        connectables: Node[] | LayeredObject[],
        connectable_visualizer: Snippet<[node: Node | LayeredObject]>,
        links: Link[], 
        link_visualizer: Snippet<[link: Link]>
        update_signal: StandardReactor<boolean>
    }   



    let parameters : Props = $props()

    onMount(() => {
        parameters.update_signal.subscribe(() => {
            simulation.restart()
  
        })
    })

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

<input type="range" min="0.5" max="4" step="0.1"  />

{#key update}
<div class="center-wrapper"   >
        <div>
            <svg class="responsive-svg" 
                width = 10000
                height=10000
                role="img"
                transform={`scale(2)`}>

                <!-- Draw links first so they appear behind nodes -->
                {#each parameters.links as link} 
                    {@render parameters.link_visualizer(link)}
                {/each}
                
                <!-- Draw nodes -->
                {#each parameters.connectables as input}
                    {@render parameters.connectable_visualizer(input)}
                {/each}
   
            </svg>
        </div>
</div>
{/key}

<style>
    .center-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh; /* This ensures vertical centering on the screen */
    }

    .responsive-svg {
        width: 100%;
        height: 100%;
        max-width: 800px; /* Optional: set a max width */
        max-height: 600px; /* Optional: set a max height */
    }

</style>