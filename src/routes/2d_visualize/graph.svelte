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


    let {nodes, links, width, height, invalidation} = $props()
    let element: HTMLDivElement;



    let simulation = d3
    // const chart = $derived(visualize(nodes, links))

    // //@ts-ignore
    // const visualize = force_graph(invalidation, width, height)

    let load = $state(false)



    // onMount(async function() {
    //     const visualize = force_graph(invalidation, width, height)
    //     //@ts-ignore
    //     console.log(nodes)
    //     const chart = visualize(nodes, links)
    //     d3.select(element).append(() => chart);
    
    // })

</script>



<div bind:this={element}>    
</div>

<style>
</style>

