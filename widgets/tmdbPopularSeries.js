var WidgetMetadata = {
  id: "tmdbPopularSeries",
  title: "TMDB 熱門劇集",
  description: "TMDB 熱門劇集",
  author: "Joey",                  // 作者
  site: "https://example.com",            // 网站地址
  version: "1.0.0",                       // Widget 版本
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "熱門劇集",
      functionName: "getPopularSeries",
      params: [
        { name: "page", title: "頁數", type: "input", defaultValue: 1 },
        { name: "perPage", title: "每頁條目數", type: "input", defaultValue: 50 }
      ] // 分页参数
    }
  ]
};

const API_KEY = "f558fc131f70f86049a00ee67fd1f422"; // 替换为你的 TMDB API key

async function getPopularSeries(params) {
  const lang = "zh-TW";
  const page = params.page || 1; // 默认获取第一页
  const perPage = params.perPage || 50; // 每页获取的条目数量

  const url = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=${lang}&page=${page}&per_page=${perPage}`;

  const res = await Widget.http.get(url);
  const results = res.data?.results || [];

  return results.map(series => ({
    id: `tv_${series.id}`,
    type: "series",
    title: series.name,
    description: series.overview,
    poster: `https://www.themoviedb.org/t/p/w500${series.poster_path}`,
    release_date: series.first_air_date,
    rating: series.vote_average,
    language: series.original_language,
    genres: series.genre_ids.join(", "),
  }));
}
