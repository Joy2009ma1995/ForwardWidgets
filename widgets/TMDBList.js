// WidgetMetadata 配置
var WidgetMetadata = {
  id: "tmdb_watchlist_widget",      // Widget 唯一标识符
  title: "TMDB Watchlist",          // Widget 显示标题
  description: "显示用户的 TMDB Watchlist",  // 描述
  author: "Your Name",              // 作者
  site: "https://www.themoviedb.org", // 网站地址
  version: "1.0.0",                 // 版本号
  requiredVersion: "0.0.1",         // ForwardWidget 所需版本
  detailCacheDuration: 300,         // 缓存时长 5 分钟
  modules: [
    {
      title: "TMDB Watchlist",      // 模块标题
      description: "显示用户的 TMDB Watchlist",  // 模块描述
      requiresWebView: false,       // 不需要 WebView
      functionName: "fetchTMDBWatchlist", // 处理函数名
      sectionMode: true,            // 支持分页加载
      cacheDuration: 300,           // 缓存时长，单位：秒
      params: [
        {
          name: "apiKey",          // 参数名
          title: "TMDB API Key",   // 参数标题
          type: "input",           // 输入框
          description: "TMDB 的 API 金鑰",  // 参数描述
          value: ""                // 默认值
        },
        {
          name: "sessionId",
          title: "Session ID",
          type: "input",
          description: "TMDB 授權 Session ID",
          value: ""
        },
        {
          name: "accountId",
          title: "Account ID",
          type: "input",
          description: "TMDB 使用者帳號 ID",
          value: ""
        },
        {
          name: "mediaType",
          title: "媒體類型",
          type: "enumeration",
          description: "選擇要顯示的類型",
          value: "movie",  // 默认值是电影
          enumOptions: [
            { title: "電影", value: "movie" },
            { title: "影集", value: "tv" }
          ]
        },
        {
          name: "page",
          title: "頁碼",
          type: "page",
          description: "分頁載入",
          value: 1
        }
      ]
    }
  ],
  search: {                       // 可选的搜索配置
    title: "Search",
    functionName: "search",       // 搜索函数
    params: [/* 搜索参数配置 */]
  }
};

// 获取 TMDB Watchlist
async function fetchTMDBWatchlist(params = {}) {
  const { apiKey, sessionId, accountId, mediaType = "movie", page = 1 } = params;

  // 参数验证
  if (!apiKey || !sessionId || !accountId) {
    throw new Error("缺少必要參數：apiKey、sessionId 或 accountId");
  }

  // 请求 URL
  const url = `https://api.themoviedb.org/3/account/${accountId}/watchlist/${mediaType}?api_key=${apiKey}&session_id=${sessionId}&language=zh-TW&page=${page}`;

  try {
    // 发送请求
    const response = await Widget.http.get(url);
    const results = response.data.results || [];

    // 处理返回的电影/剧集数据
    return results.map(item => ({
      id: `${mediaType}.${item.id}`,
      type: "tmdb",
      title: item.title || item.name,
      posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
      backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : "",
      releaseDate: item.release_date || item.first_air_date || "",
      mediaType: mediaType,
      rating: item.vote_average?.toFixed(1) || "0",
      genreTitle: "", // 可选补充分类名称
      duration: 0,    // TMDB 无提供播放长度
      durationText: "",
      previewUrl: "", // 无预览
      videoUrl: "",   // 详情页中获取
      link: `https://www.themoviedb.org/${mediaType}/${item.id}`,
      episode: item.episode_count || 0,
      description: item.overview || ""
    }));

  } catch (error) {
    console.error("抓取 Watchlist 失败:", error);
    throw error;
  }
}

// 加载视频详情（如视频预告片等）
async function loadDetail(link) {
  try {
    const match = link.match(/themoviedb\.org\/(movie|tv)\/(\d+)/);
    if (!match) return {}; // 无效链接

    const [, mediaType, id] = match;
    const apiKey = "你的API"; // 可从参数中带入
    const url = `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${apiKey}&language=en-US`;

    // 获取视频数据
    const response = await Widget.http.get(url);
    const videos = response.data.results || [];
    const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");

    // 如果找到预告片，返回 YouTube 地址
    return trailer ? {
      videoUrl: `https://www.youtube.com/watch?v=${trailer.key}`,
      previewUrl: `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`
    } : {};
  } catch (e) {
    return {};  // 出错时返回空对象
  }
}
