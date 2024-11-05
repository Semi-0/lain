<script lang="ts">
    import { type Propagator } from "ppropogator/Propagator/Propagator"
    import { to_node_view_model } from "../helper/node_view_model"
    import NodeView from "./node.svelte";
    export let propagator: Propagator
</script>

<NodeView viewModel={to_node_view_model(propagator)} onNodeClicked={(c) => {console.log(c)}} />