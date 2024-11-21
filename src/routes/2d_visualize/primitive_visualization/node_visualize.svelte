<script lang="ts">
    import { is_layered_object, type LayeredObject } from "sando-layer/Basic/LayeredObject";
    import { get_id, get_name, get_strongest_value, get_value_publisher, get_value_store } from "../../../helper/primtive_generics";
    import { get_x, get_y, make_vector, translate, type Vector } from "../../../physics/vector";
    import { get_base_value } from "sando-layer/Basic/Layer";
    import { get_position, observe_position } from "../../../physics/physics_layer";
    import type { Reactor, StandardReactor } from "ppropogator/Shared/Reactivity/Reactor";
    import { onMount } from "svelte";
    import { reactor_to_store } from "../../../convertor/cell_to_store";
    import { pipe } from "fp-ts/lib/function";
    import { construct_reactor_wrapper, ReactorWrapper } from "../../../convertor/reactor_to_state.svelte";
    import { to_string } from "generic-handler/built_in_generics/generic_conversation";
    import { observe_x } from "../../../physics/physics_layer";

    interface Prop{
        node:  LayeredObject,
        update: StandardReactor<number>
    }

    
    let props: Prop = $props()

    let last_value_saver = $state(new Map<string, any>())
    function get_color(o: LayeredObject | Node): string{
        const value = get_strongest_value(o)
        const id = get_id(o) 
        const last_value = last_value_saver.get(id) 

        if (value === ""){
            return "#99001a"
        }
        else if (value === last_value){
            return "#c6bfde"
        }
        else{
            last_value_saver.set(id, value)
            return "#66ff66"
        }
    }
    //@ts-ignore
    let position =  new ReactorWrapper(observe_x(props.node), make_vector(5, 0))
    let signal = new ReactorWrapper(props.update, 0)
    // let color = $derived(get_color(cell))
    let middle = $state(make_vector(0, 0))
    let count = $state(0)

    function increment(){
        count = count + 1
    }

    position.do((pos: Vector) => {
        console.log("position changed:", position.value)
    })
    
    $effect(() => {
        console.log("effected")
    })
    
    onMount(() => {
        console.log("mounted")
    })


    // @ts-ignore
    let strongest_value_store : ReactorWrapper = new ReactorWrapper(get_value_publisher(props.node), "0")


    $inspect(strongest_value_store)

</script>




<text x=50 y= 50>
    {position.value}
</text>
<!-- 
<circle
    cx={get_x(position.value) }
    cy={get_y(position.value) }
    r="4"
/>  
{/key} -->
<!-- <text style="font-family:'Times New Roman', Times, serif" x={get_x(position.value) }
y={get_y(position.value) - 10 } text-anchor="middle" dy=".3em"
font-size="8px">
    {get_name(cell)} {strongest_value_store.value}
</text> -->



