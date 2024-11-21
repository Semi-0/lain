import type { Reactor, StandardReactor } from "ppropogator/Shared/Reactivity/Reactor";
import { SvelteMap } from "svelte/reactivity";

// export function reactor_wrapper<A>(reactor: StandardReactor<A>, default_value: A){
//     var value = $state(default_value)

//     reactor.subscribe((v) => {
//         value = v
//     })

//     return value
// }

const update_store = $state(new SvelteMap<string, any>())

export function reactor_wrapper_2(reactor: Reactor<any>, key: string){
    update_store.set(key, "none")

    reactor.subscribe((v) => {
        update_store.set(key, v)
    })
}

export function get_reactor_value(key: string){
    return update_store.get(key)
}


export class ReactorWrapper<E>{
    value = $state(undefined as E)
    side_effect = (v: E) => {}

    constructor(reactor: Reactor<E>, default_value: E){
        // console.log(reactor)
        // this.value = default_value
        reactor.subscribe((v) => { 
            this.value = v
            this.side_effect(this.value)
        })
    }

    do = (f: (v: E) => void) => {
        // for debug
        this.side_effect = f
    }
}

export function construct_reactor_wrapper(reactor: Reactor<any>, default_value: any){
    return new ReactorWrapper(reactor, default_value)
}