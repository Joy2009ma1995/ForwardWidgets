var WidgetMetadata = {
  id: "tmdbUpcoming",
  title: "七日內即將上映電影",
  description: "列出未來 7 天內即將上映的電影",
  author: "Joey",
  site: "https://example.com",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "未來 7 天上映",
      functionName: "getUpcomingMovies",
      params: []
    }
  ]
};

const API_KEY = "f558fc131f70f86049a00ee67fd1f422";

function isWithinNext7Days(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  const releaseDate = new Date(dateStr);
  const diff = (releaseDate - today) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 7;
}

async function getUpcomingMovies() {
  const lang = "zh-TW";
  const region = "TW";
  const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=${lang}&region=${region}`;

  const res = await Widget.http.get(url);
  const results = res.data?.results || [];

  // 僅保留 7 天內的電影
  const filtered = results.filter(m => isWithinNext7Days(m.release_date));

  return filtered.map(movie => ({
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
