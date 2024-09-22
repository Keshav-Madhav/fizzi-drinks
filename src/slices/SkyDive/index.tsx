"use client"

import { Bounded } from "@/components/Bounded";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Scene from "./Scene";
import { View } from "@react-three/drei";

/**
 * Props for `SkyDive`.
 */
export type SkyDiveProps = SliceComponentProps<Content.SkyDiveSlice>;

/**
 * Component for "SkyDive" Slices.
 */
const SkyDive = ({ slice }: SkyDiveProps): JSX.Element => {
  return (
    <Bounded
      className="skydive h-screen"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <h2 className="sr-only">{slice.primary.sentence}</h2>

      <View className="h-screen w-screen">
        <Scene 
          sentence={slice.primary.sentence}
          flavor={slice.primary.flavor}
        />
      </View>
    </Bounded>
  );
};

export default SkyDive;
