var WidgetMetadata = {
  id: "tmdbPopularTV",
  title: "TMDB 熱門劇集",
  description: "TMDB 熱門劇集",
  author: "Joey",
  site: "https://example.com",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "熱門劇集",
      functionName: "getPopularTVShows",
      params: [
        {
          name: "page",
          title: "頁碼",
          type: "number",
          default: 1
        },
        {
          name: "language",
          title: "語言（如 zh-TW, en-US）",
          type: "input",
          default: "zh-TW"
        }
      ]
    }
  ]
};

const API_KEY = "f558fc131f70f86049a00ee67fd1f422";

async function getPopularTVShows(params = {}) {
  const lang = params.language || "zh-TW";
  const page = params.page || 1;

  const url = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=${lang}&page=${page}`;
  const res = await Widget.http.get(url);
  const results = res.data?.results || [];

  return results.map(tv => ({
    id: `tv_${tv.id}`,
    type: "link",
    title: tv.name || "未命名",
    description: tv.overview || "（無簡介）",
    releaseDate: tv.first_air_date || "",
    posterPath: tv.poster_path
      ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
      : "",
    backdropPath: tv.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${tv.backdrop_path}`
      : "",
    rating: tv.vote_average || 0,
    link: `tv_${tv.id}`
  }));
}

async function loadDetail(link) {
  const [type, id] = link.split("_");
  const lang = "zh-TW";

  const detailUrl = `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=${lang}`;
  const videoUrl = `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}&language=${lang}`;

  const [detailRes, videoRes] = await Promise.all([
    Widget.http.get(detailUrl),
    Widget.http.get(videoUrl)
  ]);

  const detail = detailRes.data || {};
  const videos = videoRes.data?.results || [];

  const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");

  return {
    title: detail.name || "未命名",
    description: detail.overview || "無簡介",
    videoUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "",
    posterPath: detail.poster_path
      ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
      : "",
    backdropPath: detail.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${detail.backdrop_path}`
      : "",
    rating: detail.vote_average || 0,
    releaseDate: detail.first_air_date || "",
    link: detail.homepage || `https://www.themoviedb.org/${type}/${id}`
  };
}
