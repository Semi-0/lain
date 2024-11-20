<script lang="ts">
    import CellData from "./cell_data_text.svelte";
    import { type Cell } from "ppropogator/Cell/Cell"
    export let cells : Cell[]
</script>

<div>
    {#each cells as cell}
        <CellData {cell} />
    {/each}
</div>