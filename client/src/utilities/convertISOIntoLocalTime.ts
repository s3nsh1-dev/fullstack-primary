export default function convertISOIntoLocalTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString(); // uses the user’s locale
}
