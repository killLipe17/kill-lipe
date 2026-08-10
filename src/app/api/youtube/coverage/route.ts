type Coverage = {
  key: string;
  title: string;
  kind: "playlist" | "video";
  youtubeId: string;
};

const coverages: Coverage[] = [
  {
    key: "beast-of-reincarnation",
    title: "Beast of Reincarnation",
    kind: "playlist",
    youtubeId: "PLYNOEBEkrN8I",
  },
  {
    key: "atomic-heart",
    title: "Atomic Heart",
    kind: "playlist",
    youtubeId: "PLUcsTZleRG3o",
  },
  {
    key: "assassins-creed-black-flag-resynced",
    title: "Assassin’s Creed Black Flag Resynced",
    kind: "playlist",
    youtubeId: "PL6ew14P2i0aZp_9g2XAGQq5sDm3sPW-iJ",
  },
  {
    key: "peter-jackson-king-kong",
    title: "Peter Jackson’s King Kong",
    kind: "playlist",
    youtubeId: "PLMH2PtATjAPw",
  },
  {
    key: "halo-campaign-evolved",
    title: "Halo: Campaign Evolved",
    kind: "playlist",
    youtubeId: "PL6ew14P2i0aYAyTHcsGePd_XVlEpaiFKf",
  },
  {
    key: "mouse-pi-for-hire",
    title: "Mouse: P.I. For Hire",
    kind: "playlist",
    youtubeId: "PL6ew14P2i0aZJKD204L27Gfk7Cu_R6cdF",
  },
  {
    key: "prince-of-persia-the-lost-crown",
    title: "Prince of Persia: The Lost Crown",
    kind: "playlist",
    youtubeId: "PL6ew14P2i0aYdqOxJRDTWrOeeVyjOOYFk",
  },
  {
    key: "lego-batman-legacy-of-the-dark-knight",
    title: "LEGO Batman: Legacy of the Dark Knight",
    kind: "video",
    youtubeId: "Ltg5Y7zJoxA",
  },
  {
    key: "stray",
    title: "Stray",
    kind: "video",
    youtubeId: "fTVz93WCXYw",
  },
  {
    key: "star-wars-jedi-survivor",
    title: "Star Wars Jedi: Survivor",
    kind: "video",
    youtubeId: "0hIV9DLbd2w",
  },
];

async function getPlaylistVideoIds(
  playlistId: string,
  apiKey: string
): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(
      "https://www.googleapis.com/youtube/v3/playlistItems"
    );

    url.searchParams.set("part", "contentDetails");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", apiKey);

    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Erro ao consultar playlist ${playlistId}`);
    }

    const data = await response.json();

    for (const item of data.items ?? []) {
      const videoId = item.contentDetails?.videoId;

      if (videoId) {
        ids.push(videoId);
      }
    }

    pageToken = data.nextPageToken;
  } while (pageToken);

  return ids;
}

async function getVideoViews(
  videoIds: string[],
  apiKey: string
): Promise<Map<string, number>> {
  const views = new Map<string, number>();

  for (let index = 0; index < videoIds.length; index += 50) {
    const batch = videoIds.slice(index, index + 50);

    const url = new URL(
      "https://www.googleapis.com/youtube/v3/videos"
    );

    url.searchParams.set("part", "statistics");
    url.searchParams.set("id", batch.join(","));
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Erro ao consultar estatísticas dos vídeos.");
    }

    const data = await response.json();

    for (const video of data.items ?? []) {
      views.set(
        video.id,
        Number(video.statistics?.viewCount ?? 0)
      );
    }
  }

  return views;
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

    const coverageVideoIds = await Promise.all(
      coverages.map(async (coverage) => {
        if (coverage.kind === "video") {
          return {
            coverage,
            videoIds: [coverage.youtubeId],
          };
        }

        const videoIds = await getPlaylistVideoIds(
          coverage.youtubeId,
          apiKey
        );

        return {
          coverage,
          videoIds,
        };
      })
    );

    const allVideoIds = [
      ...new Set(
        coverageVideoIds.flatMap((item) => item.videoIds)
      ),
    ];

    const viewsByVideo = await getVideoViews(
      allVideoIds,
      apiKey
    );

    const results = coverageVideoIds
      .map(({ coverage, videoIds }) => {
        const viewCount = videoIds.reduce(
          (total, videoId) =>
            total + (viewsByVideo.get(videoId) ?? 0),
          0
        );

        return {
          key: coverage.key,
          title: coverage.title,
          kind: coverage.kind,
          viewCount,
          videoCount: videoIds.length,
        };
      })
      .sort((a, b) => b.viewCount - a.viewCount);

    return Response.json({
      coverages: results,
    });
  } catch (error) {
    console.error("YouTube coverage error:", error);

    return Response.json(
      { error: "Não foi possível consultar as coberturas." },
      { status: 500 }
    );
  }
}