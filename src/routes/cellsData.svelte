<script lang="ts">
    import CellData from "./CellData.svelte";
    import { Cell } from "ppropogator/Cell/Cell"
    export let cells : Cell[]
</script>

<div>
    {#each cells as cell}
        <CellData {cell} />
    {/each}
</div>