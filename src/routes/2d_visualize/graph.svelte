<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { force_graph } from './simulation'; 
    import { type Node, type Link, is_node } from "../../physics/types"
    import type { Snippet } from 'svelte';
    import { is_layered_object, type LayeredObject } from 'sando-layer/Basic/LayeredObject';
    import { derived } from 'svelte/store';
    import { has_physics_data, physics_layer } from '../../physics/physics_layer';

    interface Props{
        connectables: Node[] | LayeredObject[],
        connectable_visualizer: Snippet<[node: Node | LayeredObject]>,
        links: Link[], 
        link_visualizer: Snippet<[link: Link]>
    }


    let parameters : Props = $props()

    function ensure_node(input: Node | LayeredObject): Node{
        if(is_layered_object(input) && has_physics_data(input)){
            return physics_layer.get_value(input as LayeredObject)
        }
        else if (is_node(input)){
            return input as Node
        }
        else{
            throw new Error("Invalid input")
        }
    }

    var nodes = parameters.connectables.map(ensure_node)

    $inspect(parameters.links)

    let simulation = $state(d3.forceSimulation(nodes)
                            .force("link", d3.forceLink(parameters.links))
                            .force("charge", d3.forceManyBody())
                            .force("center", d3.forceCenter()))
                            

    $effect(() => {
       
        nodes = parameters.connectables.map(ensure_node)
        simulation.nodes(nodes)
        simulation.force("link", d3.forceLink(parameters.links).id((n, i, d) => nodes[i].id))
    })





</script>


<div class="center-wrapper">
        <svg class="responsive-svg" width=1024 height=768>
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