<script>
  import { T } from '@threlte/core'
  import { interactivity, Text, Billboard, Suspense, Text3DGeometry } from '@threlte/extras'
  import { spring } from 'svelte/motion'

  interactivity()
  const scale = spring(1)
  </script>
  
 <!-- <T.PerspectiveCamera
  makeDefault
  position={[10, 10, 10]}
  oncreate={(ref) => {
    ref.lookAt(0, 5, 0)
  }}
/> -->

<!-- <style>
  :global(body) {
      background-color: black;
      margin: 0;
      padding: 0;
  }
</style> -->


<!-- Add Grid -->
<T.GridHelper 
  args={[10, 10]} 
  position.y={0}
  color="gray"
  secondaryColor="darkgray"
/>


<!-- <T.Mesh>
  <Text3DGeometry text={'Hello World'} />
  <T.MeshStandardMaterial />
</T.Mesh> -->


<T.Mesh position.y={1}
  scale={$scale}
  onpointerenter={() => scale.set(1.5)}
  onpointerleave={() => scale.set(1)}
>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshBasicMaterial color="hotpink" />
</T.Mesh>
   -->