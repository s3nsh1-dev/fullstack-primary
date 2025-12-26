import { useEffect, useRef } from "react";

const useIntersectionObserver = (
  fetchNextPage: () => void,
  hasNextPage: boolean
) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observerAPI = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observerAPI.observe(element);

    return () => {
      if (element) observerAPI.unobserve(element);
    };
  }, [fetchNextPage, hasNextPage]);

  return observerTarget;
};

export default useIntersectionObserver;
