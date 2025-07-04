// ✅ 添加模块定义
WidgetMetadata ={
  id: "douban.externalList",
  title: "外部片单",
  functionName: "externalList",
  params: [
    {
      name: "source",
      title: "来源",
      type: "enumeration",
      enumOptions: [
        { title: "IMDb", value: "imdb" },
        { title: "豆瓣", value: "douban" }
      ],
    },
    {
      name: "url",
      title: "片单地址",
      type: "input",
      description: "豆瓣片单地址",
      placeholders: [
        {
          title: "豆瓣电影片单",
          value: "https://www.douban.com/doulist/108673/",
        },
      ],
    }
  ]
}

// ✅ 函数入口
async function externalList(params) {
  const { source, url } = params;
  if (source === "imdb") return await parseIMDbList(url);
  if (source === "douban") return await parseDoubanList(url);
  throw new Error("未知来源");
}

// ✅ IMDb 解析
async function parseIMDbList(url) {
  const response = await Widget.http.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = response?.data;
  if (!html) throw new Error("获取 IMDb 页面失败");

  const $ = Widget.html.load(html);
  const items = $("div.lister-item");

  const imdbIds = [];
  items.each((_, el) => {
    const link = $(el).find("h3 a").attr("href");
    const match = link?.match(/\/title\/(tt\d+)/);
    if (match) imdbIds.push(match[1]);
  });

  return await matchIMDbToTMDB(imdbIds);
}

// ✅ 豆瓣片单解析
async function parseDoubanList(url) {
  const response = await Widget.http.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = response?.data;
  if (!html) throw new Error("获取豆瓣页面失败");

  const $ = Widget.html.load(html);
  const items = $("div.doulist-item");

  const doubanIds = [];
  items.each((_, el) => {
    const link = $(el).find("div.title a").attr("href");
    const match = link?.match(/subject\/(\d+)/);
    if (match) doubanIds.push(match[1]);
  });

  return await matchDoubanToTMDB(doubanIds);
}

// ✅ IMDb → TMDB
async function matchIMDbToTMDB(imdbIds) {
  const results = [];

  for (const imdbId of imdbIds) {
    try {
      const tmdb = await Widget.tmdb.get(`find/${imdbId}`, {
        params: {
          external_source: "imdb_id",
        },
      });

      const item = tmdb.movie_results?.[0] || tmdb.tv_results?.[0];
      if (item) {
        const type = tmdb.movie_results?.length ? "movie" : "tv";
        results.push({
          id: item.id,
          type: "tmdb",
          title: item.title || item.name,
          description: item.overview,
          releaseDate: item.release_date || item.first_air_date,
          backdropPath: item.backdrop_path,
          posterPath: item.poster_path,
          rating: item.vote_average,
          mediaType: type,
        });
      }
    } catch (e) {
      console.warn("找不到 IMDb ID:", imdbId);
    }
  }

  return results;
}

// ✅ 豆瓣 → TMDB（通过标题搜索）
async function matchDoubanToTMDB(doubanIds) {
  const results = [];

  for (const doubanId of doubanIds) {
    try {
      const subjectPage = await Widget.http.get(`https://movie.douban.com/subject/${doubanId}/`, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const $ = Widget.html.load(subjectPage.data);
      const title = $("title").text().split(" (")[0].trim();
      const yearMatch = subjectPage.data.match(/year">(\d{4})</);
      const year = yearMatch?.[1];

      const searchRes = await Widget.tmdb.get("search/multi", {
        params: {
          query: title,
          year: year,
          language: "zh-CN",
        },
      });

      const item = searchRes.results?.[0];
      if (item) {
        results.push({
          id: item.id,
          type: "tmdb",
          title: item.title || item.name,
          description: item.overview,
          releaseDate: item.release_date || item.first_air_date,
          backdropPath: item.backdrop_path,
          posterPath: item.poster_path,
          rating: item.vote_average,
          mediaType: item.media_type,
        });
      }
    } catch (e) {
      console.warn("匹配豆瓣失败:", doubanId);
    }
  }

  return results;
}
