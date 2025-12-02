/**
 * Converts duration from seconds to a human-readable format
 * @param seconds - Duration in seconds
 * @returns Formatted string like "2:30" (mm:ss) or "1:05:30" (h:mm:ss)
 */
const formatDuration = (seconds: number): string => {
  if (!seconds || seconds < 0) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  // Format: h:mm:ss if hours exist, otherwise mm:ss
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export default formatDuration;
