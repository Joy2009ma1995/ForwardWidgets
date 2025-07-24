var WidgetMetadata = {
  id: "tmdbPopularSeries",
  title: "TMDB 熱門劇集",
  description: "支援多頁面的 TMDB 熱門劇集列表",
  author: "Joey",
  site: "https://example.com",
  version: "1.0.1",
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "熱門劇集",
      functionName: "getPopularSeries",
      params: [
        {
          name: "pages",
          type: "number",
          default: 1,
          description: "要抓取的頁數，預設 1 頁"
        }
      ]
    }
  ]
};

const API_KEY = "f558fc131f70f86049a00ee67fd1f422";

/**
 * 取得 TMDB 熱門劇集，支援多頁面
 * @param {{ pages: number }} options
 */
async function getPopularSeries({ pages }) {
  const lang = "zh-TW";
  const allResults = [];

  // 限制最多抓取 5 頁，避免過多請求
  const maxPages = Math.min(pages, 15);
  for (let page = 1; page <= maxPages; page++) {
    const url = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=${lang}&page=${page}`;
    const res = await Widget.http.get(url);
    const results = res.data?.results || [];
    allResults.push(...results);
  }

  return allResults.map(series => ({
    id: `tv_${series.id}`,
    type: "series",
    title: series.name,
    description: series.overview,
    poster: `https://www.themoviedb.org/t/p/w500${series.poster_path}`,
    release_date: series.first_air_date,
    rating: series.vote_average,
    language: series.original_language,
    genres: series.genre_ids.join(", ")
  }));
}
