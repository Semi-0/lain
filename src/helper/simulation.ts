// import { define_generic_procedure_handler } from "generic-handler/GenericProcedure"
// import { uuid } from "uuidv4"
// import { add, multiply, subtract, divide} from "generic-handler/built_in_generics/generic_arithmetic"
// import { all_match, register_predicate } from "generic-handler/Predicates"

// class PhysicParameters{
//     coulombConstant: number = 100
//     springConstant: number = 0.45
//     dampingCoefficient: number = 0.1
//     timeStep: number = 0.9
//     frictionConstant : number = 0.9
//     distantConstant: number = 300
//     mass: number = 1.1
//     staticThreshold: number = 1.0
// }

// class Vector{
//     x: number
//     y: number 

//     constructor(_x: number, _y: number){
//         this.x = _x 
//         this.y = _y
//     }
// }

// function empty_vector(){
//     return new Vector(0, 0)
// }

// const is_vector = register_predicate("is_vector", (a) => a instanceof Vector)

// define_generic_procedure_handler(add,
//     all_match(is_vector),

// )


// class Node{
//     id: string = uuid()
//     private acceleration: Vector = empty_vector()
//     private velocity: Vector =  empty_vector()
//     private position: Vector =  empty_vector()
//     private mass : Vector =  empty_vector()
// }



