"use client"

import FloatingCan from "@/components/FloatingCan"
import { Environment } from "@react-three/drei"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import gsap from "gsap"
import { useGSAP } from "@gsap/react" 
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMediaQuery } from "@/hooks/useMediaQuery"

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Props = {}
const Scene = (props: Props) => {
  const canGroupRef = useRef<THREE.Group>(null)
  const bgcolors = ["#FFA6B5", "#E9CFF6", "#CBEF9A"]
  const isDesktop = useMediaQuery('(min-width: 768px)', true)

  useGSAP(() => {
    if (!canGroupRef.current) return

    const sections = gsap.utils.toArray(".alternating-section")

    const scrollTimeline = gsap.timeline({
      scrollTrigger:{
        trigger: ".alternating-text-view",
        start: "top top",
        end: "bottom bottom",
        endTrigger: ".alternating-text-container",
        pin: true,
        scrub: true
      }
    })

    sections.forEach((_section, i) => {
      if(!canGroupRef.current) return
      if(i === 0) return

      const isOdd = i % 2 === 1;
      const moveByX = isDesktop ? (isOdd ? "-1" : "1") : 0
      const rotateY = isDesktop ? (isOdd ? ".4" : "-.4") : 0

      scrollTimeline
        .to(canGroupRef.current.position, {x: moveByX, ease: "circ.inOut", delay: 0.5})
        .to(canGroupRef.current.rotation, {y: rotateY, ease: "back.inOut"}, "<")
        .to(".alternating-text-container", {backgroundColor: gsap.utils.wrap(bgcolors, i), })
    })
  }, {dependencies: [isDesktop]})

  return (
    <group ref={canGroupRef} position-x={isDesktop? 1 : 0} rotation-y={isDesktop ? -0.3 : 0}>
      <FloatingCan flavor="strawberryLemonade"floatingRange={[-.2, .2]} floatSpeed={1.5} rotationIntensity={2} floatIntensity={1}/>
      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5}/>
    </group>
  )
}
export default Scene