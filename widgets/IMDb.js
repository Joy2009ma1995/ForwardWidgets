var WidgetMetadata = {
    id: "IMDbWatchlist",
    title: "IMDb 想看清单",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "从 IMDb 的 Watchlist 中获取影片数据，可通过 user ID 自动解析",
    author: "huangxd",
    site: "https://github.com/huangxd-/ForwardWidgets",
    modules: [
        {
            title: "IMDb 想看",
            requiresWebView: false,
            functionName: "loadImdbWatchlistByUser",
            cacheDuration: 3600,
            params: [
                {
                    name: "user_id",
                    title: "IMDb 用户 ID",
                    type: "input",
                    description: "例如 ur204635540，可从 IMDb 个人主页 URL 中获取"
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
//自动解析 list ID 函数
async function resolveImdbListIdFromWatchlist(userId) {
    const url = `https://www.imdb.com/user/${userId}/watchlist/`;
    try {
        const response = await Widget.http.get(url, {
            maxRedirects: 0, // 禁止自动跳转
            validateStatus: status => status === 302 || status === 301,
        });

        const location = response.headers?.location;
        const match = location?.match(/\/list\/(ls\d+)\//);
        if (match) {
            return match[1];
        } else {
            throw new Error("无法提取 list_id，可能是页面未公开或 IMDb 页面结构更改");
        }
    } catch (e) {
        console.error("Watchlist 跳转失败", e);
        throw e;
    }
}

//主数据加载函数
async function loadImdbWatchlistByUser(params = {}) {
    const userId = params.user_id?.trim();
    const page = params.page || 1;
    const count = 20;

    if (!userId) throw new Error("请提供 IMDb 用户 ID");

    const listId = await resolveImdbListIdFromWatchlist(userId);
    const offset = (page - 1) * count;
    const url = `https://www.imdb.com/list/${listId}/?sort=title&view=detail&start=${offset + 1}&count=${count}`;

    try {
        const response = await Widget.http.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const doc = Widget.dom.parse(response.data);
        const items = Widget.dom.select(doc, 'div.lister-item');

        if (!items || items.length === 0) {
            throw new Error("未找到任何条目，清单可能设为私密或页面结构改变");
        }

        const ids = Array.from(items).map(el => {
            const link = Widget.dom.select(el, 'a[href^="/title/"]')[0];
            const href = link && (link.getAttribute?.('href') || Widget.dom.attr(link, 'href'));
            const match = href && href.match(/\/title\/(tt\d+)/);
            return match ? { id: match[1], type: "imdb" } : null;
        }).filter(Boolean);

        return ids;
    } catch (e) {
        console.error("IMDb Watchlist 解析失败", e);
        throw e;
    }
}
