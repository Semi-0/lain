<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->

<!-- TODO:
- Add node button
- Add node data
- Dynamically update node data
- Map nodes -->


<script lang="ts">
    import { Node, Svelvet } from 'svelvet';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { readable, writable } from 'svelte/store';
    import { interpolateLab } from 'd3-interpolate';

    let accumulator = 0;
    // Define an array to store node data
    let nodes = [
        { id: "alpha", bgColor: "red", label: "alpha Node", position: { x: 100, y: 100 } },
        { id: "beta", bgColor: "blue", label: "Node Beta", position: { x: 300, y: 300 }, connections: ['alpha'] }
    ];

    function handleClick(e: CustomEvent) {
        const { detail } = e;
        console.log('node id', detail.node.id)
        console.log('Node clicked:', detail);
        
    }

    function onAddNode() {
        const newId = `node_${nodes.length + 1}`;
        nodes = [...nodes, {
            id: newId,
            bgColor: $color,
            label: `Node ${nodes.length + 1}`,
            position: { x: Math.random() * 400, y: Math.random() * 400 }
        }];
    }

    let colorTweens = writable(new Map());
   

    function hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    const colors = ['rgb(255, 62, 0)', 'rgb(64, 179, 255)', 'rgb(103, 103, 120)'];

    let color = tweened(colors[0], {
        duration: 300,
        interpolate: interpolateLab
    });

    let index = 0;

    // Add a function to change node color
    function changeNodeColor(id: string) {
         // change color
        index = index === colors.length - 1 ? 0 : index + 1;
        color.set(colors[index]);

        colorTweens.update(map => {
            const tween = map.get(node.id);
            tween.set(colors[index]);
            return map;
        });
        console.log("change node color clicked");

    }

    // Create a tweened store for each node's color

    // Initialize tweened stores for existing nodes
    nodes.forEach(node => {
        colorTweens.update(map => {
            map.set(node.id, tweened(colors[index], {
                duration: 300,
                easing: cubicOut
            }));
            return map;
        });
      
        console.log("colortweens", colorTweens);
    });


    // Wrap colorTweens in a readable store
    
</script>



<Svelvet id="my-canvas" width={1400} height={900} TD minimap>
    {#each nodes as node (node.id)}
        <Node 
            id={node.id}
            label={node.label}
            position={node.position}
            on:nodeClicked={handleClick}
            connections={node.connections}
            bgColor={$colorTweens.get(node.id)} 
            editable={true}
            let:selected
        >
            <!-- <div slot="content" let:grabHandle let:selected>
                <div 
                    use:grabHandle 
                    class:selected 
                    style="background-color: rgb({$colorSpring.r}, {$colorSpring.g}, {$colorSpring.b});"
                    transition:fade
                >
                    <span>{node.label}</span>
                </div>
            </div> -->
        </Node>
    {/each}
</Svelvet>

<button on:click={onAddNode}>   
    Add Node
</button>
<button on:click={() => changeNodeColor('alpha')}>Change Alpha Node Color</button>

Accumulator: {accumulator}

<style>
    div[use\:grabHandle] {
        transition: background-color 0.3s ease;
    }
</style>

{#each colors as c}
    <button
        style="background-color: {c}; color: white; border: none;"
        on:click={() => color.set(c)}
    >
        {c}
    </button>
{/each}

<h1 style="color: {$color}">{$color}</h1>