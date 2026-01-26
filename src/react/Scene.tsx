import { Canvas } from '@react-three/fiber'
import Model from './Model';
import { Environment, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'

export default function Index(props: { t: any }) {
  const { t } = props
  const spotLightRef = useRef(null)

  return (
    <div className="w-full h-full">
      <Canvas shadows={true} color='red' className="w-full h-full" camera={{ position: [0, 0, 5], rotation: [0, 0, 0.3] }}>
          <Model t={t} spotLightRef={spotLightRef} />
          <directionalLight position={[-7.8, 0, -2]} castShadow intensity={Math.PI * 2} />
          {/* mb use z=5.75 */}
          {/* <spotLight ref={spotLightRef} position={[-10, -0.7, -0.6]} angle={0.3} penumbra={1} intensity={1000} castShadow visible={true} /> */}
          <spotLight ref={spotLightRef} position={[-5.7, -0.8, 6.21]} angle={0.3} penumbra={1} intensity={1000} castShadow visible={true} />
          <pointLight position={[5, 0, 3.76]} intensity={400} castShadow />
          {/* <OrbitControls />
          <axesHelper args={[0,0,5]} /> */}
          {/* <directionalLight position={[-3.3, 1.0, 4.4]} castShadow intensity={Math.PI * 2} />
          <directionalLight position={[0, -1.0, 4.4]} castShadow intensity={Math.PI * 2} /> */}
          {/* <Environment preset="park" /> */}
      </Canvas>
    </div>
  )
}
