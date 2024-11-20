<script lang="ts">
    import { type LayeredObject } from "sando-layer/Basic/LayeredObject";
    import { get_id, get_name, get_strongest_value, get_value_store } from "../../../helper/primtive_generics";
    import { get_x, get_y } from "../../../physics/vector";
    import { get_base_value } from "sando-layer/Basic/Layer";
    import { get_position } from "../../../physics/physics_layer";
    import type { Reactor, StandardReactor } from "ppropogator/Shared/Reactivity/Reactor";
    import { onMount } from "svelte";
    import { reactor_to_store } from "../../../convertor/cell_to_store";

    interface Prop{
        node:  LayeredObject,
        update: StandardReactor<boolean>
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

    let cell = props.node
    let position = $derived(get_position(cell))
    let color = $derived(get_color(cell))
    let update = props.update
 

    onMount(() => {
     
        update.subscribe((v) => {
            console.log(v)
        })
    })

    $effect(() => {
        console.log("effected")
   
    })


    let strongest_value_store : LayeredObject = get_value_store(cell)




</script>

<circle
    cx={get_x(position)}
    cy={get_y(position)}
    r="4"
/>

<text style="font-family:'Times New Roman', Times, serif" x={get_x(position) }
 y={get_y(position) - 10 } text-anchor="middle" dy=".3em"
  font-size="8px">
    {get_name(cell)} 
</text>

