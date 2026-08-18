// ---------------------------------------------------------------------------
// YouTube — latest upload for the Malayaan Photography channel.
// ---------------------------------------------------------------------------
// Runs SERVER-SIDE only. Two strategies, tried in order:
//   1. The official Data API v3 — used automatically when YOUTUBE_API_KEY is set
//      (higher reliability / quota; the documented channels + playlistItems flow).
//   2. The channel's PUBLIC uploads RSS feed — needs NO key, so the latest video
//      plays out of the box with zero setup.
// Either way, results are cached in Next's data cache so a new upload appears
// automatically (within the revalidate window) with no code change or redeploy.
// ---------------------------------------------------------------------------

export const YT_CHANNEL_ID = "UCtyh3OeBUf0HTRNtU2kIUeg";
export const YT_CHANNEL_URL = "https://www.youtube.com/@MalayanPhotography";

export type LatestVideo = {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
};

const UPLOADS_REVALIDATE = 60 * 60 * 24; // 24h — uploads-playlist id is permanent
const LATEST_REVALIDATE = 60 * 5; //          5m — a new upload appears within ~5 min


function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#39;|&apos;/g, "'");
}

// maxres isn't guaranteed for every video; the client falls back to hqdefault.
function thumbFor(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

/** Keyless: the channel's public uploads RSS feed. First entry = newest upload. */
async function getLatestViaRss(): Promise<LatestVideo | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`,
      { next: { revalidate: LATEST_REVALIDATE } }
    );
    if (!res.ok) return null;
    const xml = await res.text();

    const entry = xml.split("<entry>")[1];
    if (!entry) return null;

    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    if (!videoId) return null;

    const title = decodeEntities(entry.match(/<title>([^<]*)<\/title>/)?.[1] ?? "Latest Video");
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";

    return { videoId, title, thumbnail: thumbFor(videoId), publishedAt };
  } catch {
    return null;
  }
}

/** Official Data API v3 — used only when YOUTUBE_API_KEY is configured. */
async function getLatestViaApi(): Promise<LatestVideo | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;

  try {
    // Step 1 — resolve the channel's "uploads" playlist.
    const chRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YT_CHANNEL_ID}&key=${key}`,
      { next: { revalidate: UPLOADS_REVALIDATE } }
    );
    if (!chRes.ok) return null;
    const chData = await chRes.json();
    const uploads: string | undefined =
      chData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploads) return null;

    // Step 2 — the first item of the uploads playlist is the newest upload.
    const plRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=1&playlistId=${uploads}&key=${key}`,
      { next: { revalidate: LATEST_REVALIDATE } }
    );
    if (!plRes.ok) return null;
    const plData = await plRes.json();
    const item = plData?.items?.[0];
    if (!item) return null;

    const videoId: string | undefined =
      item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId;
    if (!videoId) return null;

    const snippet = item.snippet ?? {};
    return {
      videoId,
      title: snippet.title ?? "Latest Video",
      thumbnail: thumbFor(videoId),
      publishedAt: item.contentDetails?.videoPublishedAt ?? snippet.publishedAt ?? "",
    };
  } catch {
    return null;
  }
}

/** Returns the channel's most recent public upload, or null on any failure. */
export async function getLatestVideo(): Promise<LatestVideo | null> {
  return (await getLatestViaApi()) ?? (await getLatestViaRss());
}
