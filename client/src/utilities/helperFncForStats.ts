export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

export const formatViews = (views: number) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

export const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const formatCount = (count: number): string => {
  if (count === 0) return "0";
  if (count < 1000) return count.toLocaleString();
  if (count < 1_000_000) {
    const thousands = count / 1000;
    return thousands < 10
      ? `${thousands.toFixed(1)}K`
      : `${Math.round(thousands)}K`;
  }
  if (count < 1_000_000_000) {
    const millions = count / 1_000_000;
    return millions < 10
      ? `${millions.toFixed(1)}M`
      : `${Math.round(millions)}M`;
  }
  const billions = count / 1_000_000_000;
  return billions < 10 ? `${billions.toFixed(1)}B` : `${Math.round(billions)}B`;
};
