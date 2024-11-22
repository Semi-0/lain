<script lang="ts">

    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    import type { Link, Node } from '../../../physics/physical_node'
    import Graph from './graph.svelte';
    import { get_node_pos } from '../../../physics/physical_node';
    import { get_x, get_y, make_vector, translate } from '../../../physics/vector';
    import { pipe } from 'fp-ts/lib/function';
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
            // @ts-ignore
            nodeId = d => d.id,
            linkSource = ({source}) => source,
            linkTarget = ({target}) => target,
   
        }: ForceGraphConfig = {}
    ) {
        // Compute values.
        const N = d3.map(nodes, nodeId).map(intern);
        const LS = d3.map(links, linkSource).map(intern);
        const LT = d3.map(links, linkTarget).map(intern);

        const  translation = make_vector(100, 100)
        // Replace the input nodes and links with mutable objects for the simulation.
        const s_nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
        const s_links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

        return {
            nodes: s_nodes,
            links: s_links
        }
    }
</script>

{#snippet circle_node_view(node: Node)}
    {@const position = pipe(get_node_pos(node), translate(make_vector(300, 300)))}
    <circle
        cx={get_x(position)}
        cy={get_y(position)}
        r="5"
        fill="#69b3a2"
        stroke="#fff"
        stroke-width="1.5"
    />
{/snippet}

{#snippet line_link_view(link: Link)}
    {@const source = pipe(get_node_pos(link.source), translate(make_vector(300, 300)))}
    {@const target = pipe(get_node_pos(link.target), translate(make_vector(300, 300)))}
    <line
        x1={get_x(source)}
        y1={get_y(source)}
        x2={get_x(target)}
        y2={get_y(target)}
        stroke="#69b3a2"
        stroke-width="3"
    />
{/snippet}

<!-- <div bind:this={element}>     -->


<!-- <Graph connectables={nodes} connectable_visualizer={circle_node_view} links={links} link_visualizer={line_link_view} />

<style>
</style>
 -->
