import { register_predicate } from "generic-handler/Predicates"
import { make_vector, type Vector } from "../helper/vector"

export interface Node {
    id: string 
    x?: number
    y?: number
}

export const is_node = register_predicate("is_node", (input: any) => {
    return input.id !== undefined && input.x !== undefined && input.y !== undefined
})

export function safe_get_node_pos(node: Node): Vector{
    return make_vector(node.x ?? 0, node.y ?? 0)
}

export interface Link{
    source: Node
    target: Node 
}

export interface LinkViewModel{
    stroke: string,
    stroke_opacity: number,
    stroke_width: number,
    stroke_line_cap : string,
}


export const default_link_view_model = {
    stroke: "#999",
    stroke_opacity: 0.6,
    stroke_width: 1.5,
    stroke_line_cap : "round",
}



export interface NodeViewModel{
    fill: string,
    stroke: string,
    stroke_width: number 
    stroke_opacity: number,
    radius: number
}


export function node_view_model(fill: string, stroke: string, stroke_width: number, stroke_opacity: number, radius: number){
    return {
        fill: fill,
        stroke: stroke,
        stroke_width: stroke_width,
        stroke_opacity: stroke_opacity,
        radius: radius
    }
}

export const default_node_view = node_view_model("currentColor","#fff", 1.5, 1, 5)