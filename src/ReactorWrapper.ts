import { construct_simple_generic_procedure } from "generic-handler/GenericProcedure"
import { register_predicate } from "generic-handler/Predicates"
import { type Reactor } from "ppropogator/Reactor"
export interface Store<T> {
    subscribe: (subscription: (value: any) => void) => (() => void), 
    set?: (value: any) => void
}


export function to_store<T>(reactor: Reactor<T>): Store<T> {
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

