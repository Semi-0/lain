
import type { Node, NodeViewModel, Link, LinkViewModel } from "./types";
import { default_link_view_model, default_node_view } from "./types";
import * as d3 from 'd3';


export function create_SVG(d3: any, width: number, height: number){
    return  d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
}



export function insert_nodes(svg: any, nodes: Node[], view: NodeViewModel){
    return svg.append("g")
         .attr("fill", view.fill)
         .attr("stroke", view.stroke)
         .attr("stroke-width", view.stroke_width)
         .attr("stroke-opacity", view.stroke_opacity)
         .selectAll("circle")
         .data(nodes)
         .join("circle")
         .attr("r", view.radius);
 }




export function insert_links(svg: any, links: Link[], view: LinkViewModel){
     return svg.append("g")
         .attr("stroke", view.stroke)
         .attr("stroke-opacity", view.stroke_opacity)
         .attr("stroke-width", view.stroke_width)
         .attr("stroke-linecap", view.stroke_line_cap)
         .selectAll("line")
         .data(links)
         .join("line");
 }

export function force_graph(invalidation: Promise<any> | undefined, width: number, height: number){
    return (nodes: Node[], links: Link[]) => {
        const forceNode = d3.forceManyBody();
        //@ts-ignore
        const forceLink = d3.forceLink(links).id(({index: i}) => nodes[i].id);

        //@ts-ignore
        const simulation = d3.forceSimulation(nodes)
            .force("link", forceLink)
            .force("charge", forceNode)
            .force("center", d3.forceCenter())
            .on("tick", ticked);

        const svg = create_SVG(d3, width, height)

        const link = insert_links(svg, links, default_link_view_model)
        const node = insert_nodes(svg, nodes, default_node_view)


        if (invalidation != null) invalidation.then(() => simulation.stop());

        function ticked() {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);
            node
                .attr("cx", (d: any) => {
     
                    return d.x
                })
                .attr("cy", (d: any) => d.y);
        }

        return Object.assign(svg.node());
    }
}

