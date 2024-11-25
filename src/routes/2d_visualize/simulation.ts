
import { generic_wrapper } from "generic-handler/built_in_generics/generic_wrapper";
import type { Node, NodeViewModel, Link, LinkViewModel } from "../../physics/physical_node";
import { default_link_view_model, default_node_view } from "../../physics/physical_node";
import * as d3 from 'd3';
import { set_map, to_array, type BetterSet } from "generic-handler/built_in_generics/generic_better_set";
import { compose } from "generic-handler/built_in_generics/generic_combinator";
import type { LayeredObject } from "sando-layer/Basic/LayeredObject";
import { ensure_node } from "../../convertor/network_to_visualizable.svelte";
import { construct_simple_generic_procedure, define_generic_procedure_handler } from "generic-handler/GenericProcedure";
import { throw_error } from "generic-handler/built_in_generics/other_generic_helper";
import { match_args } from "generic-handler/Predicates";




export function create_simulation(nodes: Node[], links: Link[], on_tick: () => void){
    return d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((n, i, d) => nodes[i].id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter())
    .on("tick", on_tick)
}

export const ensure_nodes = (s: BetterSet<LayeredObject>) => set_map(s, ensure_node) 

export const create_simulation_from_set = generic_wrapper(create_simulation, 
                                                        (a) => a, 
                                                       compose(ensure_nodes, to_array), 
                                                        to_array,
                                                       (a) => a)




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
            nodes.forEach((a) => console.log(a))
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





export function test_simulation(){
    const construct = spawn_nodes_constructor()
    var ns: any[] = []
    var link = {source: 0, target: 1}
    for(var i = 0; i < 10; i++){
        ns.push(construct())
    }

    const simulation = d3.forceSimulation(ns)
    //@ts-ignore
                        .force("link", d3.forceLink([link]).id(({index: i}) => ns[i].index))
                        .force("charge", d3.forceManyBody())
                        .force("center", d3.forceCenter())
                        .on("tick", ticked);


    function ticked() {
        ns.forEach((a) => console.log(a))
    }
}

interface TestNode{
    index: number; 
    x: number;
    y: number;
}

function spawn_nodes_constructor(){
    var index = 0

    return () =>{
        const i = index 
        index += 1
        return {
            index : i,
            x: 0,
            y: 0
        }
    }

}

