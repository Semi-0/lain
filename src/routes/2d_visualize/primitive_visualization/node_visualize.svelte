<script lang="ts">
    import {  type LayeredObject } from "sando-layer/Basic/LayeredObject";
    import { get_id, get_name, get_value_publisher } from "../../../helper/primtive_generics";
    import { get_x, get_y } from "../../../physics/vector";
    import { get_position } from "../../../physics/physics_layer.svelte";
    import {  ReactorWrapper } from "../../../convertor/reactor_to_state.svelte";
    import { get_base_value } from "sando-layer/Basic/Layer";

    //TODO: notify color based on update

    interface Prop{
        node:  LayeredObject,
    }

    let props: Prop = $props()

    let last_value_saver = $state(new Map<string, any>())
    function get_color(o: LayeredObject | Node, last_value_saver: Map<string, any>, strongest_value: any): string{
        const value = get_base_value(strongest_value)
        const id = get_id(o) 
        const last_value = last_value_saver.get(id) 

        if (value === ""){
            return "#99001a"
        }
        else if (value === last_value){
            return  "#c6bfde"
        }
        else{
            last_value_saver.set(id, value)
            return  "#66ff66"
        }
    }


    let position = $derived(get_position(props.node))
 
    // @ts-ignore
    let strongest_value_store : ReactorWrapper = new ReactorWrapper(get_value_publisher(props.node), "")
    let color = $derived(get_color(props.node, last_value_saver, strongest_value_store.value))
  
    
</script>




<!-- <text x=50 y= 50>
    
    {get_x(position)}
</text> -->

<circle
    cx={get_x(position) }
    cy={get_y(position) }
    r="4"
 fill={color}
/>  

<text style="font-family:'Times New Roman', Times, serif" 
          x={get_x(position)}
          y={get_y(position) - 10} 
text-anchor="middle" dy=".3em"
  font-size="8px">
    {get_name(props.node)} {get_base_value(strongest_value_store.value)}
</text>



