var WidgetMetadata = {
  id: "oscarAwards",
  title: "奧斯卡獎歷屆名單",
  description: "抓取 Douban 上每年奧斯卡得獎名單",
  author: "Joey",
  site: "https://www.imdb.com/event/ev0000003/",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      id: "oscarsByYear",
      title: "年份查詢",
      description: "輸入屆數抓取該年獎項",
      params: [
        {
          name: "edition",
          type: "input",
          title: "屆數",
          default: "96",
          description: "第幾屆奧斯卡（如 96 表示2024年）"
        }
      ],
      functionName: "loadOscarByDouban"
    }
  ]
};

async function loadOscarByDouban({ edition }) {
  const url = `https://movie.douban.com/awards/oscar/${edition}/`;
  const html = await fetchText(url);
  return parseDoubanOscarHTML(html, edition);
}

function parseDoubanOscarHTML(html, edition) {
  const $ = cheerio.load(html);
  const items = [];

  $(".award").each((_, awardBlock) => {
    const category = $(awardBlock).find("h2").text().trim();
    const li = $(awardBlock).find("ul > li");

    li.each((i, el) => {
      const a = $(el).find("a");
      const title = a.text().trim();
      const href = a.attr("href") || "";
      const idMatch = href.match(/subject\/(\d+)/);
      const id = idMatch?.[1];

      if (id && title) {
        items.push({
          id,
          title,
          category,
          type: "movie",
          award: i === 0 ? "winner" : "nominee",
          edition: parseInt(edition)
        });
      }
    });
  });

  return items;
}
