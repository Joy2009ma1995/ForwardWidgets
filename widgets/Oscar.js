var WidgetMetadata = {
  id: "oscarAwards",
  title: "奧斯卡獎歷屆名單",
  description: "抓取 IMDb 上每年奧斯卡得獎名單",
  author: "你自己",
  site: "https://www.imdb.com/event/ev0000003/",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      id: "oscarYear",
      title: "奧斯卡得獎名單",
      functionName: "loadOscarWinners",
      params: [
        {
          name: "year",
          type: "input",
          title: "年份",
          default: "2025",
          description: "例如輸入 2024"
        }
      ]
    }
  ]
};

async function loadOscarWinners({ year }) {
  const url = `https://www.imdb.com/event/ev0000003/${year}/1`;
  const html = await fetchText(url);
  return parseOscarHTML(html);
}

function parseOscarHTML(html) {
  const $ = cheerio.load(html);
  const items = [];

  $(".event-widgets__award").each((_, section) => {
    const category = $(section).find(".event-widgets__award-name").text().trim();
    const winner = $(section).find(".event-widgets__award-winner .ipc-metadata-list-summary-item");

    winner.each((_, item) => {
      const href = $(item).find("a.ipc-metadata-list-summary-item__t").attr("href") || "";
      const idMatch = href.match(/\/title\/(tt\d+)/);
      const id = idMatch ? idMatch[1] : null;
      const title = $(item).find("a.ipc-metadata-list-summary-item__t").text().trim();

      if (id && title) {
        items.push({
          id,
          title,
          category,
          type: "movie"
        });
      }
    });
  });

  return items;
}
