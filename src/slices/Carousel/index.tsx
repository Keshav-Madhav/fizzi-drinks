"use client"

import { ArrowIcon } from "@/components/ArrowIcon";
import FloatingCan from "@/components/FloatingCan";
import { SodaCanProps } from "@/components/SodaCan";
import { WavyCircles } from "@/components/WaveyCircles";
import { Content } from "@prismicio/client";
import { PrismicRichText, PrismicText, SliceComponentProps } from "@prismicio/react";
import { Center, Environment, View } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

const spins = 8;

const FLAVORS: {
  flavor: SodaCanProps["flavor"];
  color: string;
  name: string;
}[] = [
  { flavor: "blackCherry", color: "#710523", name: "Black Cherry" },
  { flavor: "grape", color: "#572981", name: "Grape Goodness" },
  { flavor: "lemonLime", color: "#164405", name: "Lemon Lime" },
  { flavor: "strawberryLemonade", color: "#690B3D", name: "Strawberry Lemonade" },
  { flavor: "watermelon", color: "#4B7002", name: "Watermelon Crush" },
];

/**
 * Props for `Carousel`.
 */
export type CarouselProps = SliceComponentProps<Content.CarouselSlice>;

/**
 * Component for "Carousel" Slices.
 */
const Carousel = ({ slice }: CarouselProps): JSX.Element => {
  const [currentFlavor, setCurrentFlavor] = useState(0);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  const canRef = useRef<THREE.Group>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  const handleFlavorChange = (direction: -1 | 1) => {
    if (!canRef.current) return;

    const index = direction === 1 ? (currentFlavor + 1) % FLAVORS.length : (currentFlavor - 1 + FLAVORS.length) % FLAVORS.length;

    const timeline = gsap.timeline();

    timeline
    .to(canRef.current.rotation, {
      y: `+=${spins * direction * Math.PI * 2}`,
      duration: 1,
      ease: "power2.inOut",
    }, 0)
    .to(".background, .wavy-circles-outer, .wavy-circles-inner", {
      backgroundColor: FLAVORS[index].color,
      fill: FLAVORS[index].color,
    }, 0)
    .to(".text-wrapper",{ duration: 0.5, x: -100 * direction, opacity: 0 }, 0)
    .to({}, {onStart: () => setCurrentFlavor(index)}, 0.5)
    .set(".text-wrapper", { x: 100 * direction }, 0.5)
    .to(".text-wrapper",{ duration: 0.5, x: 0, opacity: 1 }, 0.5);
  }

  const handlePointerDown = (event: React.PointerEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!isDragging.current || !canRef.current) return;

    const deltaMove = {
      x: event.clientX - previousMousePosition.current.x,
      y: event.clientY - previousMousePosition.current.y,
    };

    const rotationSpeed = 0.005;
    canRef.current.rotation.y += deltaMove.x * rotationSpeed;
    canRef.current.rotation.x += deltaMove.y * rotationSpeed;

    previousMousePosition.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const viewElement = viewRef.current;
    if (viewElement) {
      viewElement.addEventListener('pointerup', handlePointerUp);
      viewElement.addEventListener('pointerleave', handlePointerUp);
    }
    return () => {
      if (viewElement) {
        viewElement.removeEventListener('pointerup', handlePointerUp);
        viewElement.removeEventListener('pointerleave', handlePointerUp);
      }
    };
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="carousel relative grid h-screen grid-rows-[auto,4fr,auto] justify-center overflow-hidden bg-white py-12 text-white"
    >
      <div className="background pointer-events-none absolute inset-0 bg-[#710523] opacity-50"/>
      <WavyCircles className="absolute left-1/2 top-1/2 h-[120vmin] -translate-x-1/2 -translate-y-1/2 text-[#710523] pointer-events-none"/>

      <h2 className="relative text-center text-5xl font-bold">
        <PrismicText field={slice.primary.heading}/>
      </h2>

      <div className="grid grid-cols-[auto,auto,auto] items-center">
        <button
          onClick={() => handleFlavorChange(-1)}
          className="size-12 rounded-full border-2 border-white bg-white/10 p-3 opacity-85 ring-white focus:outline-none focus-visible:opacity-100 focus-visible:ring-4 md:size-1/6 lg:size-20 hover:scale-110"
        >
          <ArrowIcon className=""/>

          <span className="sr-only">Previous Flavor</span>
        </button>
        
        <div 
          ref={viewRef}
          className="aspect-square h-[70vmin] min-h-40"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          <View className="aspect-square h-[70vmin] min-h-40">
            <Center position={[0, 0, 1.5]}>
              <FloatingCan 
                floatIntensity={0.5} 
                rotationIntensity={1.2} 
                flavor={FLAVORS[currentFlavor].flavor} 
                ref={canRef} 
              />
            </Center>
            <Environment files="/hdr/lobby.hdr" environmentIntensity={0.6} environmentRotation={[0, 3, 0]} />
            <directionalLight intensity={6} position={[0,1,1]} />
          </View>
        </div>

        <button
          onClick={() => handleFlavorChange(1)}
          className="size-12 rounded-full border-2 border-white bg-white/10 p-3 opacity-85 ring-white focus:outline-none focus-visible:opacity-100 focus-visible:ring-4 md:size-1/6 lg:size-20 hover:scale-110"
        >
          <ArrowIcon className="-scale-x-100"/>

          <span className="sr-only">Next Flavor</span>
        </button>
      </div> 

      <div className="text-area relative mx-auto text-center ">
        <div className="text-wrapper text-4xl font-medium">
          <p>{FLAVORS[currentFlavor].name}</p>
        </div>
        
        <div className="mt-2 font-normal opacity-90">
          <PrismicRichText field={slice.primary.price_copy}/>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
