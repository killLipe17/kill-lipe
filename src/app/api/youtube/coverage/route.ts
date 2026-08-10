type Coverage = {
  key: string;
  title: string;
  playlistId?: string;
  aliases: string[];
  excludeVideoIds?: string[];
};

type ChannelVideo = {
  id: string;
  title: string;
  viewCount: number;
};

const YOUTUBE_CHANNEL_HANDLE = "@killlipe_";
const CACHE_SECONDS = 21600; // 6 horas

const coverages: Coverage[] = [
  {
    key: "indiana-jones-and-the-great-circle",
    title: "Indiana Jones and the Great Circle",
    playlistId: "PL6ew14P2i0abELxD7MCTd9X81iZ-4-qu2",
    aliases: [
      "indiana jones e o grande circulo",
      "indiana jones and the great circle",
    ],
  },
  {
    key: "stray",
    title: "Stray",
    playlistId: "PL6ew14P2i0aaUAXyCLtVYuu4OdDGHrhAN",
    aliases: ["stray"],
  },
  {
    key: "star-wars-jedi-survivor",
    title: "Star Wars Jedi: Survivor",
    playlistId: "PL6ew14P2i0aYw3nRjhwihzgad7VYgu3GA",
    aliases: [
      "star wars jedi survivor",
      "jedi survivor",
    ],
    excludeVideoIds: [
      "u9axyhXDD74", // OS 10 MELHORES JOGOS DE STAR WARS
      "LC4kpBk5gMk", // OS 10 JOGOS MAIS PESADOS PARA PC
    ],
  },
  {
    key: "prince-of-persia-the-lost-crown",
    title: "Prince of Persia: The Lost Crown",
    playlistId: "PL6ew14P2i0aYdqOxJRDTWrOeeVyjOOYFk",
    aliases: [
      "prince of persia the lost crown",
    ],
    excludeVideoIds: [
      "btGpeCETJZY", // Chernobylite 2 inserido por engano na playlist
    ],
  },
  {
    key: "lego-batman-legacy-of-the-dark-knight",
    title: "LEGO Batman: Legacy of the Dark Knight",
    playlistId: "PL6ew14P2i0aYFuLW0GWrc1aFFm941KjrN",
    aliases: [
      "lego batman legacy of the dark knight",
      "lego batman o legado do cavaleiro das trevas",
    ],
  },
  {
    key: "pragmata",
    title: "PRAGMATA",
    playlistId: "PL6ew14P2i0aZ9vyFdTGk1Xp0ZmPi8ctvi",
    aliases: ["pragmata"],
  },
  {
    key: "atomic-heart",
    title: "Atomic Heart",
    playlistId: "PL6ew14P2i0aZp_9g2XAGQq5sDm3sPW-iJ",
    aliases: ["atomic heart", "atomicheart"],
  },
  {
    key: "assassins-creed-shadows",
    title: "Assassin’s Creed Shadows",
    playlistId: "PL6ew14P2i0abj4ZofMBi7JEpJ5Kry6Pqd",
    aliases: [
      "assassin's creed shadows",
      "assassins creed shadows",
      "ac shadows",
      "acshadows",
      "assasinscreedshadows",
    ],
  },
  {
    key: "silent-hill-f",
    title: "Silent Hill f",
    playlistId: "PL6ew14P2i0abhTdbJskPMZb2ARv8PhFJ4",
    aliases: ["silent hill f", "silenthillf"],
  },
  {
    key: "beast-of-reincarnation",
    title: "Beast of Reincarnation",
    playlistId: "PLYNOEBEkrN8I",
    aliases: ["beast of reincarnation"],
  },
];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘´`]/g, "'")
    .toLowerCase()
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactText(value: string) {
  return normalizeText(value).replace(/[^a-z0-9]/g, "");
}

function titleMatchesCoverage(title: string, coverage: Coverage) {
  const normalizedTitle = normalizeText(title);
  const compactTitle = compactText(title);

  return coverage.aliases.some((alias) => {
    const normalizedAlias = normalizeText(alias);
    const compactAlias = compactText(alias);

    return (
      normalizedTitle.includes(normalizedAlias) ||
      (compactAlias.length >= 5 && compactTitle.includes(compactAlias))
    );
  });
}

async function youtubeFetch<T>(
  pathname: string,
  params: Record<string, string>,
  apiKey: string
): Promise<T> {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${pathname}`);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    next: { revalidate: CACHE_SECONDS },
  });

  if (!response.ok) {
    const detail = await response.text();

    throw new Error(
      `YouTube API ${pathname} falhou (${response.status}): ${detail}`
    );
  }

  return response.json() as Promise<T>;
}

