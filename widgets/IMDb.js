var WidgetMetadata = {
  id: "IMDbWatchlist",
  title: "IMDb Watchlist",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "解析 IMDb 用户 Watchlist 页面获取 IMDb ID，无需 API Key",
  author: "Forward",
  site: "https://github.com/InchStudio/ForwardWidgets",
  modules: [
    {
      title: "IMDb Watchlist",
      requiresWebView: false,
      functionName: "loadImdbWatchlistItems",
      cacheDuration: 21600,
      params: [
        {
          name: "user_id",
          title: "IMDb 用户 ID",
          type: "input",
          description: "例如：ur204635540，可在 IMDb 用户主页网址中找到"
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        }
      ]
    }
  ]
};

async function loadImdbWatchlistItems(params = {}) {
  try {
    const page = params.page || 1;
    const userId = params.user_id;
    if (!userId) throw new Error("必须提供 IMDb 用户 ID");

    const count = 20;
    const start = (page - 1) * count + 1;

    const url = `https://www.imdb.com/user/${userId}/watchlist?start=${start}`;
    const response = await Widget.http.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    const doc = Widget.dom.parse(response.data);
    const elements = Widget.dom.select(doc, 'div.lister-item');

    const imdbIds = elements.map(el => {
      const link = Widget.dom.select(el, 'h3.lister-item-header a')[0];
      const href = link && (Widget.dom.attr(link, 'href') || '');
      const match = href.match(/\/title\/(tt\d+)/);
      return match ? { id: match[1], type: "imdb" } : null;
    }).filter(Boolean);

    return imdbIds;
  } catch (error) {
    console.error("IMDb Watchlist 抓取失败:", error);
    throw error;
  }
}
