var WidgetMetadata = {
  id: "tmdbSearch",
  title: "TMDB 搜尋",
  description: "使用 TMDB API 搜尋電影或影集",
  author: "Joey",                  // 作者
  site: "https://example.com",            // 网站地址
  version: "1.0.0",                       // Widget 版本
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "搜尋 TMDB",
      functionName: "search",
      params: [
        {
          name: "query",
          type: "input",
          title: "搜尋關鍵字",
          placeholder: "輸入電影或影集名稱"
        },
        {
          name: "type",
          type: "select",
          title: "搜尋類型",
          options: [
            { title: "電影", value: "movie" },
            { title: "影集", value: "tv" }
          ]
        }
      ]
    }
  ]
};

const API_KEY = "f558fc131f70f86049a00ee67fd1f422";

async function search(params) {
  const query = encodeURIComponent(params.query || "");
  const type = params.type || "movie";
  const lang = "zh-TW";

  if (!query) return [];

  const url = `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${query}&language=${lang}`;
  const res = await Widget.http.get(url);

  const items = res.data?.results || [];

  return items.map(item => ({
    id: `${type}_${item.id}`,
    type: "link",
    title: item.title || item.name || "未命名",
    description: item.overview || "（無簡介）",
    releaseDate: item.release_date || item.first_air_date || "",
    posterPath: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : "",
    backdropPath: item.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
      : "",
    rating: item.vote_average || 0,
    link: `${type}_${item.id}` // 將 id 編碼作為可回傳的識別連結
  }));
}

// 新增延遲詳情加載功能
async function loadDetail(link) {
  const [type, id] = link.split("_");
  const lang = "zh-TW";

  // 詳情請求
  const detailUrl = `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=${lang}`;
  const videoUrl = `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}&language=${lang}`;

  const [detailRes, videoRes] = await Promise.all([
    Widget.http.get(detailUrl),
    Widget.http.get(videoUrl)
  ]);

  const detail = detailRes.data || {};
  const videos = videoRes.data?.results || [];

  // 嘗試找出一個 YouTube 預告片
  const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");

  return {
    title: detail.title || detail.name || "未命名",
    description: detail.overview || "無簡介",
    videoUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "",
    posterPath: detail.poster_path
      ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
      : "",
    backdropPath: detail.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${detail.backdrop_path}`
      : "",
    rating: detail.vote_average || 0,
    releaseDate: detail.release_date || detail.first_air_date || "",
    link: detail.homepage || `https://www.themoviedb.org/${type}/${id}`
  };
}
