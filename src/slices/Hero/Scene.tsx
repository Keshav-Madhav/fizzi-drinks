"use client"

import FloatingCan from "@/components/FloatingCan"
import { Environment } from "@react-three/drei"
import { useRef } from "react"
import { Group } from "three"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useStore } from "@/hooks/useStore";

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Props = {}
const Scene = (props: Props) => {
  const { isReady } = useStore();

  const can1Ref = useRef<Group>(null)
  const can2Ref = useRef<Group>(null)
  const can3Ref = useRef<Group>(null)
  const can4Ref = useRef<Group>(null)
  const can5Ref = useRef<Group>(null)

  const can1GroupRef = useRef<Group>(null)
  const can2GroupRef = useRef<Group>(null)

  const groupRef = useRef<Group>(null)

  const floatSpeed = 1.5

  useGSAP(()=>{
    if( !can1Ref.current || !can2Ref.current || !can1GroupRef.current || !can2GroupRef.current || !groupRef.current || !can3Ref.current || !can4Ref.current || !can5Ref.current ) return

    isReady();

    gsap.set(can1Ref.current.position, {x: -1.35})
    gsap.set(can1Ref.current.rotation, {z: -0.4})

    gsap.set(can2Ref.current.position, {x: 1.4})
    gsap.set(can2Ref.current.rotation, {z: 0.35})

    gsap.set(can3Ref.current.position, {y: 5, z: 2})
    gsap.set(can4Ref.current.position, {x: 2, y: 4, z: 2})
    gsap.set(can5Ref.current.position, {y: -5})

    const introTimeLine = gsap.timeline({
      defaults:{
        duration: 3,
        ease: "back.inOut(1.4)"
      }
    })


    if(window.scrollY < 20){
      introTimeLine
        .from(can1GroupRef.current.position, {x: 1, y: -5}, 0)
        .from(can1GroupRef.current.rotation, {z: 3}, 0)
  
        .from(can2GroupRef.current.position, {x: 1, y: 5}, 0)
        .from(can2GroupRef.current.rotation, {z: 3}, 0)
    }

    const scrollTimeline = gsap.timeline({
      defaults:{
        duration: 2,
      }, 
      scrollTrigger:{
        trigger: ".hero",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      }
    })

    scrollTimeline
      .to(groupRef.current.rotation, { y: Math.PI * 2 })

      .to(can1Ref.current.position, { x: -.2, y: -1, z: -1.7 }, 0)
      .to(can1Ref.current.rotation, { z: 0.3, x: -.3 }, 0)

      .to(can2Ref.current.position, { x: 1.2, y: -0.2, z: -1 }, 0)
      .to(can2Ref.current.rotation, { z: 0 }, 0)

      .to(can3Ref.current.position, { x: -0.5, y: 0.5, z: -1 }, 0)
      .to(can3Ref.current.rotation, { z: -0.1 }, 0)

      .to(can4Ref.current.position, { x: 0, y: -0.3, z: 0.5 }, 0)
      .to(can4Ref.current.rotation, { z: 0.3 }, 0)

      .to(can5Ref.current.position, { x: 0.3, y: 0.6, z: -0.5 }, 0)
      .to(can5Ref.current.rotation, { z: -0.25 }, 0)

      .to(groupRef.current.position, { x: 1, duration:3, ease: 'sine.inOut' }, 1.3)
  })

  return (
    <group ref={groupRef}>
      <group ref={can1GroupRef}>
        <FloatingCan
          ref={can1Ref}
          flavor="blackCherry"
          floatSpeed={floatSpeed}
        />
      </group>

      <group ref={can2GroupRef}>
        <FloatingCan
          ref={can2Ref}
          flavor="grape"
          floatSpeed={floatSpeed}
        />
      </group>

      <FloatingCan
        ref={can3Ref}
        flavor="lemonLime"
        floatSpeed={floatSpeed}
      />

      <FloatingCan
        ref={can4Ref}
        flavor="watermelon"
        floatSpeed={floatSpeed}
      />

      <FloatingCan
        ref={can5Ref}
        flavor="strawberryLemonade"
        floatSpeed={floatSpeed}
      />

      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5}/>
    </group>
  )
}
export default Scene