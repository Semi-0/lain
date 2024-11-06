<script lang="ts">

    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    import type { Link, Node } from './types'
    import { force_graph } from './simulation'; 

    // TODO: further extract force directed graph from loading data

    interface DataNode {
        index: number;
        name: string;
        group: number;
        id?: string;
        x?: number;
        y?: number;
        fx?: number | null;
        fy?: number | null;
    }

    interface DataLink {
        source: number | DataNode;
        target: number | DataNode;
        value: number;
    }

    interface GraphData {
        nodes: DataNode[];
        links: DataLink[];
    }

    let width = 450;
    let element: HTMLDivElement;


    let nodes: Node[] = $state([])
    let links: Link[] = $state([])

    onMount(async function() {
        const data = await d3.json<GraphData>('https://vega.github.io/vega-datasets/data/miserables.json');
        console.log(data);

        if (data) {
            const mapped_data = to_visualizable_data(data, {
                nodeId: (d: DataNode) => d.index,
                width,
                height: 600,
            });

            nodes = mapped_data.nodes
            links = mapped_data.links

            const graph = force_graph(undefined, 640, 800)
            const chart =  graph(mapped_data.nodes, mapped_data.links) 

            d3.select(element).append(() => chart);
        }
    });

    interface ForceGraphConfig {
        nodeId?: (d: DataNode) => string | number;
        linkSource?: (d: DataLink) => string | number | DataNode;
        linkTarget?: (d: DataLink) => string | number | DataNode;
  
        width?: number;
        height?: number;
        invalidation?: Promise<any>;
    }



    function intern(value: any) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

    function to_visualizable_data(
        { nodes, links }: GraphData,
        {
            nodeId = d => d.id,
            linkSource = ({source}) => source,
            linkTarget = ({target}) => target,
            width = 640,
            height = 400,
            invalidation
        }: ForceGraphConfig = {}
    ) {
        // Compute values.
        const N = d3.map(nodes, nodeId).map(intern);
        const LS = d3.map(links, linkSource).map(intern);
        const LT = d3.map(links, linkTarget).map(intern);
       
        // Replace the input nodes and links with mutable objects for the simulation.
        const s_nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
        const s_links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

        return {
            nodes: s_nodes,
            links: s_links
        }

    }
</script>

<div bind:this={element}>    
</div>

<!-- <Graph nodes={nodes} links={links} width={640}, height={400}> -->

<style>
</style>

