var WidgetMetadata = {
    id: "Letterboxd",
    title: "Letterboxd List/Watchlist",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "支持 Letterboxd 用户 Watchlist 或自建 List 的影片提取，可分页或随机抽取 IMDb ID。",
    author: "Joey",
    site: "https://github.com/Joy2009ma1995/ForwardWidgets",
    modules: [
        {
            title: "Letterboxd Watchlist/List",
            requiresWebView: false,
            functionName: "loadLetterboxdItems",
            cacheDuration: 3600,
            params: [
                {
                    name: "url",
                    title: "Letterboxd 链接",
                    type: "input",
                    description: "如：https://letterboxd.com/yourname/watchlist/ 或 https://letterboxd.com/yourname/list/top-250/",
                },
                {
                    name: "mode",
                    title: "加载模式",
                    type: "enumeration",
                    enumOptions: [
                        {
                            title: "分页加载",
                            value: "page",
                        },
                        {
                            title: "随机抽取9个影片",
                            value: "random",
                        },
                    ]
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page",
                },
            ],
        }
    ]
};
async function loadLetterboxdItems(params = {}) {
    try {
        const url = params.url;
        const mode = params.mode || "page";
        const page = params.page || 1;

        if (!url || !/^https:\/\/letterboxd\.com\/[^/]+\/(watchlist|list\/[^/]+)\/?$/.test(url)) {
            throw new Error("请输入合法的 Letterboxd Watchlist 或 List 链接");
        }

        const pagedUrl = `${url.replace(/\/$/, "")}/page/${page}/`;

        const response = await Widget.http.get(pagedUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });

        const doc = Widget.dom.parse(response.data);
        const links = Widget.dom.select(doc, 'a[href*="imdb.com/title/"]');

        const imdbIds = Array.from(new Set(
            links.map(el => {
                const href = Widget.dom.attr(el, 'href');
                const match = href?.match(/title\/(tt\d+)/);
                return match?.[1];
            }).filter(Boolean)
        ));

        let selectedIds = [];
        if (mode === "random") {
            if (page > 1) return [];
            const shuffled = imdbIds.sort(() => 0.5 - Math.random());
            selectedIds = shuffled.slice(0, 9);
        } else {
            const count = 20;
            const start = 0;
            selectedIds = imdbIds.slice(start, count);
        }

        return selectedIds.map(id => ({
            id,
            type: "imdb"
        }));
    } catch (error) {
        console.error("Letterboxd 数据提取失败:", error);
        throw error;
    }
}
