<script lang="ts">

    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { force_graph } from './simulation'; 

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

    onMount(async function() {
        const data = await d3.json<GraphData>('https://vega.github.io/vega-datasets/data/miserables.json');
        console.log(data);

        if (data) {
            const chart = map_data_to_graph(data, {
                nodeId: (d: DataNode) => d.index,
                nodeGroup: (d: DataNode) => d.group,
                nodeTitle: (d: DataNode) => `${d.name}\n${d.group}`,
                linkStrokeWidth: (l: DataLink) => Math.sqrt(l.value),
                width,
                height: 600,
            });

            d3.select(element).append(() => chart);
        }
    });

    interface ForceGraphConfig {
        nodeId?: (d: DataNode) => string | number;
        nodeGroup?: (d: DataNode) => number;
        nodeGroups?: (string | number)[];
        nodeTitle?: (d: DataNode) => string;
        nodeFill?: string;
        nodeStroke?: string;
        nodeStrokeWidth?: number;
        nodeStrokeOpacity?: number;
        nodeRadius?: number;
        nodeStrength?: number;
        linkSource?: (d: DataLink) => string | number | DataNode;
        linkTarget?: (d: DataLink) => string | number | DataNode;
        linkStroke?: string | ((d: DataLink) => string);
        linkStrokeOpacity?: number;
        linkStrokeWidth?: number | ((d: DataLink) => number);
        linkStrokeLinecap?: string;
        linkStrength?: number;
        colors?: readonly string[];
        width?: number;
        height?: number;
        invalidation?: Promise<any>;
    }



    function intern(value: any) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

    function map_data_to_graph(
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

        const graph = force_graph(invalidation, width, height)
        return graph(s_nodes, s_links)
    }
</script>

<div bind:this={element}>    
</div>

<style>
</style>

