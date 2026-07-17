/** Extracts the video ID from a youtube.com/watch or youtu.be URL. */
export function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
  return match ? match[1] : null;
}
