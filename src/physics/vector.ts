
import { divide, multiply, subtract } from "generic-handler/built_in_generics/generic_arithmetic"
import { define_generic_procedure_handler } from "generic-handler/GenericProcedure"
import { all_match, register_predicate } from "generic-handler/Predicates"
import { add } from "ppropogator/Cell/GenericArith"


export interface Vector{
    dimension: number,
    data: number[]
}

export function make_vector(...args: number[]): Vector{
    return {
        dimension: args.length,
        data: args
    }
}

export function get_x(v: Vector){
    if (v){
         return v.data[0]
    }
    else{
        return 0
    }
}

export function get_y(v: Vector){
    if (v){
        return v.data[1]
    }
    else{
        return 0
    }
}

export const is_vector = register_predicate("is_vector", (input: any) => {
    return input.dimension !== undefined && input.data !== undefined
})


export function make_vector_arithmetic(op: (a: number, b: number) => number): (a: Vector, b: Vector) => Vector{
    return (a: Vector, b: Vector) => {
        if(a.dimension !== b.dimension){
            throw new Error("Vector dimensions must be equal")
        }

        return make_vector(...a.data.map((v, i) => op(v, b.data[i])))
    }
}

export const vector_add = make_vector_arithmetic((a, b) => a + b)
export const vector_sub = make_vector_arithmetic((a, b) => a - b)
export const vector_mul = make_vector_arithmetic((a, b) => a * b)
export const vector_div = make_vector_arithmetic((a, b) => a / b) 

export function vector_dot_product(a: Vector, b: Vector){
    return a.data.map((v, i) => v * b.data[i]).reduce((acc, v) => acc + v)
} 

export function vector_cross_product(a: Vector, b: Vector){
    if(a.dimension !== 3 || b.dimension !== 3){
        throw new Error("Cross product only defined for 3D vectors")
    }

    return make_vector(a.data[1] * b.data[2] - a.data[2] * b.data[1],
                       a.data[2] * b.data[0] - a.data[0] * b.data[2],
                       a.data[0] * b.data[1] - a.data[1] * b.data[0])
}

define_generic_procedure_handler(add, all_match(is_vector), vector_add)
define_generic_procedure_handler(subtract, all_match(is_vector), vector_sub)
define_generic_procedure_handler(multiply, all_match(is_vector), vector_mul)
define_generic_procedure_handler(divide, all_match(is_vector), vector_div)


export function make_vector_modifer<E>(op: (a: Vector, b: E) => Vector): (b:E) => (a: Vector) => Vector{
    return (b: E) => { 
        return (a: Vector) => {
            return op(a, b)
        }
    }
}

export const translate = make_vector_modifer<Vector>((a, b) => vector_add(a, b))
export const scale = make_vector_modifer<number>((a, b) => make_vector(...a.data.map(v => v * b)))
export const rotate = make_vector_modifer<number>((a, b) => {
    if(a.dimension !== 2){
        throw new Error("Rotation only defined for 2D vectors")
    }

    const [x, y] = a.data

    return make_vector(x * Math.cos(b) - y * Math.sin(b), x * Math.sin(b) + y * Math.cos(b))
})