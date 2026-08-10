export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "YOUTUBE_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const url = new URL(
      "https://www.googleapis.com/youtube/v3/channels"
    );

    url.searchParams.set("part", "statistics");
    url.searchParams.set("forHandle", "@killlipe_");
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString(), {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      const error = await response.text();

      console.error("YouTube API error:", error);

      return Response.json(
        { error: "Não foi possível consultar o YouTube." },
        { status: response.status }
      );
    }

    const data = await response.json();

    const channel = data.items?.[0];

    if (!channel) {
      return Response.json(
        { error: "Canal do YouTube não encontrado." },
        { status: 404 }
      );
    }

    return Response.json({
      subscriberCount: channel.statistics.subscriberCount,
      viewCount: channel.statistics.viewCount,
      videoCount: channel.statistics.videoCount,
    });
  } catch (error) {
    console.error("YouTube stats error:", error);

    return Response.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}