import { useEffect, useRef, useState } from "react";

export const useVideoViewTracker = ({
  videoId,
  videoRef,
  enabled = true,
}: UseVideoViewTrackerProps) => {
  const [viewCounted, setViewCounted] = useState(false);
  const watchTimeRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasTriggeredRef = useRef(false);

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

          // Check if we should send the view count (after 3 seconds minimum)
          if (watchTimeRef.current >= 3 && !hasTriggeredRef.current) {
            sendViewCount();
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

    const sendViewCount = async () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;

      try {
        const response = await fetch(`/api/v1/videos/view/${videoId}`, {
          method: "POST",
          body: JSON.stringify({ watchTime: watchTimeRef.current }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data?.data?.counted) {
          setViewCounted(true);
          console.log("✅ View counted successfully");
        } else {
          console.log("ℹ️ View not counted:", data?.data?.reason);
        }
      } catch (error) {
        console.error("❌ Failed to count view:", error);
        hasTriggeredRef.current = false; // Allow retry
      }
    };

    // Event listeners
    const handlePlay = () => startTracking();
    const handlePause = () => stopTracking();
    const handleEnded = () => {
      stopTracking();
      if (!hasTriggeredRef.current) {
        sendViewCount();
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
  }, [videoId, videoRef, enabled]);

  return { viewCounted, watchTime: watchTimeRef.current };
};

interface UseVideoViewTrackerProps {
  videoId: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  enabled?: boolean; // Allow disabling the tracker
}
