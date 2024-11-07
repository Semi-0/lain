<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { force_graph } from './simulation'; 
    import type { Node, Link } from "./types"

    interface Props{
        nodes: Node[],
        links: Link[], 
        width: number,
        height: number,
        invalidation: Promise<any> | undefined
    }


    let {nodes , links, width, height, invalidation} : Props = $props()

    let translation = $state({x: 400, y: 500})
    let simulation = $state(d3.forceSimulation(nodes)
                            .force("link", d3.forceLink(links).id((n, i, d) => nodes[i].id))
                            .force("charge", d3.forceManyBody())
                            .force("center", d3.forceCenter()))
                            

    $effect(() => {
        simulation.nodes(nodes)
        simulation.force("link", d3.forceLink(links).id((n, i, d) => nodes[i].id))
    })

    function get_node_pos(node: Node) {
        const x = node.x 
        const y = node.y 
        if (x && y) {
            return { x: x + translation.x, y: y + translation.y };
        }
        else{
            return { x: 0 + translation.x, y: 0  + translation.y}
        }
    } 



</script>





<div class="center-wrapper">
        <svg width={width} height={height}>
            <!-- Draw links first so they appear behind nodes -->
            {#each links as link} 
                {@const source = get_node_pos(link.source)}
                {@const target = get_node_pos(link.target)}
                <line 
                    x1={source.x} 
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="#69b3a2"
                    stroke-width="3"
                />
            {/each}
            
            <!-- Draw nodes -->
            {#each nodes as node}
                {@const pos = get_node_pos(node)}
                <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="5"
                    fill="#69b3a2"
                    stroke="#fff"
                    stroke-width="1.5"
                />
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



    
    /* svg {
        display: block;
    } */
    
    circle {
        cursor: pointer;
    }
    
    circle:hover {
        fill: #3a8070;
    }
</style>