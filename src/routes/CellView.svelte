<!-- <script lang="ts">
    import { Cell } from "ppropogator/Cell/Cell"
    export let cell : Cell

</script> -->


<script lang="ts">
    import { Cell } from "ppropogator/Cell/Cell"
    import NodeView from "./NodeView.svelte";
    import { to_node_view_model } from "../NodeViewModel";
    export let cell : Cell
</script>

<NodeView viewModel={to_node_view_model(cell)} onNodeClicked={(c) => {console.log(c)}} />