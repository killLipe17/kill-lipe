function durationToSeconds(duration: string) {
  const match = duration.match(
    /P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  );

  if (!match) return 0;

  const days = Number(match[1] ?? 0);
  const hours = Number(match[2] ?? 0);
  const minutes = Number(match[3] ?? 0);
  const seconds = Number(match[4] ?? 0);

  return (
    days * 86400 +
    hours * 3600 +
    minutes * 60 +
    seconds
  );
}

export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "YOUTUBE_API_KEY não configurada." },
        { status: 500 }
      );
    }

    // 1. Descobre a playlist oficial de uploads do canal
    const channelUrl = new URL(
      "https://www.googleapis.com/youtube/v3/channels"
    );

    channelUrl.searchParams.set("part", "contentDetails");
    channelUrl.searchParams.set("forHandle", "@killlipe_");
    channelUrl.searchParams.set("key", apiKey);

    const channelResponse = await fetch(channelUrl.toString(), {
      next: { revalidate: 3600 },
    });

    if (!channelResponse.ok) {
      return Response.json(
        { error: "Não foi possível consultar o canal." },
        { status: channelResponse.status }
      );
    }

    const channelData = await channelResponse.json();

    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      return Response.json(
        { error: "Playlist de uploads não encontrada." },
        { status: 404 }
      );
    }

    // 2. Busca vários uploads recentes.
    // Precisamos de mais que 4 porque alguns podem ser Shorts.
    const playlistUrl = new URL(
      "https://www.googleapis.com/youtube/v3/playlistItems"
    );

    playlistUrl.searchParams.set("part", "snippet,contentDetails");
    playlistUrl.searchParams.set("playlistId", uploadsPlaylistId);
    playlistUrl.searchParams.set("maxResults", "50");
    playlistUrl.searchParams.set("key", apiKey);

    const playlistResponse = await fetch(playlistUrl.toString(), {
      next: { revalidate: 3600 },
    });

    if (!playlistResponse.ok) {
      return Response.json(
        { error: "Não foi possível consultar os uploads." },
        { status: playlistResponse.status }
      );
    }

    const playlistData = await playlistResponse.json();

    const uploadItems = playlistData.items ?? [];

    const videoIds = uploadItems
      .map(
        (item: {
          contentDetails?: {
            videoId?: string;
          };
        }) => item.contentDetails?.videoId
      )
      .filter(Boolean);

    if (videoIds.length === 0) {
      return Response.json({ videos: [] });
    }

    // 3. Consulta a duração dos vídeos
    const videosUrl = new URL(
      "https://www.googleapis.com/youtube/v3/videos"
    );

    videosUrl.searchParams.set("part", "contentDetails");
    videosUrl.searchParams.set("id", videoIds.join(","));
    videosUrl.searchParams.set("key", apiKey);

    const videosResponse = await fetch(videosUrl.toString(), {
      next: { revalidate: 3600 },
    });

    if (!videosResponse.ok) {
      return Response.json(
        { error: "Não foi possível consultar a duração dos vídeos." },
        { status: videosResponse.status }
      );
    }

    const videosData = await videosResponse.json();

    const durations = new Map<string, number>();

    for (const video of videosData.items ?? []) {
      durations.set(
        video.id,
        durationToSeconds(video.contentDetails?.duration ?? "")
      );
    }

    // 4. Remove Shorts (até 3 minutos)
    // e mantém somente os 4 vídeos longos mais recentes
    const videos = uploadItems
      .filter(
        (item: {
          contentDetails?: {
            videoId?: string;
          };
        }) => {
          const videoId = item.contentDetails?.videoId;

          if (!videoId) return false;

          const duration = durations.get(videoId) ?? 0;

          return duration > 180;
        }
      )
      .slice(0, 4)
      .map(
        (item: {
          snippet: {
            title: string;
            description: string;
            publishedAt: string;
            thumbnails?: {
              maxres?: { url: string };
              standard?: { url: string };
              high?: { url: string };
              medium?: { url: string };
            };
          };
          contentDetails: {
            videoId: string;
          };
        }) => {
          const videoId = item.contentDetails.videoId;

          return {
            id: videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt,
            durationSeconds: durations.get(videoId),
            thumbnail:
              item.snippet.thumbnails?.maxres?.url ??
              item.snippet.thumbnails?.standard?.url ??
              item.snippet.thumbnails?.high?.url ??
              item.snippet.thumbnails?.medium?.url ??
              `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
          };
        }
      );

    return Response.json({ videos });
  } catch (error) {
    console.error("YouTube videos error:", error);

    return Response.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}