"use client"

import FloatingCan from "@/components/FloatingCan"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Content } from "@prismicio/client"
import { Cloud, Clouds, Environment, Text } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"
import {ScrollTrigger} from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Threetext ({ sentence, color="white" }: { sentence: string, color?: string }) {
  const words = sentence.toUpperCase().split(' ')
  const material = new THREE.MeshLambertMaterial({ color })
  const isDesktop = useMediaQuery('(min-width: 950px)', true)

  return words.map((word, i) => (
    <Text
      key={i}
      scale={isDesktop ? 1 : .5}
      color={color}
      material={material}
      font="/fonts/Alpino-Variable.woff"
      fontWeight={900}
      anchorX={"center"}
      anchorY={"middle"}
      characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!,./?'"
    >
      {word}
    </Text>
  ))
}

type Props = {
  sentence: string | null
  flavor: Content.SkyDiveSliceDefaultPrimary['flavor']
}

const Scene = ({ sentence, flavor }: Props) => {
  const groupRef = useRef<THREE.Group>(null)
  const canRef = useRef<THREE.Group>(null)
  const cloud1Ref = useRef<THREE.Group>(null)
  const cloud2Ref = useRef<THREE.Group>(null)
  const cloudGroupRef = useRef<THREE.Group>(null)
  const wordsRef = useRef<THREE.Group>(null)

  const angle = 75 * (Math.PI / 180)

  const getXYPos = (distance: number) => {
    const x = distance * Math.cos(angle)
    const y = distance * Math.sin(angle) * -1

    return {x, y}
  }

  useGSAP(() => {
    if(!groupRef.current || !canRef.current || !cloud1Ref.current || !cloud2Ref.current || !cloudGroupRef.current || !wordsRef.current) return

    gsap.set(cloudGroupRef.current.position, {z: 10})
    gsap.set(canRef.current.position, {...getXYPos(-4)})
    gsap.set(wordsRef.current.children.map((word) => word.position), {...getXYPos(7), z:4},)

    gsap.to(canRef.current.rotation, {y: Math.PI * 2, duration: 1.7, repeat: -1, ease: 'none'})

    const distance = 15;
    const duration = 6;

    gsap.set([cloud1Ref.current.position, cloud2Ref.current.position], {...getXYPos(distance)})

    gsap.to(cloud1Ref.current.position, {x: `+=${getXYPos(distance * -2).x}`, y: `+=${getXYPos(distance * -2).y}`, duration: duration, repeat: -1, ease: 'none'})
    gsap.to(cloud2Ref.current.position, {x: `+=${getXYPos(distance * -2).x}`, y: `+=${getXYPos(distance * -2).y}`, duration: duration, repeat: -1, ease: 'none', delay: duration / 2})

    const scrolltimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".skydive",
        pin: true,
        start: 'top top',
        end: `+=${sentence ? sentence?.split(' ').length * 700 : 2800}`,
        scrub: true
      }
    })

    scrolltimeline
      .to("body", {backgroundColor: "#C0F0F5", overwrite: 'auto', duration: 0.1})
      .to(cloudGroupRef.current.position, {z: 0, duration: 0.3}, 0)
      .to(canRef.current.position, {x: 0, y: 0, duration: 0.3, ease:"back.out(1.7)"}, 0)
      .to(wordsRef.current.children.map((word) => word.position), {
        keyframes: [
          {x:0, y:0, z:-1},
          {...getXYPos(-7), z:-7},
        ], 
        stagger: .4
      }, 0)
      .to(canRef.current.position, {...getXYPos(4), duration: 0.5, ease:"back.in(1.7)"})
      .to(cloudGroupRef.current.position, {z: 7, duration: 0.5})
  })

  return (
    <group ref={groupRef}>
      <group rotation={[0, 0, 0.5]}>
        <FloatingCan ref={canRef} rotationIntensity={.3} floatIntensity={3} floatSpeed={3} flavor={flavor} floatingRange={[-.07, .07]}>
          <pointLight intensity={30} color="#8C0413" decay={0.6} />
        </FloatingCan>
      </group>

      <Clouds ref={cloudGroupRef}>
        <Cloud ref={cloud1Ref} bounds={[10, 10, 2]} />

        <Cloud ref={cloud2Ref} bounds={[10, 10, 2]} />
      </Clouds>

      <group ref={wordsRef}>
        <Threetext sentence={sentence || ''} color="#F97315" />
      </group>

      <ambientLight intensity={4} color="#9DDEFA" />
      <Environment files="/hdr/field.hdr" environmentIntensity={1.5} />
    </group>
  )
}
export default Scene