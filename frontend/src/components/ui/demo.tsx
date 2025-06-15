'use client'

import { SplineScene } from "./splite";
import { Card } from "./card"
import { Spotlight } from "./spotlight"
 
export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden flex items-center justify-center">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <SplineScene 
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="absolute w-full h-full"
      />

      <div className="p-8 relative z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Mini-RAG: Your Personal AI Powerhouse
        </h1>
        <p className="mt-4 text-neutral-300 max-w-2xl">
          Engage in intelligent conversations with your documents. Upload your data and get instant, accurate answers powered by cutting-edge retrieval-augmented generation.
        </p>
      </div>
    </Card>
  )
} 