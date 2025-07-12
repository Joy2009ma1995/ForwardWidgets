var WidgetMetadata = {
    id: "TMDbList",
    title: "TMDb 片單",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "讀取 TMDb 公開片單內容",
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
                    placeholder: "你的 TMDb API Key"
                }
            ]
        }
    ]
};

async function loadTmdbList(params) {
    const { list_id, api_key } = params;
    const url = `https://api.themoviedb.org/3/list/${list_id}?api_key=${api_key}&language=zh-TW`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("無法取得 TMDb 清單內容");

    const data = await res.json();
    const items = [];

    for (const entry of data.items) {
        let imdb_id = null;

        // 獲取 IMDb ID（需額外請求）
        const tmdbType = entry.media_type || (entry.first_air_date ? 'tv' : 'movie');
        const tmdbId = entry.id;

        const detailRes = await fetch(`https://api.themoviedb.org/3/${tmdbType}/${tmdbId}/external_ids?api_key=${api_key}`);
        if (detailRes.ok) {
            const external = await detailRes.json();
            imdb_id = external.imdb_id || null;
        }

        items.push({
            title: entry.title || entry.name,
            poster: entry.poster_path ? `https://image.tmdb.org/t/p/w500${entry.poster_path}` : null,
            imdb_id,
            year: (entry.release_date || entry.first_air_date || "").split("-")[0],
            type: tmdbType
        });
    }

    return items;
}