async function getUploadsPlaylistId(apiKey: string): Promise<string> {
  const data = await youtubeFetch<{
    items?: Array<{
      contentDetails?: {
        relatedPlaylists?: {
          uploads?: string;
        };
      };
    }>;
  }>(
    "channels",
    {
      part: "contentDetails",
      forHandle: YOUTUBE_CHANNEL_HANDLE,
    },
    apiKey
  );

  const uploadsId =
    data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsId) {
    throw new Error("Não foi possível localizar os uploads do canal.");
  }

  return uploadsId;
}

async function getPlaylistVideoIds(
  playlistId: string,
  apiKey: string
): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;

  do {
    const data = await youtubeFetch<{
      items?: Array<{
        contentDetails?: {
          videoId?: string;
        };
      }>;
      nextPageToken?: string;
    }>(
      "playlistItems",
      {
        part: "contentDetails",
        playlistId,
        maxResults: "50",
        ...(pageToken ? { pageToken } : {}),
      },
      apiKey
    );

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

async function getVideos(
  videoIds: string[],
  apiKey: string
): Promise<ChannelVideo[]> {
  const responses = [];

  for (let index = 0; index < videoIds.length; index += 50) {
    const batch = videoIds.slice(index, index + 50);

    responses.push(
      youtubeFetch<{
        items?: Array<{
          id?: string;
          snippet?: {
            title?: string;
          };
          statistics?: {
            viewCount?: string;
          };
        }>;
      }>(
        "videos",
        {
          part: "snippet,statistics",
          id: batch.join(","),
        },
        apiKey
      )
    );
  }

  const batches = await Promise.all(responses);

  return batches.flatMap((data) =>
    (data.items ?? []).flatMap((video) => {
      if (!video.id || !video.snippet?.title) {
        return [];
      }

      return [
        {
          id: video.id,
          title: video.snippet.title,
          viewCount: Number(video.statistics?.viewCount ?? 0),
        },
      ];
    })
  );
}

export async function GET(request: Request) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "YOUTUBE_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const debug = new URL(request.url).searchParams.get("debug") === "1";

    const uploadsPlaylistId = await getUploadsPlaylistId(apiKey);
    const uploadIds = await getPlaylistVideoIds(
      uploadsPlaylistId,
      apiKey
    );

    const allVideos = await getVideos(uploadIds, apiKey);
    const videosById = new Map(
      allVideos.map((video) => [video.id, video])
    );
    const uploadIdSet = new Set(uploadIds);

    const playlistIdsByCoverage = new Map<string, Set<string>>();

    await Promise.all(
      coverages.map(async (coverage) => {
        if (!coverage.playlistId) {
          playlistIdsByCoverage.set(
            coverage.key,
            new Set<string>()
          );
          return;
        }

        const ids = await getPlaylistVideoIds(
          coverage.playlistId,
          apiKey
        );

        playlistIdsByCoverage.set(
          coverage.key,
          new Set(ids.filter((id) => uploadIdSet.has(id)))
        );
      })
    );

    const results = coverages
      .map((coverage) => {
        const playlistIds =
          playlistIdsByCoverage.get(coverage.key) ??
          new Set<string>();

        const titleIds = new Set(
          allVideos
            .filter((video) =>
              titleMatchesCoverage(video.title, coverage)
            )
            .map((video) => video.id)
        );

        const excluded = new Set(
          coverage.excludeVideoIds ?? []
        );

        const matchedIds = new Set(
          [...playlistIds, ...titleIds].filter(
            (id) => !excluded.has(id)
          )
        );

        const videos = [...matchedIds]
          .flatMap((id) => {
            const video = videosById.get(id);

            if (!video) {
              return [];
            }

            return [video];
          })
          .sort((a, b) => b.viewCount - a.viewCount);

        const viewCount = videos.reduce(
          (total, video) => total + video.viewCount,
          0
        );

        return {
          key: coverage.key,
          title: coverage.title,
          kind: "playlist" as const,
          viewCount,
          videoCount: videos.length,
          ...(debug ? { videos } : {}),
        };
      })
      .sort((a, b) => b.viewCount - a.viewCount);

    return Response.json({
      channel: YOUTUBE_CHANNEL_HANDLE,
      scannedVideoCount: allVideos.length,
      coverages: results,
    });
  } catch (error) {
    console.error("YouTube coverage error:", error);

    return Response.json(
      {
        error: "Não foi possível consultar as coberturas.",
        detail:
          error instanceof Error
            ? error.message
            : "Erro desconhecido.",
      },
      { status: 500 }
    );
  }
}
