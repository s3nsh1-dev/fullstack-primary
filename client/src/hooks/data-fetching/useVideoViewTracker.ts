// hooks/useVideoViewTracker.ts
import { useEffect, useRef } from "react";
import { useIncrementView } from "./useIncrementView";

interface UseVideoViewTrackerProps {
  videoId: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  enabled?: boolean;
}

export const useVideoViewTracker = ({
  videoId,
  videoRef,
  enabled = true,
}: UseVideoViewTrackerProps) => {
  const watchTimeRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTriggeredRef = useRef(false);

  const { mutate: incrementView } = useIncrementView();

  useEffect(() => {
    if (!enabled || !videoRef.current || hasTriggeredRef.current) return;

    const video = videoRef.current;
    let isPlaying = false;

    // Track watch time
    const startTracking = () => {
      if (isPlaying) return;
      isPlaying = true;

      intervalRef.current = setInterval(() => {
        if (!video.paused && !video.ended) {
          watchTimeRef.current += 1;

          // Send view count after watching for at least 5 seconds
          if (watchTimeRef.current >= 5 && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            incrementView({
              videoId,
              watchTime: watchTimeRef.current,
            });
          }
        }
      }, 1000);
    };

    const stopTracking = () => {
      isPlaying = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // Event listeners
    const handlePlay = () => startTracking();
    const handlePause = () => stopTracking();
    const handleEnded = () => {
      stopTracking();
      // Send final watch time if not already sent
      if (!hasTriggeredRef.current && watchTimeRef.current >= 3) {
        hasTriggeredRef.current = true;
        incrementView({
          videoId,
          watchTime: watchTimeRef.current,
        });
      }
    };

    // Handle page visibility (stop tracking when tab is hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTracking();
      } else if (!video.paused) {
        startTracking();
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      stopTracking();
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [videoId, videoRef, enabled, incrementView]);

  return { watchTime: watchTimeRef.current };
};
