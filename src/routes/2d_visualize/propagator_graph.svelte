<script lang="ts">
    import { observe_cell_array, observe_propagator_array } from "ppropogator/Shared/PublicState";
    import { network_to_displayable } from "../../convertor/network_to_visualizable.svelte";
    import { make_better_set } from "generic-handler/built_in_generics/generic_better_set";
    import { operation } from "../../NetworkDefinition.ts/SimpleTest";
    import {  execute_all_tasks_sequential, steppable_run_task, summarize_scheduler_state } from "ppropogator/Shared/Reactivity/Scheduler";
    import { type LayeredObject } from "sando-layer/Basic/LayeredObject";
    import { get_strongest_value, get_id } from "../../helper/primtive_generics";
    import { type Link } from "../../physics/physical_node";
    import Graph from "./force_directed_graph/graph.svelte";
    import { ReactorWrapper } from "../../convertor/reactor_to_state.svelte";
    // TODO: 1.extract simulation logic into function because that could be more flexible
    // 2. add single view for each cell (it should update as long as cell content is changing)
    // 3. add single view for each propagator (it should update as long as propagator content is changing)

    const cells = new ReactorWrapper(observe_cell_array, [])
    const propagators = new ReactorWrapper(observe_propagator_array, [])

    let displayables = $derived(network_to_displayable(make_better_set(cells.value), make_better_set(propagators.value)))
    let links: Link[] = $derived(displayables.links)
    let nodes_layered: LayeredObject[] = $derived(displayables.nodes_layered)
    let scheduler_state = $state("unruned")

    async function run_task(){
        execute_all_tasks_sequential((e: Error | null) => {
            if (e){
                console.log(e)
            }
        })
        scheduler_state = summarize_scheduler_state()
    }

    async function run_task_step(){
         for (let i = 0; i < 30000; i++){    
            steppable_run_task((e: Error | null) => {
                if (e){
                    console.log(e)
                }
            })
            await new Promise(resolve => setTimeout(resolve, 2))
        }

        scheduler_state = summarize_scheduler_state()
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


<button onclick={run_task}>Run</button>
<button onclick={run_task_step}>Run Step</button>

<div class="translated-container">
    <Graph connectables={nodes_layered} links={links} />   
</div>

<style>
    .translated-container {
      transform: translate(2000px, 1200px); /* Adjust the values as needed */
      scale: 1.4;
    }
</style>