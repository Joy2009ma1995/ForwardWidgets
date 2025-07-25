var WidgetMetadata = {
  id: "imdbPopularTV",
  title: "IMDb 熱門劇集",
  description: "IMDb 熱門劇集",
  author: "Joey",
  site: "https://www.imdb.com/chart/tvmeter/",
  version: "1.0.3",
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "熱門劇集",
      functionName: "getPopularTVShows",
      params: [
        { name: "limit", type: "number", default: 10, description: "每頁顯示數量" },
        { name: "page", type: "number", default: 1, description: "頁碼（從 1 開始）" }
      ]
    }
  ]
};

const TMDB_API_KEY = "f558fc131f70f86049a00ee67fd1f422";
const CACHE_KEY = "imdb_popular_tv_cache";
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 小時

// 讀取快取
async function getCache() {
  return await Widget.cache.get(CACHE_KEY);
}

// 寫入快取
async function setCache(data) {
  await Widget.cache.set(CACHE_KEY, {
    timestamp: Date.now(),
    data: data
  });
}

// 透過 TMDB 查詢 TV 資料
async function getTMDBInfoByIMDB(imdbId) {
  const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&language=zh-TW&external_source=imdb_id`;
  const res = await Widget.http.get(url);
  const tv = res.data?.tv_results?.[0];
  if (!tv) return null;

  return {
    tmdbId: tv.id,
    title: tv.name,
    poster: tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : null
  };
}

// 從 IMDb 抓取榜單 + TMDB 補全
async function fetchIMDbData() {
  const url = "https://www.imdb.com/chart/tvmeter/";
  const res = await Widget.http.get(url, {
    headers: { "Accept-Language": "en-US,en;q=0.9" }
  });
  const html = res.data;

  const regex = /<li class="ipc-metadata-list-summary-item.*?<a href="\/title\/(tt\d+)\/.*?"[^>]*>(.*?)<\/a>/gs;
  const matches = [...html.matchAll(regex)];

  const allItems = [];
  for (const match of matches) {
    const imdbId = match[1];
    const imdbTitle = match[2].replace(/&amp;/g, "&").trim();
    const link = `https://www.imdb.com/title/${imdbId}/`;

    const tmdbInfo = await getTMDBInfoByIMDB(imdbId);

    allItems.push({
      id: tmdbInfo?.tmdbId ? `tv_${tmdbInfo.tmdbId}` : imdbId,
      type: "link",
      title: tmdbInfo?.title || imdbTitle,
      link: link,
      poster: tmdbInfo?.poster || null,
      meta: {
        imdbId: imdbId,
        tmdbId: tmdbInfo?.tmdbId || null
      }
    });
  }

  // 存入快取
  await setCache(allItems);
  return allItems;
}

// 主函數：支援分頁 + 快取
async function getPopularTVShows({ limit = 10, page = 1 } = {}) {
  let cache = await getCache();
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    console.log("✅ 使用快取");
    const start = (page - 1) * limit;
    return cache.data.slice(start, start + limit);
  }

  console.log("🔄 抓取 IMDb + TMDB 資料");
  const allItems = await fetchIMDbData();
  const start = (page - 1) * limit;
  return allItems.slice(start, start + limit);
}
