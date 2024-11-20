<script lang="ts">
    import { observe_cell_array, observe_propagator_array } from "ppropogator/Shared/PublicState";
    import { cells_to_store, propagators_to_store } from "../../convertor/cell_to_store";
    import { network_to_displayable } from "../../convertor/network_to_visualizable";
    import { make_better_set, set_for_each, set_get_length, set_map, to_array } from "generic-handler/built_in_generics/generic_better_set";
    import { create_simulation_from_set } from "./simulation";
    import { operation } from "../../NetworkDefinition.ts/SimpleTest";
    import {  steppable_run_task, summarize_scheduler_state } from "ppropogator/Shared/Reactivity/Scheduler";
    import { type LayeredObject } from "sando-layer/Basic/LayeredObject";
    import { ensure_node } from "../../convertor/network_to_visualizable";
    import { pipe } from "fp-ts/lib/function";
    import { get_node_pos } from "../../physics/types";
    import { translate } from "../../physics/vector";
    import { make_vector } from "../../physics/vector";
    import { get_strongest_value, get_id } from "../../helper/primtive_generics";
    import { get_x, get_y } from "../../physics/vector";
    import { get_name } from "../../helper/primtive_generics";
    import { get_position  } from "../../physics/physics_layer";
    import { type Link } from "../../physics/types";
    import Graph from "./force_directed_graph/graph.svelte";
    // TODO: 1.extract simulation logic into function because that could be more flexible
    // 2. add single view for each cell (it should update as long as cell content is changing)
    // 3. add single view for each propagator (it should update as long as propagator content is changing)

    const cells = cells_to_store(observe_cell_array)
    const propagators = propagators_to_store(observe_propagator_array) 

    let displayables = $derived(network_to_displayable(make_better_set($cells), make_better_set($propagators)))
    let links = $derived(to_array(displayables.links))
    let node_layered = $derived(to_array(displayables.nodes_layered))

    
    let scheduler_state = $state("unruned")
    let updater = $state(false)
    let simulation = $derived(create_simulation_from_set(displayables.nodes_layered, displayables.links)
                            .on("tick", () => {
                                // console.log(updater)
                                updater = !updater
                           
                            }))

    


      async function run_task(){
        for (let i = 0; i < 30000; i++){    
            steppable_run_task((e: Error | null) => {
                if (e){
                    console.log(e)
                }
            })

    
            scheduler_state = summarize_scheduler_state()
            await new Promise(resolve => setTimeout(resolve, 2))
        }
    }

    let last_value_saver = $state(new Map<string, any>())
    function get_color(o: LayeredObject | Node): string{
        const value = get_strongest_value(o)
        const id = get_id(o) 
        const last_value = last_value_saver.get(id) 

        if (value === ""){
            return "#99001a"
        }
        else if (value === last_value){
            return "#c6bfde"
        }
        else{
            last_value_saver.set(id, value)
            return "#66ff66"
        }
    }


    operation()
</script>



{#snippet connectable_view(o: LayeredObject | Node)}

    {@const node =  ensure_node(o)}
    {@const position = pipe(get_node_pos(node), translate(make_vector(300, 300)))}
    {@const color = get_color(o)}
    <circle
        cx={get_x(position)}
        cy={get_y(position)}
        r="4"
        fill= {color}

    />

    <text style="font-family:'Times New Roman', Times, serif" x={get_x(position) } y={get_y(position) - 10 } text-anchor="middle" dy=".3em" fill= {color} font-size="8px">
      {get_name(o)}   {get_strongest_value(o)}
  </text> 


   
   
 {/snippet} 

{#snippet link_view(link: Link)}
    {@const source = pipe(get_position(link.source), translate(make_vector(300, 300)))}
    {@const target = pipe(get_node_pos(link.target), translate(make_vector(300, 300)))}

    <line
        x1={get_x(source)}
        y1={get_y(source)}
        x2={get_x(target)}
        y2={get_y(target)}
        stroke="#c6bfde"
        stroke-width="0.3"
    />
{/snippet}





<Graph connectables={node_layered} connectable_visualizer={connectable_view} links={to_array(displayables.links)} link_visualizer={link_view} update_signal={updater}  /> 

