<script lang="ts">
    import { type Cell } from "ppropogator/Cell/Cell";
    import { reactor_to_store } from "../../convertor/cell_to_store";
    import { tell } from "ppropogator/Helper/UI";

    interface Props {
        cell: Cell;
    }

    let { cell }: Props = $props();

    let content = reactor_to_store(cell.getContent());
    let strongest = reactor_to_store(cell.getStrongest());

    let updating_content = $state(false);
    let new_content = $state('');
    let premises = $state('');

    function telling() {
        tell(cell, Number(new_content), premises);
        updating_content = false;
    }

    function update_content() {
        updating_content = true;
        console.log("updating_content", updating_content);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            telling();
        }
    }
</script>

<div>
    <h1>Cell Data</h1>
    <p>ID: {cell.getRelation().name}</p>
    {#if updating_content}
        <input bind:value={new_content} onkeydown={handleKeydown} />
        <input bind:value={premises} onkeydown={handleKeydown} />
        <button onclick={telling}>Submit</button>
    {:else}
        <p>content: {$content.describe_self != undefined ? $content.describe_self() : $content}</p>
        <p>strongest: {$strongest.describe_self != undefined ? $strongest.describe_self() : $strongest}</p>
        <button onclick={update_content}>update_v</button>
    {/if}
</div>