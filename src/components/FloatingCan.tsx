"use client"

import { forwardRef, ReactNode } from "react"
import { SodaCan, SodaCanProps } from "./SodaCan"
import { Float } from "@react-three/drei"
import { Group } from "three"

type FloatingCanProps = {
  flavor?: SodaCanProps["flavor"];
  floatSpeed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  floatingRange?: [number, number];
  children?: ReactNode;
}

const FloatingCan = forwardRef<Group, FloatingCanProps>(({ 
  flavor = "blackCherry",
  floatSpeed = 1.5,
  rotationIntensity = 2, 
  floatIntensity = 1,
  floatingRange = [-.15,.15],
  children,
  ...props
}, ref) => {
  return (
    <group 
      ref={ref}
      {...props}
    >
      <Float
        speed={floatSpeed}
        rotationIntensity={rotationIntensity}
        floatIntensity={floatIntensity}
        floatingRange={floatingRange}
      >
        {children}
        <SodaCan flavor={flavor}/>       
      </Float>
    </group>
  )
})
FloatingCan.displayName = "FloatingCan"

export default FloatingCan