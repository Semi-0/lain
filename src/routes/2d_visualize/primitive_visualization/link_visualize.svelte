<script lang="ts">
    import { get_position } from "../../../physics/physics_layer";
    import { type Link } from "../../../physics/physical_node";
    import { get_x, get_y } from "../../../physics/vector";

    interface Prop{
        link: Link 
    }

    let props : Prop = $props()
  
    let source_position = $derived(get_position(props.link.source))
    let target_position = $derived(get_position(props.link.target))

    let x1 = $derived(get_x(source_position))
    let y1 = $derived(get_y(source_position))
    let x2 = $derived(get_x(target_position))
    let y2 = $derived(get_y(target_position))

    
    
</script>



<line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke="#c6bfde"
    stroke-width="0.3"
/>
