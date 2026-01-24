export const getSecureUrl = (url: string | undefined | null) => {
  if (!url) return "";
  return url.replace("http://", "https://");
};
