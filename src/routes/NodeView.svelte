<script lang="ts">
    import { type Store } from "../ReactorWrapper"
    // TODO: reactive update value ( how to properly define value?)
    import { tweened } from "svelte/motion";
    import { Node, type CSSColorString } from "svelvet"
    import { interpolateLab } from "d3-interpolate"
    import { type NodeViewModel } from "../NodeViewModel"
    export let viewModel : NodeViewModel
    export let onNodeClicked : (node: NodeViewModel) => void
 
    
    // @ts-ignore
    let bgColor: Tweened<CSSColorString> = tweened("rgb(255, 62, 0)", {
        duration: 300,
        interpolate: interpolateLab
    });
 
    $: label = viewModel.label

    function handleClick(e: CustomEvent) {
        const { detail } = e; 

        if (detail.node.id === viewModel.id) {
            onNodeClicked(viewModel)
        }
    }
</script>

<Node 
    id={viewModel.id}
    label={$label}
    position={viewModel.position}
    connections={viewModel.connections}
    bgColor={$bgColor}
    on:nodeClicked={handleClick}
/> 