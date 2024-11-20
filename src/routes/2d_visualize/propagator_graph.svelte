<script lang="ts">
    import { observe_cell_array, observe_propagator_array } from "ppropogator/Shared/PublicState";
    import { cells_to_store, propagators_to_store } from "../../convertor/cell_to_store";
    import { network_to_displayable } from "../../convertor/network_to_visualizable";
    import { make_better_set, set_for_each, set_get_length, set_map, to_array } from "generic-handler/built_in_generics/generic_better_set";
    import { is_layered_object, type LayeredObject } from "sando-layer/Basic/LayeredObject";
    import { pipe } from "fp-ts/lib/function";
    import { is_node, safe_get_node_pos } from "../../physics/types";
    import { translate, make_vector } from "../../helper/vector";
    import { get_x, get_y } from "../../helper/vector";
    import { type Link, type Node } from "../../physics/types";
    import Graph from "./graph.svelte";
    import { ensure_node } from "../../convertor/network_to_visualizable";

    import { operation } from "../../NetworkDefinition.ts/SimpleTest";

    import { get_base_value } from "sando-layer/Basic/Layer";
    import { cell_id, cell_name, cell_strongest_base_value, is_cell } from "ppropogator/Cell/Cell";
    import { is_propagator, propagator_id, propagator_name } from "ppropogator/Propagator/Propagator";
    import { tick } from "svelte";
    import { to_string } from "generic-handler/built_in_generics/generic_conversation";
    import { execute_all_tasks_sequential, steppable_run_task, summarize_scheduler_state } from "ppropogator/Shared/Reactivity/Scheduler";
    import { physics_layer } from "../../physics/physics_layer";
    import { construct_reactor, construct_stateful_reactor } from "ppropogator/Shared/Reactivity/Reactor";
    import { is_contradiction, is_nothing } from "ppropogator/Cell/CellValue";

    const cells = cells_to_store(observe_cell_array)
    const propagators = propagators_to_store(observe_propagator_array) 

    let displayables = $derived(network_to_displayable(make_better_set($cells), make_better_set($propagators)))
    let layered_connectable: LayeredObject[] = $derived(to_array(displayables.nodes))
    let scheduler_state = $state("unruned")
    let t = $state(construct_stateful_reactor(true))

    // TODO: 1.extract simulation logic into function because that could be more flexible
    // 2. add single view for each cell (it should update as long as cell content is changing)
    // 3. add single view for each propagator (it should update as long as propagator content is changing)


    async function ticking(){
       

        for (let i = 0; i < 30000; i++){    
            steppable_run_task((e: Error | null) => {
                if (e){
                    console.log(e)
                }


            })

            t.next(!t.get_value())
 
            
            scheduler_state = summarize_scheduler_state()
            await new Promise(resolve => setTimeout(resolve, 2))
        }
    }

    operation()

    // TODO: 5. this is so dumb!!
    function get_connectable_name(o: LayeredObject | Node): string{
        if (is_layered_object(o)){
            const obj = get_base_value(o)
            if (is_cell(obj)){
                return cell_name(obj)
            }
            else if (is_propagator(obj)){
                return propagator_name(obj)
            }
            else{
                return "unknown"
            }
        }
        else{
            return "unknown"
        }
    }

    function get_id(o: LayeredObject | Node): string{
        if (is_layered_object(o)){
            const obj = get_base_value(o)
            if (is_cell(obj)){
                return cell_id(obj)
            }
            else if (is_propagator(obj)){
                return propagator_id(obj)
            }
            else{
                return "unknown"
            }
        }
        else{
            return "unknown"
        }
    }

    function get_value(o: LayeredObject | Node): string{
        if (is_layered_object(o)){
            const obj = get_base_value(o)
            if (is_cell(obj)){

                const value = cell_strongest_base_value(obj)

                if (is_contradiction(value)){
                    return ""
                }
                else if (is_nothing(value)){
                    return " "
                }
                else{
                    return to_string(value)
                }
            }
            else if (is_propagator(obj)){
                return  " "
            }
            else{
                return "unknown"
            }
        }
        else{
            return "unknown"
        }
    }

    let last_value_saver = $state(new Map<string, any>())
    function get_color(o: LayeredObject | Node): string{
        const value = get_value(o)
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

</script>

{#snippet connectable_view(o: LayeredObject | Node)}
    <!-- @ts-ignore -->
    {@const node =  ensure_node(o)}
    {@const position = pipe(safe_get_node_pos(node), translate(make_vector(300, 300)))}
    {@const color = get_color(o)}
    <circle
        cx={get_x(position)}
        cy={get_y(position)}
        r="4"
        fill= {color}

    />

    <text style="font-family:'Times New Roman', Times, serif" x={get_x(position) } y={get_y(position) - 10 } text-anchor="middle" dy=".3em" fill= {color} font-size="8px">
      {get_connectable_name(o)}   {get_value(o)}
  </text>

    <!-- <text style="font-family:helvetica" font-weight="bold" x={get_x(position) } y={get_y(position)} text-anchor="middle" dy=".3em" fill=#fffff font-size="4px">
        {get_value(o)}
    </text> -->
   
  
{/snippet}

{#snippet link_view(link: Link)}
    {@const source = pipe(safe_get_node_pos(link.source), translate(make_vector(300, 300)))}
    {@const target = pipe(safe_get_node_pos(link.target), translate(make_vector(300, 300)))}

    <line
        x1={get_x(source)}
        y1={get_y(source)}
        x2={get_x(target)}
        y2={get_y(target)}
        stroke="#c6bfde"
        stroke-width="0.3"
    />
{/snippet}



<button onclick={ticking}>Tick</button>


Count : {scheduler_state}

<Graph connectables={layered_connectable} connectable_visualizer={connectable_view} links={to_array(displayables.links)} link_visualizer={link_view} update_signal={t}  />

