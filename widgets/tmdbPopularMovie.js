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
          name: "page",
          type: "number",
          required: false,
          default: 1,
          description: "要載入的頁數（預設為第 1 頁）"
      ]
    }
  ]
};

const API_KEY = "f558fc131f70f86049a00ee67fd1f422";

async function getPopularMovies({ page = 1 } = {}) {
  try {
    const lang = "zh-TW";
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${lang}&page=${page}`;

    const res = await Widget.http.get(url);
    const data = res.data || {};
    const results = data.results || [];

    const items = results.map(movie => ({
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

    const hasNext = page < data.total_pages;

    return {
      items,
      nextPage: hasNext ? page + 1 : null
    };
  } catch (error) {
    console.error("取得熱門電影失敗", error);
    return { items: [], nextPage: null };
  }
}
