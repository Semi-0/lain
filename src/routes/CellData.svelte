<script lang="ts">
    import { Cell } from "ppropogator/Cell/Cell"
    import { reactor_to_store } from "../helper/wrappers";
    import { is_layered_object } from "ppropogator/temp_predicates";
    import { tell } from "ppropogator/ui";
    export let cell : Cell

    let content = reactor_to_store(cell.getContent())
    let strongest = reactor_to_store(cell.getStrongest())

    let updating_content = false 
    let new_content = ''

    function telling(){
        tell(cell, Number(new_content), "fst")
        updating_content = false
    }

    function update_content(){
        updating_content = true
        console.log("updating_content", updating_content)
    }
</script>

<div>
    <h1>Cell Data</h1>
    <p>ID: {cell.getRelation().name}</p>
    {#if updating_content}
       <input bind:value={new_content} on:blur={telling} />
    {:else}
       <p>content: {is_layered_object($content) ? $content.describe_self() : $content}</p>
       <p>strongest: {is_layered_object($strongest) ? $strongest.describe_self() : $strongest}</p>
        <button on:click={update_content}>update_v</button>
    {/if}

</div>