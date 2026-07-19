"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // The entrance animation
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          filter: "blur(10px)",
          scale: 0.98,
          y: 20,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          y: 0,
          duration: isFirstLoad ? 1.2 : 0.6,
          ease: "power3.out",
          onComplete: () => {
            setIsFirstLoad(false);
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [pathname, isFirstLoad]);

  return (
    <div ref={containerRef} className="will-change-transform flex-1 flex flex-col w-full h-full">
      {children}
    </div>
  );
}
