<script lang="ts">
    import { Propagator } from "ppropogator/Propagator"
    import { to_node_view_model } from "../NodeViewModel"
    import NodeView from "./NodeView.svelte";
    export let propagator: Propagator
</script>

<NodeView viewModel={to_node_view_model(propagator)} onNodeClicked={(c) => {console.log(c)}} />