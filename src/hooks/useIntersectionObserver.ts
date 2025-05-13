import { useEffect, useRef, RefObject } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  onIntersect?: () => void;
  className?: string;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '0px',
  onIntersect,
  className = 'fade-in-up'
}: UseIntersectionObserverProps = {}): RefObject<HTMLDivElement> => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          onIntersect?.();
          observer.unobserve(entry.target); // Only animate once
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    const element = elementRef.current;
    if (element) {
      element.classList.add(className);
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, onIntersect, className]);

  return elementRef;
}