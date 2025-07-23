WidgetMetadata={
  id: "trending",
  title: "Trending",
  functionName: "loadTraktTrending",
  params: [
    {
      name: "type",
      title: "內容類型",
      type: "enumeration",
      enumOptions: [
        { title: "電影", value: "movies" },
        { title: "影集", value: "shows" }
      ],
      value: "movies"
    },
    {
      name: "limit",
      title: "每頁數量",
      type: "number",
      value: 20
    },
    {
      name: "page",
      title: "頁碼",
      type: "page",
      value: 1
    }
  ]
};

async function loadTraktTrending(params = {}) {
  const type = params.type || "movies"; // "movies" 或 "shows"
  const limit = parseInt(params.limit, 10) || 20;
  const page = parseInt(params.page, 10) || 1;

  const API_URL = `https://api.trakt.tv/${type}/trending?page=${page}&limit=${limit}`;
  const headers = {
    "Content-Type": "application/json",
    "trakt-api-version": "2",
    "trakt-api-key": "YOUR_TRAKT_CLIENT_ID", // ← 請填入你自己的 Trakt Client ID
  };

  const res = await Widget.http.get(API_URL, { headers });
  const list = res.data || [];

  return list.map(item => {
    const data = type === "movies" ? item.movie : item.show;
    const tmdbID = data.ids.tmdb;

    return {
      id: `trakt_${data.ids.slug}`,
      title: data.title,
      subtitle: data.year?.toString() || "",
      poster: tmdbID
        ? `https://image.tmdb.org/t/p/w500/${tmdbID}.jpg`
        : "",
      type: type === "movies" ? "movie" : "tv",
      link: `https://trakt.tv/${type}/${data.ids.slug}`
    };
  });
}
