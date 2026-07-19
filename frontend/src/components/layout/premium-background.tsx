"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function PremiumBackground() {
  const bgRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!bgRef.current) return;
    
    const shapes = bgRef.current.querySelectorAll('.floating-shape');
    
    shapes.forEach((shape, i) => {
      // Randomize movement
      gsap.to(shape, {
        x: () => Math.random() * 100 - 50,
        y: () => Math.random() * 100 - 50,
        rotation: () => Math.random() * 45 - 22.5,
        duration: () => 10 + Math.random() * 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * -2,
      });
    });
    
    // Fade in the background smoothly
    gsap.fromTo(bgRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 2, ease: "power2.out" }
    );
  }, []);

  return (
    <div 
      ref={bgRef}
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-surface-container-lowest"
    >
      {/* Soft Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Floating Gradient Shapes */}
      <div className="absolute inset-0 opacity-40 mix-blend-normal blur-3xl filter">
        <div className="floating-shape absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
        <div className="floating-shape absolute top-[20%] right-[-5%] w-[35%] h-[45%] rounded-full bg-tertiary/15 blur-[120px]" />
        <div className="floating-shape absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
    </div>
  );
}
