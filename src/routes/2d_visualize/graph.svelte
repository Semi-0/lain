<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { force_graph } from './simulation'; 
    import { type Node, type Link, is_node } from "../../physics/types"
    import type { Snippet } from 'svelte';
    import { is_layered_object, type LayeredObject } from 'sando-layer/Basic/LayeredObject';
    import { derived } from 'svelte/store';
    import { has_physics_data, physics_layer } from '../../physics/physics_layer';
    import { ensure_node } from '../../convertor/network_to_visualizable';
    import { reactor_to_store } from '../../convertor/cell_to_store';
    import { construct_reactor, type StandardReactor } from 'ppropogator/Shared/Reactivity/Reactor';
    import { type Reactor } from 'ppropogator/Shared/Reactivity/Reactor';
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


      // Scale and translation variables
  let scale = $state(1);
  let translateX = $state(0);
  let translateY = $state(0);

  // Variables for panning
  let isPanning = $state(false);
  let startX: number = $state(0);
  let startY: number = $state(0);

  function handleMouseDown(event: MouseEvent) {
    isPanning = true;
    startX = event.clientX - translateX;
    startY = event.clientY - translateY;
  }

  function handleMouseMove(event: MouseEvent) {
    if (isPanning) {
      translateX = event.clientX - startX;
      translateY = event.clientY - startY;
    }
  }

  function handleMouseUp() {
    isPanning = false;
  }


</script>

<input type="range" min="0.5" max="4" step="0.1" bind:value={scale} />

{#key update}
<div class="center-wrapper" style="background-color: black;"  >
        <div 
            role="application"
            tabindex="0"
            onmousedown={handleMouseDown}
            onmousemove={handleMouseMove}
            onmouseup={handleMouseUp}
            onmouseleave={handleMouseUp}>
            <svg class="responsive-svg" 
                width = 10000
                height=10000
                role="img">
            <g transform="translate({translateX}, {translateY}) scale({scale})">
                <!-- Draw links first so they appear behind nodes -->
                {#each parameters.links as link} 
                    {@render parameters.link_visualizer(link)}
                {/each}
                
                <!-- Draw nodes -->
                {#each parameters.connectables as input}
                    {@render parameters.connectable_visualizer(input)}
                {/each}
            </g>
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