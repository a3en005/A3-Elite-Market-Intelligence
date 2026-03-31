import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface BrandLabelProps {
  text?: string;
  className?: string;
}

const BrandLabel: React.FC<BrandLabelProps> = ({ 
  text = "A3 Elite Intelligence", 
  className = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll('.word');
    if (!words || words.length === 0) return;
    
    gsap.fromTo(words, 
      { 
        y: -100, 
        opacity: 0,
        rotateX: -90
      },
      { 
        y: 0, 
        opacity: 1, 
        rotateX: 0,
        duration: 1.2, 
        stagger: 0.1, 
        ease: "elastic.out(1, 0.5)",
        onComplete: () => {
          // Subtle float animation after landing
          gsap.to(words, {
            y: "-=5",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: {
              each: 0.1,
              from: "center"
            }
          });
        }
      }
    );
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`flex items-center gap-2 perspective-1000 ${className}`}
    >
      {text.split(' ').map((word, i) => (
        <span 
          key={i} 
          className="word inline-block font-display text-inherit tracking-tighter uppercase"
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default BrandLabel;
