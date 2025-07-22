var WidgetMetadata = {
  id: "tmdbPopularMovie",
  title: "TMDB 熱門電影（可指定年份+地區）",
  description: "使用地區&年份參數查詢最熱門的電影",
  author: "Joey",
  site: "https://example.com",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "熱門電影",
      functionName: "getPopularMovies",
      params: [
        {
          name: "region",
          title: "地區代碼（可選）",
          type: "input",
          default: "TW",
          placeholder: "例如 TW, US, JP"
        },
        {
          name: "year",
          title: "上映年份",
          type: "input",
          default: "",
          placeholder: "例如 2023（可留空）"
        }
      ]
    }
  ]
};

const API_KEY = "f558fc131f70f86049a00ee67fd1f422";

async function getPopularMovies({ region = "TW", year = "" }) {
  const lang = "zh-TW";
  const baseUrl = `https://api.themoviedb.org/3/discover/movie`;
  const params = new URLSearchParams({
    api_key: API_KEY,
    language: lang,
    region: region,
    sort_by: "popularity.desc",
    page: "1"
  });

  if (year) {
    params.append("primary_release_year", year); // 篩選年份
  }

  const url = `${baseUrl}?${params.toString()}`;
  const res = await Widget.http.get(url);
  const results = res.data?.results || [];

  return results.map(movie => ({
    id: `movie_${movie.id}`,
    type: "link",
    title: movie.title || "未命名",
    description: movie.overview || "（無簡介）",
    releaseDate: movie.release_date || "",
    posterPath: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "",
    backdropPath: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
      : "",
    rating: movie.vote_average || 0,
    link: `movie_${movie.id}`
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
    title: detail.title || "未命名",
    description: detail.overview || "無簡介",
    videoUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "",
    posterPath: detail.poster_path
      ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
      : "",
    backdropPath: detail.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${detail.backdrop_path}`
      : "",
    rating: detail.vote_average || 0,
    releaseDate: detail.release_date || "",
    link: detail.homepage || `https://www.themoviedb.org/${type}/${id}`
  };
}
