import { Canvas } from '@react-three/fiber'
import Model from './Model';
// import { OrbitControls } from '@react-three/drei' // ? use this if you need to control the camera

export default function Index(props: { t: any }) {
  const { t } = props

  return (
    <div className="h-full -mx-30 ultrawide:mx-0 relative">
      {/* Edge fade overlays for ultra-wide screens */}
      <div className="absolute hidden ultrawide:block -ml-2 inset-y-0 left-0 w-32 z-10 pointer-events-none bg-linear-to-r from-accent dark:from-neutral-black to-transparent" />
      <div className="absolute hidden ultrawide:block -mr-2 inset-y-0 right-0 w-32 z-10 pointer-events-none bg-linear-to-l from-accent dark:from-neutral-black to-transparent" />

      <Canvas shadows={true} color='red' className="w-full h-full" camera={{ position: [0, 0, 5], rotation: [0, 0, 0.3] }}>
          <Model t={t} />

          {/* light sources */}
          <directionalLight position={[-7.8, 0, -2]} castShadow intensity={Math.PI * 2} />
          <spotLight position={[-5.7, -0.8, 6.21]} angle={0.3} penumbra={1} intensity={1000} castShadow visible={true} />
          <pointLight position={[5, 0, 3.76]} intensity={400} castShadow />

          {/* Controls for debugging */}
          {/* <OrbitControls />
          <axesHelper args={[0,0,5]} /> */}
      </Canvas>
    </div>
  )
}
