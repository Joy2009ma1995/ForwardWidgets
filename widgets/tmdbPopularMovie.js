var WidgetMetadata = {
  id: "tmdbPopularMovie",
  title: "TMDB 熱門電影（可指定年份）",
  description: "使用 TMDB Discover API 查詢特定年份最熱門的電影",
  author: "Joey",                  // 作者
  site: "https://example.com",            // 网站地址
  version: "1.0.0",                       // Widget 版本
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "熱門電影（依年份）",
      functionName: "getPopularMoviesByYear",
      params: [
        {
          name: "language",
          title: "語言",
          type: "select",
          options: [
            { title: "繁體中文", value: "zh-TW" },
            { title: "英文", value: "en-US" }
          ],
          default: "zh-TW"
        },
        {
          name: "region",
          title: "地區",
          type: "input",
          default: "TW"
        },
        {
          name: "year",
          title: "年份（例如 2023）",
          type: "input",
          placeholder: "2023"
        }
      ]
    }
  ]
};

async function getPopularMoviesByYear({ language = "zh-TW", region = "TW", year } = {}) {
  try {
    const url = `https://api.themoviedb.org/3/discover/movie?` +
      `api_key=${API_KEY}&language=${language}&region=${region}` +
      `&sort_by=popularity.desc` +
      (year ? `&primary_release_year=${year}` : "");

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
  } catch (err) {
    console.error("發生錯誤：", err);
    return [];
  }
}
