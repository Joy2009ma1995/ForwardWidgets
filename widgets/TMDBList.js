// tmdb list 單模塊（API 版本）
WidgetMetadata = {
    id: "TMDbListOnlyAPI",
    title: "TMDb片單(API)",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "通過 TMDb API 提取片單並轉換為 IMDb ID",
    author: "huangxd",
    site: "https://github.com/huangxd-/ForwardWidgets",
    modules: [
        {
            title: "TMDb片單",
            requiresWebView: false,
            functionName: "loadTmdbListItems",
            cacheDuration: 86400,
            params: [
                {
                    name: "list_id",
                    title: "TMDb片單ID",
                    type: "input",
                    description: "如：8243178，對應片單網址 https://www.themoviedb.org/list/8243178",
                },
                {
                    name: "page",
                    title: "頁碼",
                    type: "page"
                },
            ],
        },
    ]
};

async function loadTmdbListItems(params = {}) {
    const apiKey = "f558fc131f70f86049a00ee67fd1f422";
    const page = parseInt(params.page || "1", 10);
    const listId = params.list_id;

    if (!listId) {
        throw new Error("請提供 TMDb 片單 ID");
    }

    const url = `https://api.themoviedb.org/4/list/${listId}?page=${page}`;

    try {
        const response = await Widget.http.get(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json;charset=utf-8",
            },
        });

        const items = response.data.results || [];
        if (!items.length) {
            throw new Error("該頁沒有項目，可能是頁數過大或片單為空");
        }

        const imdbIds = items
            .map((item) => {
                const imdbId = item.external_ids?.imdb_id;
                if (imdbId && /^tt\d{7,8}$/.test(imdbId)) {
                    return {
                        id: imdbId,
                        type: "imdb",
                    };
                }
                return null;
            })
            .filter(Boolean);

        return imdbIds;
    } catch (error) {
        console.error("API 請求失敗:", error);
        throw new Error("無法取得 TMDb API 資料，請確認 List ID 正確且為公開狀態");
    }
}
