var WidgetMetadata = {
    id: "IMDbList",
    title: "IMDb 片单",
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "从 IMDb 的 List 中获取影片数据",
    author: "Joey",
    site: "https://github.com/Joy2009ma1995/ForwardWidgets",
    modules: [
        {
          name: "url",
          type: "input",
          title: "IMDb 清單網址",
          default: "https://www.imdb.com/list/ls524226422/"
        }
    ]
};

const axios = require('axios');
const cheerio = require('cheerio');

async function load({ url }) {
  const listId = url.match(/\/list\/(ls\d+)/)?.[1];
  if (!listId) throw new Error("無效的 IMDb 清單網址");

  const baseUrl = `https://www.imdb.com/list/${listId}/`;
  let page = 1;
  let hasNext = true;
  const results = [];

  while (hasNext) {
    const res = await axios.get(`${baseUrl}?page=${page}`, {
      headers: { 'Accept-Language': 'en-US,en;q=0.9', 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(res.data);
    const list = $('.lister-item');

    if (list.length === 0) break;

    list.each((i, el) => {
      const id = $(el).find('.lister-item-image a').attr('href')?.match(/\/title\/(tt\d+)\//)?.[1];
      const title = $(el).find('.lister-item-header a').text().trim();
      const yearText = $(el).find('.lister-item-year').text().trim();
      const year = parseInt(yearText.match(/\d{4}/)?.[0], 10) || null;
      const image = $(el).find('.lister-item-image img').attr('loadlate');
      const rating = parseFloat($(el).find('.ipl-rating-star__rating').first().text()) || null;

      if (id) {
        results.push({
          id,
          title,
          type: 'movie',
          rank: results.length + 1,
          year,
          rating,
          image,
          source: 'imdb'
        });
      }
    });

    const next = $('.desc .next-page');
    hasNext = next.length > 0;
    page++;
  }

  return results;
}

module.exports = { load };
