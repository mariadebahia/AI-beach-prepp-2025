import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-in-up' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right';
  delay?: '100' | '200' | '300' | '400';
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fade-in-up',
  delay
}) => {
  const ref = useIntersectionObserver({
    className: animation
  });

  return (
    <div
      ref={ref}
      className={`${delay ? `delay-${delay}` : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;