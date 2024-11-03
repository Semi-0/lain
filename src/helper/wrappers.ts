
import { construct_simple_generic_procedure, define_generic_procedure_handler } from "generic-handler/GenericProcedure"
import { match_args, register_predicate } from "generic-handler/Predicates"
import { observe_cell_array, type PublicStateCommand, type PublicStateMessage } from "ppropogator/Shared/PublicState"
import { type StandardReactor,  type Reactor, type StatefulReactor } from "ppropogator/Shared/Reactivity/Reactor"
import { set_global_state as set_propagator_system_state } from "ppropogator/Shared/PublicState"
import type { Cell } from "ppropogator/Cell/Cell"
import type { Propagator } from "ppropogator/Propagator/Propagator"
import type { ReadOnlyReactor } from "ppropogator/Shared/Reactivity/Reactor"

export interface Store<T> {
    subscribe: (subscription: (value: any) => void) => (() => void), 
    set?: (value: any) => void
}


export function reactor_to_store<T>(reactor: StandardReactor<T>): Store<T> {
    return {
        subscribe: (subscription: (value: T) => void) => {
            reactor.subscribe(subscription)
            return () => {
                reactor.unsubscribe(subscription)
            }
        },
        set: (value: T) => {
            reactor.next(value)
        }
    }
}

export function propagator_system_state_to_store<T>(){
    return (state: ReadOnlyReactor<T>) => {
       return{
         subscribe: (subscription: (value: T) => void) => {
            state.subscribe(subscription)
    
            return () => {
                state.unsubscribe(subscription)
            }
         },
         set: (value: T) => {
            console.log("should not set propagator system state from outside!!!")
         }
       }
    }
}

export const cells_to_store = propagator_system_state_to_store<Cell[]>()

export const propagators_to_store = propagator_system_state_to_store<Propagator[]>() 

export const amb_propagators_to_store = propagator_system_state_to_store<Propagator[]>()


