import { useEffect, useRef } from "react";

const useIntersectionObserver = (
  callback: () => void,
  hasNextPage: boolean
) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          callback();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [callback, hasNextPage]);

  return observerTarget;
};

export default useIntersectionObserver;
