# 3D Spline Component Integration Guide

## Overview

We've successfully integrated a 3D component into the Mini-RAG application using Spline, a design tool for creating and publishing interactive 3D web experiences. The component is displayed on the Q&A page when no project is selected, providing a visually engaging experience for users.

## Components Created

### 1. `splite.tsx`

This component serves as the wrapper for rendering 3D Spline scenes in our React application.

```tsx
// frontend/src/components/ui/splite.tsx
import React, { useRef } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineProps) {
  const splineRef = useRef(null);

  return (
    <div className={`w-full h-[300px] ${className || ''}`}>
      <Spline 
        scene={scene} 
        ref={splineRef}
      />
    </div>
  );
}
```

### 2. `spotlight.tsx`

A visual effect component that creates a dynamic spotlight effect behind elements.

```tsx
// frontend/src/components/ui/spotlight.tsx
import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
}

export function Spotlight({
  children,
  className = "",
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = 
        containerRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
      
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      mouseX.current = x / width;
      mouseY.current = y / height;
      
      if (containerRef.current) {
        containerRef.current.style.setProperty("--mouse-x", mouseX.current.toString());
        containerRef.current.style.setProperty("--mouse-y", mouseY.current.toString());
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      containerRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden rounded-md bg-background",
        className
      )}
      style={{
        "--mouse-x": mouseX.current.toString(),
        "--mouse-y": mouseY.current.toString(),
      } as React.CSSProperties}
    >
      <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="bg-spotlight pointer-events-none absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 dark:via-accent/5" />
      {children}
    </div>
  );
}
```

### 3. `card.tsx`

A container component for showcasing 3D content.

```tsx
// Update to frontend/src/components/ui/card.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// ... existing card components

const CardSpotlight = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "group relative w-full rounded-lg border p-2 shadow-md transition-all hover:shadow-xl",
      className
    )}
    {...props}
  />
));
CardSpotlight.displayName = "CardSpotlight";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardSpotlight };
```

### 4. `demo.tsx`

A showcase component that combines the above components for a unified 3D experience.

```tsx
// frontend/src/components/ui/demo.tsx
import React from "react";
import { SplineScene } from "./splite";
import { Spotlight } from "./spotlight";
import { CardSpotlight } from "./card";

export function SplineSceneBasic() {
  // Replace with your actual Spline scene URL
  const splineSceneUrl = "https://prod.spline.design/your-scene-id";
  
  return (
    <div className="w-full max-w-lg mx-auto">
      <CardSpotlight className="p-4">
        <Spotlight className="rounded-xl">
          <SplineScene scene={splineSceneUrl} />
        </Spotlight>
      </CardSpotlight>
    </div>
  );
}
```

## Integration in QAPage.tsx

The 3D component is integrated into the Q&A page to display when no project is selected:

```tsx
// In QAPage.tsx
import { SplineSceneBasic } from '../components/ui/demo';

// ... existing code

{messages.length === 0 ? (
  <div className="flex flex-col items-center justify-center h-full text-center">
    {!selectedProject ? (
      <>
        <SplineSceneBasic />
        <AlertCircle className="h-12 w-12 text-destructive mb-4 mt-4" />
        <h3 className="text-xl font-semibold">No Project Selected</h3>
        <p className="text-muted-foreground">Please select a project from the header to start a conversation.</p>
      </>
    ) : (
      <>
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold">Ready to Answer</h3>
        <p className="text-muted-foreground">Ask a question about the documents in Project {selectedProject}.</p>
      </>
    )}
  </div>
) : (
  messages.map((msg, index) => <Message key={index} message={msg} />)
)}
```

## Dependencies

The following dependencies were added to support the 3D component:

```bash
npm install @splinetool/runtime @splinetool/react-spline framer-motion
```

## Customizing the 3D Scene

1. Create a Spline account at [spline.design](https://spline.design/)
2. Design your 3D scene in the Spline editor
3. Export and publish your scene
4. Replace the `splineSceneUrl` in `demo.tsx` with your published scene URL

## Performance Considerations

1. 3D components can be resource-intensive; consider lazy loading:
   ```tsx
   import React, { lazy, Suspense } from 'react';
   const SplineSceneBasic = lazy(() => import('../components/ui/demo').then(mod => ({ 
     default: mod.SplineSceneBasic 
   })));
   
   // Then use with Suspense
   <Suspense fallback={<div>Loading 3D scene...</div>}>
     <SplineSceneBasic />
   </Suspense>
   ```

2. Provide fallbacks for devices that might struggle with 3D rendering

3. Consider device capabilities and implement responsive behaviors

## Mobile Optimization

1. Adjust the height for mobile devices:
   ```tsx
   <SplineScene 
     scene={splineSceneUrl} 
     className="h-[200px] md:h-[300px]"
   />
   ```

2. Implement touch events for mobile interaction:
   ```tsx
   // Add touch event handlers to Spotlight component
   const handleTouchMove = (e: TouchEvent) => {
     if (e.touches.length > 0) {
       const touch = e.touches[0];
       // Similar handling as mouse move
     }
   };
   
   containerRef.current.addEventListener("touchmove", handleTouchMove);
   ```

## Future Enhancements

1. Dynamic 3D scenes that respond to user queries
2. Interactive elements that users can manipulate
3. Data visualization in 3D space based on document embeddings
4. Theme-based 3D elements that change with light/dark mode 