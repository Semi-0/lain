<script lang="ts">
    import { cells_to_store, propagators_to_store } from "../helper/wrappers";
    import { observe_cell_array, observe_propagator_array } from "ppropogator/PublicState";
    import CellsData from "./cellsData.svelte";
    import { operation } from "../NetworkDefinition.ts/SimpleTest";
    import { execute_all_tasks_sequential } from "ppropogator/Scheduler"
    import { steppable_run_task } from "ppropogator/Scheduler"
    const cells = cells_to_store(observe_cell_array)
    $: len = $cells !== undefined ? $cells.length : "undefined"

    operation()

    function run_network(){
        execute_all_tasks_sequential((e) => {
            console.log("error", e)
        }, () => {
            console.log("done")
        })
    }

    function run_network_step(){
        steppable_run_task((e) => {
            console.log("error", e)
        })
    }

    // function add_cell(name: string) {
    //     console.log("cell add")
    //     new Cell(name) 
    // }

</script>

<div>
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
<button on:click={run_network}>Run Network</button>
<button on:click={run_network_step}>Run Network Step</button>
<!-- 
<button on:click={() => add_cell("cell")}>Add Cell</button> -->

