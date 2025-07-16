// forward.letterboxdlist.js
var WidgetMetadata = {
  id: "letterboxdlist",
  title: "Letterboxd 片單",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "從 Letterboxd 片單頁面擷取電影資料 (IMDb ID)，無需 API Key",
  author: "Joey",
  site: "",
  modules: [
    {
      id: "list",
      title: "Letterboxd 片單擷取",
      description: "從 Letterboxd 使用者清單擷取 IMDb ID",
      params: [
        {
          name: "url",
          type: "input",
          title: "100 ‘Must Watches’",
          default: "https://letterboxd.com/rodneyfilm/list/100-must-watches/"
        },
        { name: "page", title: "页码", type: "page" },
        { name: "limit", title: "🔢 每页数量", type: "constant", value: "50" }
      ],
      cacheDuration: 3600,

      function calculatePagination(params) {
      let page = parseInt(params.page) || 1;
      const limit = parseInt(params.limit) || 50;
    
      if (typeof params.start !== 'undefined') {
        page = Math.floor(parseInt(params.start) / limit) + 1;
      }
    
      if (page < 1) page = 1;
      if (limit > 50) throw new Error("单页数量不能超过50");

      const start = (page - 1) * limit;
      return { page, limit, start };
    }
      async function({ url }, ctx) {
        const { start, limit } = calculatePagination(params);
        const html = await ctx.fetchText(url);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const items = [...doc.querySelectorAll(".poster-list a[href*='/film/']")].map(a => {
          const href = a.getAttribute("href");
          const idMatch = href.match(/\/film\/([^\/]+)\//);
          const title = a.getAttribute("data-film-name") || a.title;
          return {
            title,
            letterboxdUrl: `https://letterboxd.com${href}`
          };
        });

        const result = [];
        for (const item of items) {
          try {
            const filmPage = await ctx.fetchText(item.letterboxdUrl);
            const imdbMatch = filmPage.match(/href=\"https:\/\/www.imdb.com\/title\/(tt\d+)/);
            if (imdbMatch) {
              result.push({
                id: imdbMatch[1],
                title: item.title,
                url: item.letterboxdUrl
              });
            }
          } catch (e) {
            ctx.log("解析失敗:", item.letterboxdUrl, e);
          }
        }

        return result;
      }
    }
  ]
};

export default WidgetMetadata;
