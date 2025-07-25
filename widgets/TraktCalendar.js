var WidgetMetadata = {
  id: "TraktCalendar",
  title: "TMDB + Trakt 日曆",
  description: "顯示即將播出的影集或電影 (無需Trakt API)",
  author: "Joey",
  site: "https://trakt.tv",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "Calendar Shows",
      functionName: "getCalendarShows",
      params: [
        { name: "lang", type: "string", default: "zh-TW" },
        { name: "limit", type: "number", default: 20 }
      ]
    },
    {
      title: "Calendar Movies",
      functionName: "getCalendarMovies",
      params: [
        { name: "lang", type: "string", default: "zh-TW" },
        { name: "limit", type: "number", default: 20 }
      ]
    }
  ]
};

const TMDB_KEY = "你的TMDB_API_KEY";
const CACHE_TTL = 60 * 30; // 30分鐘快取

// 影集 - Airing Today + Upcoming
async function getCalendarShows(params) {
  const lang = params.lang || "zh-TW";
  const limit = params.limit || 20;

  const url = `https://api.themoviedb.org/3/tv/airing_today?api_key=${TMDB_KEY}&language=${lang}`;
  const cacheKey = `tmdb_calendar_shows_${lang}`;
  
  let data = await Widget.cache.get(cacheKey);
  if (!data) {
    const res = await Widget.http.get(url);
    data = res.data?.results || [];
    await Widget.cache.set(cacheKey, data, CACHE_TTL);
  }

  return data.slice(0, limit).map(show => ({
    id: `tv_${show.id}`,
    type: "link",
    title: show.name,
    subtitle: show.first_air_date || "",
    image: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : "",
    link: `https://www.themoviedb.org/tv/${show.id}`
  }));
}

// 電影 - Upcoming
async function getCalendarMovies(params) {
  const lang = params.lang || "zh-TW";
  const limit = params.limit || 20;

  const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_KEY}&language=${lang}`;
  const cacheKey = `tmdb_calendar_movies_${lang}`;
  
  let data = await Widget.cache.get(cacheKey);
  if (!data) {
    const res = await Widget.http.get(url);
    data = res.data?.results || [];
    await Widget.cache.set(cacheKey, data, CACHE_TTL);
  }

  return data.slice(0, limit).map(movie => ({
    id: `movie_${movie.id}`,
    type: "link",
    title: movie.title,
    subtitle: movie.release_date || "",
    image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "",
    link: `https://www.themoviedb.org/movie/${movie.id}`
  }));
}
