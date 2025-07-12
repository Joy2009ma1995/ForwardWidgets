var WidgetMetadata = {
    id: "TMDbList",
    title: "TMDb 片單",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "讀取 TMDb 公開片單內容，支援 IMDb ID 對應",
    author: "huangxd",
    site: "https://github.com/huangxd-/ForwardWidgets",
    modules: [
        {
            title: "TMDb 片單",
            functionName: "loadTmdbList",
            requiresWebView: false,
            cacheDuration: 3600,
            params: [
                {
                    name: "list_id",
                    title: "TMDb List ID",
                    type: "string",
                    required: true,
                    placeholder: "例如：8242108"
                },
                {
                    name: "api_key",
                    title: "TMDb API Key",
                    type: "string",
                    required: true,
                    placeholder: "你的 TMDb API 金鑰"
                },
            ],
        },
    ],
};

async function loadTmdbList(params) {
    const { list_id, api_key } = params;
    const listUrl = `https://api.themoviedb.org/3/list/${list_id}?api_key=${api_key}&language=zh-TW`;

    const response = await fetch(listUrl);
    if (!response.ok) {
        throw new Error("無法取得 TMDb 清單內容");
    }

    const data = await response.json();
    const results = [];

    for (const item of data.items || []) {
        const tmdbType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
        const tmdbId = item.id;

        let imdb_id = null;
        try {
            const externalRes = await fetch(`https://api.themoviedb.org/3/${tmdbType}/${tmdbId}/external_ids?api_key=${api_key}`);
            if (externalRes.ok) {
                const external = await externalRes.json();
                imdb_id = external.imdb_id || null;
            }
        } catch (e) {
            imdb_id = null;
        }

        results.push({
            title: item.title || item.name || "（無標題）",
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
            imdb_id: imdb_id,
            year: (item.release_date || item.first_air_date || "").split("-")[0],
            type: tmdbType
        });
    }

    return results;
}
