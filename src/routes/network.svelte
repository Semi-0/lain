<script lang="ts">
    import { cells_to_store, propagators_to_store } from "../convertor/cell->store";
    import { observe_cell_array, observe_propagator_array } from "ppropogator/Shared/PublicState";
    import CellsData from "./cells_data.svelte";
    import { operation } from "../NetworkDefinition.ts/SimpleTest";
    import { execute_all_tasks_sequential, steppable_run_task, summarize_scheduler_state } from "ppropogator/Shared/Reactivity/Scheduler"
    import Graph from "./2d_visualize/graph.svelte";
    const cells = cells_to_store(observe_cell_array)
    let len = $derived($cells !== undefined ? $cells.length : "undefined")
    let state = $state("");
    

    operation()

    function run_network(){
        execute_all_tasks_sequential((e) => {
            console.log("error", e)
        } )
    }

    function run_network_step(){
        steppable_run_task((e) => {
            console.log("error", e)
        })
        summarize_state()
    }

    function summarize_state(){
        state = summarize_scheduler_state()
    }

    // function add_cell(name: string) {
    //     console.log("cell add")
    //     new Cell(name) 
    // }

</script>


<style>
    /* Apply white text color to all text within the div */
    div {
        color: white;
    }
</style>



<div>

    <p>Scheduler State: {state}</p>
    <h1>Propagator Network</h1>
    <h2>Cells</h2>
    <CellsData cells={$cells} />
    <h2>Propagators</h2>
    <!-- {#each $propagators as propagator}
        <p>{propagator.get_name()}</p>
    {/each} -->
</div>
<!-- <Svelvet id="propagator-network" width={1024} height={500} TD minimap> -->



<!-- </Svelvet> -->
<button onclick={run_network}>Run Network</button>
<button onclick={run_network_step}>Run Network Step</button>
<button onclick={summarize_state}>Summarize State</button>
<!-- 
<button on:click={() => add_cell("cell")}>Add Cell</button> -->

