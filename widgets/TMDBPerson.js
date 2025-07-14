var WidgetMetadata = {
  id: "person.movie.tmdb",
  title: "TMDB人物影视作品",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "获取 TMDB 人物相关影视作品数据",
  author: "HAO HSIN MA",
  site: "https://github.com/Joy2009ma1995/ForwardWidgets",
  cacheDuration: 86400,
  modules: [
    {
      title: "人物影视作品",
      functionName: "loadPersonMovies",
      params: [
        {
          name: "person_id",
          title: "TMDB人物ID",
          type: "string",
          default: "1539646" // 唐艺昕
        },
        {
          name: "page",
          title: "页码",
          type: "number",
          default: 1
        },
        {
          name: "api_key",
          title: "TMDB API Key",
          type: "string",
          default: ""
        }
      ]
    }
  ]
};
async function loadPersonMovies(params) {
  const { person_id, page = 1, api_key } = params;
  if (!person_id || !api_key) return [];

  const creditsUrl = `https://api.themoviedb.org/3/person/${person_id}/combined_credits?api_key=${api_key}&language=zh-CN`;
  const res = await fetch(creditsUrl);
  if (!res.ok) return [];

  const data = await res.json();
  if (!data.cast) return [];

  // 按发布日期排序
  const sorted = data.cast
    .filter(item => item.release_date || item.first_air_date)
    .sort((a, b) => {
      const dateA = new Date(a.release_date || a.first_air_date || "1900-01-01");
      const dateB = new Date(b.release_date || b.first_air_date || "1900-01-01");
      return dateB - dateA;
    });

  // 分页
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paged = sorted.slice(start, end);

  // 格式化结果
  return paged.map(item => {
    const title = item.title || item.name;
    const year = (item.release_date || item.first_air_date || "").slice(0, 4);
    const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "";
    const imdbId = item.id; // 可用于跳转 TMDB 链接或扩展查 IMDb
    const type = item.media_type === "movie" ? "电影" : "电视剧";
    const role = item.character || "演员";

    return {
      title: `${title} (${year})`,
      description: `${type} / ${role}`,
      pictureUrl: poster,
      url: `https://www.themoviedb.org/${item.media_type}/${item.id}`
    };
  });
}
