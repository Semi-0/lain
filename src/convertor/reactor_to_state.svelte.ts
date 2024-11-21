import type { Reactor, StandardReactor } from "ppropogator/Shared/Reactivity/Reactor";


// export function reactor_wrapper<A>(reactor: StandardReactor<A>, default_value: A){
//     var value = $state(default_value)

//     reactor.subscribe((v) => {
//         value = v
//     })

//     return value
// }


export class ReactorWrapper<E>{
    value = $state(undefined as E)
    side_effect = (v: E) => {}

    constructor(reactor: Reactor<E>, default_value: E){
        console.log(reactor)
        this.value = default_value
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