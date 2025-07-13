var WidgetMetadata = {
  id: "LetterboxdList",
  title: "Letterboxd 片单",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "从 Letterboxd 用户的片单中提取影片数据，支持分页与 IMDb ID 输出",
  author: "Joey",
  site: "https://github.com/Joy2009ma1995/ForwardWidgets",
  modules: [
    {
      title: "Letterboxd List",
      description: "输入 Letterboxd 的 List URL",
      requiresWebView: false,
      functionName: "loadLetterboxdListItems",
      params: [
        {
          name: "url",
          title: "Letterboxd 列表链接",
          type: "input",
          description: "如：https://letterboxd.com/username/list/list-name/",
          placeholders: [
            {
              title: "示例片单：Criterion Collection",
              value: "https://letterboxd.com/davidjenkins/list/the-criterion-collection/",
            }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "limit", title: "🔢 每页数量", type: "constant", value: "30" }
      ],
    }
  ]
};

// ================== 主函数 ==================
async function loadLetterboxdListItems(params = {}) {
  const url = params.url;
  if (!url || !/^https:\/\/letterboxd\.com\/.+\/list\/.+/.test(url)) {
    throw new Error("请输入合法的 Letterboxd List 地址");
  }

  const { start, limit } = calculatePagination(params);
  const pageParam = Math.floor(start / limit) + 1;
  const fullUrl = url.replace(/\/+$/, '') + `/page/${pageParam}/`;

  const response = await Widget.http.get(fullUrl, {
    headers: {
      Referer: "https://letterboxd.com/",
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  if (!response || !response.data) {
    throw new Error("无法获取页面内容");
  }

  const docId = Widget.dom.parse(response.data);
  if (docId < 0) throw new Error("Letterboxd HTML 解析失败");

  const filmElements = Widget.dom.select(docId, "li.poster-container");
  const results = [];

  for (const el of filmElements) {
    try {
      const linkEl = Widget.dom.selectFirst(el, "div.poster a");
      const href = await Widget.dom.attr(linkEl, "href");
      const title = await Widget.dom.attr(linkEl, "title");
      const imgEl = Widget.dom.selectFirst(el, "img.image");
      let img = imgEl >= 0 ? await Widget.dom.attr(imgEl, "data-src") : null;

      if (img && img.startsWith("//")) img = "https:" + img;

      // 从链接中提取 IMDb ID（可能需跳转，尝试提取 ttxxxx）
      let imdbId = null;
      const filmSlug = href.split('/').filter(Boolean)[1];
      if (filmSlug) {
        const filmPage = await Widget.http.get("https://letterboxd.com" + href);
        const imdbMatch = filmPage?.data?.match(/www\.imdb\.com\/title\/(tt\d+)/);
        if (imdbMatch) imdbId = imdbMatch[1];
      }

      results.push({
        id: imdbId || href, // fallback 用 href 作为 id
        type: "imdb",
        title: title || "Untitled",
        coverUrl: img,
        description: imdbId ? `IMDb ID: ${imdbId}` : ""
      });
    } catch (e) {
      console.warn("解析单个影片失败", e);
    }
  }

  return results.slice(0, limit);
}
function calculatePagination(params) {
  let page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 20;

  if (typeof params.start !== 'undefined') {
    page = Math.floor(parseInt(params.start) / limit) + 1;
  }

  if (page < 1) page = 1;
  if (limit > 50) throw new Error("单页数量不能超过50");

  const start = (page - 1) * limit;
  return { page, limit, start };
}
