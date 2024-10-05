<script lang="ts">
    import CellComponent from "./cell.svelte";
    import { Svelvet } from "svelvet";
    import { cell_id } from "ppropogator/Cell/Cell";
    import { cells_to_store, propagators_to_store } from "../helper/wrappers";
    import { observe_cell_array } from "ppropogator/PublicState";
    import { Cell } from "ppropogator/Cell/Cell";


    const cells = cells_to_store(observe_cell_array)
    $: healthy_cells = $cells.filter((e) => e instanceof Cell)
   
    $: len = healthy_cells !== undefined ? healthy_cells.length : "undefined"



    function add_cell(name: string) {
        console.log("cell add")
        new Cell(name) 
    }

</script>


<Svelvet id="propagator-network" width={300} height={300} TD minimap>

    {#each healthy_cells as cell (cell_id(cell))}
        <CellComponent {cell} />
    {/each}

</Svelvet>

<button on:click={() => add_cell("cell")}>Add Cell</button>

CellType: {$cells}
CellLength: {len}