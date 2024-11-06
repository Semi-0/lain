<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->

<!-- TODO:
- Add node button
- Add node data
- Dynamically update node data
- Map nodes -->

<script>
    import Network from './network.svelte';
    import { Canvas } from "@threlte/core"
    import Scene from "./visualization/scene.svelte"
    import ForceDirectedGraph from './2d_visualize/force_directed_graph.svelte';
  
    // import d3 from 'd3'

        // colors: d3.schemeTableau10


    
</script>

<!-- <Network />  -->

<ForceDirectedGraph   />
 
<!-- <Canvas>
    <Scene />
</Canvas>  -->