import React, { useEffect, useRef } from 'react';

type AnimatedHeaderProps = {
  text: string;
  className?: string;
};

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`opacity-0 transform translate-y-8 transition-all duration-700 ease-out ${className}`}
    >
      {text}
    </div>
  );
};

export default AnimatedHeader;