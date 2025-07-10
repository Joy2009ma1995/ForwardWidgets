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
        const page = params.page;
        const userName = params.user_name || "";
        let status = params.status || "";
        const random = status === "random_watchlist";
        if (random) {
            status = "watchlist";
        }
        const count = 20
        const size = status === "watchlist" ? 6 : 3
        const minNum = ((page - 1) % size) * count + 1
        const maxNum = ((page - 1) % size) * count + 20
        const traktPage = Math.floor((page - 1) / size) + 1

        if (!userName) {
            throw new Error("必须提供 Trakt 用户名");
        }

        if (random && page > 1) {
            return [];
        }

        let url = `https://www.imdb.com/user/${userId}/watchlist?start=${start}`;
        return await fetchTraktData(url, {}, userId, start);
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}
