<script lang="ts">
    import CellData from "./cellData.svelte";
    import { type Cell } from "ppropogator/Cell/Cell"
    export let cells : Cell[]
</script>

<div>
    {#each cells as cell}
        <CellData {cell} />
    {/each}
</div>