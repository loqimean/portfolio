import { useGLTF, MeshTransmissionMaterial, Text } from '@react-three/drei'
// import { useControls } from 'leva' // ? use this if you need to control the material properties
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Model(props: { t: any }) {
  const { nodes } = useGLTF('/models/crystal.glb')
  const stoneRef = useRef(null)
  const { t } = props
  const textRef = useRef(null)

  // Listen for theme changes
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark'
  })

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setIsDark(document.documentElement.getAttribute('data-theme') === 'dark')
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  const lightOptions = {
    thickness: 1.90,
    roughness: 0,
    transmission: 0.95,
    ior: 2.18,
    chromaticAberration: 0.05,
    backside: true,
    color: '#d11818',
    distortion: 0.26,
    distortionScale: 1,
  }

  const darkOptions = {
    thickness: 1.50,
    roughness: 0.1,
    transmission: 0.9,
    ior: 2.18,
    chromaticAberration: 0.16,
    backside: true,
    color: '#b01010',
    distortion: 1.35,
    distortionScale: 0.1,
  }

  // ? use this if you need to control the material properties
  let materialProps = isDark ? darkOptions : lightOptions
  // const materialProps = useControls(options, { collapsed: true })

  const cameraRotation = 0.3

  useFrame((state, delta) => {
    if (stoneRef.current) {
      stoneRef.current.rotation.y += 0.01 / 2
    }

    if (textRef.current) {
      // move text along the camera's local X axis to keep Y visually stable
      const speed = 0.01 / 2
      textRef.current.position.x -= Math.cos(cameraRotation) * speed
      textRef.current.position.y -= Math.sin(cameraRotation) * speed
    }
  })

  return (
    <group {...props} dispose={null}>
      <Text
        ref={textRef}
        rotation={[0, 0, 0.3]}
        position={[-8, -2.5, -2]}
        fontSize={2.5}
        anchorX="left"
        font="/fonts/Lato_Bold.ttf">
          {`${t.name.toLocaleUpperCase()} `.repeat(100)}
      </Text>

      <mesh ref={stoneRef} {...nodes.Cube001}>
        <MeshTransmissionMaterial {...materialProps}/>
      </mesh>
    </group>
  )
}

useGLTF.preload('/models/crystal.glb')
