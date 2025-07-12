var WidgetMetadata = {
    id: "IMDbWatchlist",
    title: "IMDb 想看清单",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "从 IMDb 的 Watchlist 中获取影片数据，仅需填写 user_id 即可自动提取 list_id，请确保 Watchlist 为公开状态",
    author: "Joey",
    site: "https://github.com/Joy2009ma1995/ForwardWidgets",
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
                    description: "例如 ur204635540，可从 IMDb 个人主页 URL 中获取，请确保 Watchlist 为公开"
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

// 🔁 解析 IMDb 用户 Watchlist 页面，提取实际 list_id
async function resolveImdbListId(userId) {
    const url = `https://www.imdb.com/user/${userId}/watchlist/`;
    try {
        const response = await Widget.http.get(url, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        const doc = Widget.dom.parse(response.data);
        const link = Widget.dom.select(doc, 'link[rel="canonical"]')[0];
        const href = link && Widget.dom.attr(link, 'href');
        const match = href?.match(/\/list\/(ls\d+)\//);

        if (match) {
            return match[1];
        } else {
            throw new Error("无法从 Watchlist 页面解析出 list_id，可能 Watchlist 为私密或页面结构已更改");
        }
    } catch (e) {
        console.error("解析 IMDb Watchlist list_id 失败", e);
        throw e;
    }
}

// 📥 主加载函数：根据 user_id 自动获取 list_id 并提取影片 IMDb ID
async function loadImdbWatchlistByUser(params = {}) {
    const userId = params.user_id?.trim().replace(/\/$/, '');
    const page = parseInt(params.page || 1);
    const count = 20;

    if (!userId) {
        throw new Error("请提供 IMDb 用户 ID");
    }

    const listId = await resolveImdbListId(userId);
    const offset = (page - 1) * count;
    const url = `https://www.imdb.com/list/${listId}/?sort=title&view=detail&start=${offset + 1}&count=${count}`;

    try {
        const response = await Widget.http.get(url, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        const doc = Widget.dom.parse(response.data);
        const items = Widget.dom.select(doc, 'div.lister-item');

        if (!items || items.length === 0) {
            throw new Error("未找到任何条目，Watchlist 可能设为私密或页面结构已更改");
        }

        const results = Array.from(items).map(el => {
            const link = Widget.dom.select(el, 'a[href^="/title/"]')[0];
            const href = link && (link.getAttribute?.('href') || Widget.dom.attr(link, 'href'));
            const match = href?.match(/\/title\/(tt\d+)/);
            const title = Widget.dom.text(Widget.dom.select(el, '.lister-item-header a')[0])?.trim();

            return match ? {
                id: match[1],
                type: "imdb",
                title: title || ""
            } : null;
        }).filter(Boolean);

        return results;
    } catch (e) {
        console.error("IMDb Watchlist 抓取失败", e);
        throw e;
    }
}
