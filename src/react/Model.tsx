import { useGLTF, MeshTransmissionMaterial, Text } from '@react-three/drei'
import { useControls } from 'leva'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export default function Model(props: { t: any, spotLightRef: any }) {
  const { nodes } = useGLTF('/models/crystal.glb')
  const stoneRef = useRef(null)
  const { t, spotLightRef } = props
  const textRef = useRef(null)

  const materialProps = useControls({
    thickness: { value: 1.90, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: {value: 0.95, min: 0, max: 1, step: 0.1},
    ior: { value: 2.18, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.05, min: 0, max: 1},
    backside: { value: true},
    color: { value: '#d11818', label: 'Color' },
    distortion: { value: 0.73, min: 0, max: 1},
    distortionScale: { value: 1, min: 0, max: 1},
    distortionCenter: { value: [0, 0], min: 0, max: 1},
  })

  // useControls('Spot Light', {
  //   visible: {
  //     value: true,
  //     onChange: (v) => {
  //       spotLightRef.current.visible = v
  //     },
  //   },
  //   position: {
  //     x: 3,
  //     y: 2.5,
  //     z: 1,
  //     onChange: (v) => {
  //       spotLightRef.current.position.copy(v)
  //     },
  //   }
  // })

  useFrame((state, delta) => {
    if (stoneRef.current) {
      stoneRef.current.rotation.y += 0.01 / 2
    }
  })

  return (
    <group {...props} dispose={null}>
      <Text ref={textRef} rotation={[0, 0, 0.3]} position={[0, 0, -5]} fontSize={5}>{t.name}</Text>
      <mesh ref={stoneRef} {...nodes.Cube001}>
        <MeshTransmissionMaterial {...materialProps}/>
      </mesh>
    </group>
  )
}

useGLTF.preload('/models/crystal.glb')
