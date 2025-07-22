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
          title: "年份",
          type: "select",
          options: [
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020", value: "2020" },
            { title: "2019", value: "2019" },
            { title: "2018", value: "2018" },
            { title: "2017", value: "2017" },
            { title: "2016", value: "2016" },
            { title: "2015", value: "2015" },
            { title: "2014", value: "2014" },
            { title: "2013", value: "2013" },
            { title: "2012", value: "2012" },
            { title: "2011", value: "2011" },
            { title: "2010", value: "2010" }
          ]
        }
      ]
    }
  ]
};
async function loadOscarWinners(params) {
  const year = params.year || "2024";
  const url = `https://www.imdb.com/event/ev0000003/${year}`;

  const html = await $fetch(url);
  const $ = cheerio.load(html);

  const items = [];

  $(".event-widgets__award").each((i, el) => {
    const category = $(el).find("h3").text().trim();

    $(el)
      .find(".event-widgets__award-nomination")
      .each((j, nominationEl) => {
        const isWinner = $(nominationEl).find(".event-widgets__winner-badge").length > 0;
        const title = $(nominationEl).find("a").first().text().trim();
        const link = "https://www.imdb.com" + $(nominationEl).find("a").first().attr("href");

        if (isWinner) {
          items.push({
            title: `${category}：${title}`,
            url: link
          });
        }
      });
  });

  return items;
}
