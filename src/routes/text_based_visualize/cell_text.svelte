<!-- <!-- <script lang="ts">
    import { Cell } from "ppropogator/Cell/Cell"
    export let cell : Cell

</script> -->


<script lang="ts">
    import { type Cell } from "ppropogator/Cell/Cell"
    import NodeView from "./node_text.svelte";
    import { to_node_view_model } from "../../helper/node_view_model";
    export let cell : Cell
</script>

<NodeView viewModel={to_node_view_model(cell)} onNodeClicked={(c) => {console.log(c)}} /> 