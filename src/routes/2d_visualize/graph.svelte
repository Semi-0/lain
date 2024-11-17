<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { force_graph } from './simulation'; 
    import type { Node, Link } from "../../physics/types"
    import type { Snippet } from 'svelte';

    interface Props{
        nodes: Node[],
        node_visualizer: Snippet<[node: Node]>,
        links: Link[], 
        link_visualizer: Snippet<[link: Link]>
    }


    let { nodes,  node_visualizer, links, link_visualizer } : Props = $props()

    let simulation = $state(d3.forceSimulation(nodes)
                            .force("link", d3.forceLink(links).id((n, i, d) => nodes[i].id))
                            .force("charge", d3.forceManyBody())
                            .force("center", d3.forceCenter()))
                            

    $effect(() => {
        simulation.nodes(nodes)
        simulation.force("link", d3.forceLink(links).id((n, i, d) => nodes[i].id))
    })





</script>


<div class="center-wrapper">
        <svg class="responsive-svg" width=1024 height=768>
            <!-- Draw links first so they appear behind nodes -->
            {#each links as link} 
                {@render link_visualizer(link)}

            {/each}
            
            <!-- Draw nodes -->
            {#each nodes as node}
                {@render node_visualizer(node)}
            {/each}
        </svg>
</div>

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