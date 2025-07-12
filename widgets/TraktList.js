// trakt list 单模块
WidgetMetadata = {
    id: "TraktListOnly",
    title: "Trakt片单",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "仅提取 Trakt 用户片单中内容并转换为 IMDb ID",
    author: "huangxd",
    site: "https://github.com/huangxd-/ForwardWidgets",
    modules: [
        {
            title: "Trakt片单",
            requiresWebView: false,
            functionName: "loadListItems",
            cacheDuration: 86400,
            params: [
                {
                    name: "user_name",
                    title: "用户名",
                    type: "input",
                    description: "如：giladg，未填写情况下接口不可用",
                },
                {
                    name: "list_name",
                    title: "片单列表名",
                    type: "input",
                    description: "如：latest-4k-releases，未填写情况下接口不可用",
                },
                {
                    name: "sort_by",
                    title: "排序依据",
                    type: "enumeration",
                    enumOptions: [
                        { title: "排名算法", value: "rank" },
                        { title: "添加时间", value: "added" },
                        { title: "标题", value: "title" },
                        { title: "发布日期", value: "released" },
                        { title: "内容时长", value: "runtime" },
                        { title: "流行度", value: "popularity" },
                        { title: "随机", value: "random" },
                    ],
                },
                {
                    name: "sort_how",
                    title: "排序方向",
                    type: "enumeration",
                    enumOptions: [
                        { title: "正序", value: "asc" },
                        { title: "反序", value: "desc" },
                    ],
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page"
                },
            ],
        },
    ]
};

function extractTraktUrlsFromResponse(responseData, minNum, maxNum, random = false) {
    let docId = Widget.dom.parse(responseData);
    let metaElements = Widget.dom.select(docId, 'meta[content^="https://trakt.tv/"]');
    if (!metaElements || metaElements.length === 0) {
        throw new Error("未找到任何 meta content 链接");
    }

    let traktUrls = Array.from(new Set(metaElements
        .map(el => el.getAttribute?.('content') || Widget.dom.attr(el, 'content'))
        .filter(Boolean)));

    if (random) {
        const shuffled = traktUrls.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(9, shuffled.length));
    } else {
        return traktUrls.slice(minNum - 1, maxNum);
    }
}

async function fetchImdbIdsFromTraktUrls(traktUrls) {
    let imdbIdPromises = traktUrls.map(async (url) => {
        try {
            let detailResponse = await Widget.http.get(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0",
                },
            });

            let detailDoc = Widget.dom.parse(detailResponse.data);
            let imdbLinkEl = Widget.dom.select(detailDoc, 'a#external-link-imdb')[0];
            if (!imdbLinkEl) return null;

            let href = Widget.dom.attr(imdbLinkEl, 'href');
            let match = href.match(/title\/(tt\d+)/);
            return match ? `${match[1]}` : null;
        } catch {
            return null;
        }
    });

    let imdbIds = [...new Set(
        (await Promise.all(imdbIdPromises))
            .filter(Boolean)
    )].map((id) => ({
        id,
        type: "imdb",
    }));

    return imdbIds;
}

async function fetchTraktData(url, headers = {}, status, minNum, maxNum, random = false, order = "") {
    try {
        const response = await Widget.http.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
                ...headers,
            },
        });

        let traktUrls = extractTraktUrlsFromResponse(response.data, minNum, maxNum, random);
        if (order === "desc") {
            traktUrls = traktUrls.reverse();
        }

        return await fetchImdbIdsFromTraktUrls(traktUrls);
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}

async function loadListItems(params = {}) {
    try {
        const page = params.page;
        const userName = params.user_name || "";
        const listName = params.list_name || "";
        const sortBy = params.sort_by || "";
        const sortHow = params.sort_how || "";
        const count = 20;
        const minNum = ((page - 1) % 6) * count + 1;
        const maxNum = ((page - 1) % 6) * count + 20;
        const traktPage = Math.floor((page - 1) / 6) + 1;

        if (!userName || !listName) {
            throw new Error("必须提供 Trakt 用户名 和 片单列表名");
        }

        let url = `https://trakt.tv/users/${userName}/lists/${listName}?page=${traktPage}&sort=${sortBy},${sortHow}`;
        return await fetchTraktData(url, {}, "", minNum, maxNum);
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}
