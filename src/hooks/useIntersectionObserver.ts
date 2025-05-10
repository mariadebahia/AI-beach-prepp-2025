import { useEffect, useRef, RefObject } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  onIntersect?: () => void;
}

export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '0px',
  onIntersect
}: UseIntersectionObserverProps = {}): RefObject<HTMLDivElement> => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
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
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, onIntersect]);

  return elementRef;
}