"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const MacbookScroll = ({
  src,
  showGradient = true,
  title,
  badge,
}: {
  src: string;
  showGradient?: boolean;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scaleX = useTransform(
    scrollYProgress,
    [0, 0.3],
    [1.2, isMobile ? 1 : 1.5]
  );
  const scaleY = useTransform(
    scrollYProgress,
    [0, 0.3],
    [0.6, isMobile ? 1 : 1.5]
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
  const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div
      ref={ref}
      className="flex min-h-[200vh] shrink-0 scale-[0.35] transform flex-col items-center justify-start py-0 [perspective:800px] sm:scale-50 md:scale-100 md:py-56"
    >
      <motion.h2
        style={{ translateY: textTransform, opacity: textOpacity }}
        className="mb-20 text-center text-3xl font-bold text-[#0f1c17] md:text-5xl"
      >
        {title || (
          <span>
            Your whole creative brain, <br /> in one place.
          </span>
        )}
      </motion.h2>
      {/* Lid */}
      <Lid
        src={src}
        scaleX={scaleX}
        scaleY={scaleY}
        rotate={rotate}
        translate={translate}
      />
      {/* Base area */}
      <div className="relative -z-10 h-[22rem] w-[32rem] overflow-hidden rounded-2xl bg-[#e7ede9]">
        {/* above keyboard bar */}
        <div className="relative h-10 w-full">
          <div className="absolute inset-x-0 mx-auto h-4 w-[80%] bg-[#0f1c17]" />
        </div>
        <div className="relative flex">
          <div className="mx-auto h-full w-[10%] overflow-hidden">
            <SpeakerGrid />
          </div>
          <div className="mx-auto h-full w-[80%]">
            <Keypad />
          </div>
          <div className="mx-auto h-full w-[10%] overflow-hidden">
            <SpeakerGrid />
          </div>
        </div>
        <Trackpad />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tl-3xl rounded-tr-3xl bg-gradient-to-t from-[#0f1c17] to-[#3a463f]" />
        {showGradient && (
          <div className="absolute inset-x-0 bottom-0 z-50 h-40 w-full bg-gradient-to-t from-[#fafdfb] via-[#fafdfb] to-transparent" />
        )}
        {badge && <div className="absolute bottom-4 left-4">{badge}</div>}
      </div>
    </div>
  );
};

export const Lid = ({
  scaleX,
  scaleY,
  rotate,
  translate,
  src,
}: {
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  rotate: MotionValue<number>;
  translate: MotionValue<number>;
  src: string;
}) => {
  return (
    <div className="relative [perspective:800px]">
      <div
        style={{
          transform: "perspective(800px) rotateX(-25deg) translateZ(0px)",
          transformOrigin: "bottom",
          transformStyle: "preserve-3d",
        }}
        className="relative h-[12rem] w-[32rem] rounded-2xl bg-[#0f1c17] p-2"
      >
        <div
          style={{
            boxShadow: "0px 2px 0px 2px #171e1a inset",
          }}
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#0f1c17]"
        >
          <span className="text-white/60">
            <ClarityLogoMark />
          </span>
        </div>
      </div>
      <motion.div
        style={{
          scaleX,
          scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: "preserve-3d",
          transformOrigin: "top",
        }}
        className="absolute inset-0 h-96 w-[32rem] rounded-2xl bg-[#0f1c17] p-2"
      >
        <div className="absolute inset-0 rounded-lg bg-[#171e1a]" />
        <Image
          src={src}
          alt="Clarity dashboard preview"
          fill
          className="absolute inset-0 h-full w-full rounded-lg object-cover object-top-left"
          priority
        />
      </motion.div>
    </div>
  );
};

export const Trackpad = () => {
  return (
    <div
      className="mx-auto my-1 h-32 w-[40%] rounded-xl"
      style={{
        boxShadow: "0px 0px 1px 1px rgba(15,28,23,0.15) inset",
      }}
    />
  );
};

export const Keypad = () => {
  return (
    <div className="mx-1 h-full rounded-md bg-[#050807] p-1">
      {/* Simplified visual keyboard rows */}
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        {Array.from({ length: 13 }).map((_, i) => (
          <KBtn key={"row1-" + i} className="w-6 items-end justify-start pb-[2px] pl-[4px]" />
        ))}
      </div>
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        {Array.from({ length: 13 }).map((_, i) => (
          <KBtn key={"row2-" + i} />
        ))}
      </div>
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        {Array.from({ length: 13 }).map((_, i) => (
          <KBtn key={"row3-" + i} />
        ))}
      </div>
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        {Array.from({ length: 13 }).map((_, i) => (
          <KBtn key={"row4-" + i} />
        ))}
      </div>
      <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">
        {Array.from({ length: 13 }).map((_, i) => (
          <KBtn key={"row5-" + i} />
        ))}
      </div>
    </div>
  );
};

export const KBtn = ({ className }: { className?: string }) => {
  return (
    <div className="rounded-[4px] p-[0.5px]" style={{ boxShadow: "0px -0.5px 2px 0 #0d1210 inset, -0.5px 0px 2px 0 #0d1210 inset" }}>
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-[3.5px] bg-[#0a0f0d]",
          className
        )}
        style={{
          boxShadow: "0px -0.5px 2px 0 #0a0f0d inset, -0.5px 0px 2px 0 #0a0f0d inset",
        }}
      />
    </div>
  );
};

export const SpeakerGrid = () => {
  return (
    <div
      className="mt-2 flex h-40 gap-[2px] px-[0.5px]"
      style={{
        backgroundImage:
          "radial-gradient(circle, #0f1c17 0.5px, transparent 0.5px)",
        backgroundSize: "3px 3px",
      }}
    />
  );
};

const ClarityLogoMark = () => (
  <span className="flex items-center gap-2 text-sm font-bold tracking-tight text-white/70">
    <span
      className="bg-clip-text text-transparent"
      style={{ backgroundImage: "linear-gradient(135deg,#10b981,#059669)" }}
    >
      ✦
    </span>
    Clarity
  </span>
);
