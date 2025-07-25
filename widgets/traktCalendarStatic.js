var WidgetMetadata = {
  id: "traktCalendarStatic",
  title: "Trakt 靜態日曆",
  description: "示範版：靜態 Trakt Calendar（5 筆資料）",
  author: "Joey",
  site: "https://trakt.tv",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "即將播出",
      functionName: "getStaticCalendar",
      params: []
    }
  ]
};

// 這裡是示範用的靜態資料（5 筆）
const STATIC_CALENDAR = [
  {
    title: "House of the Dragon",
    subtitle: "S02E06",
    date: "2025-07-27",
    image: "https://image.tmdb.org/t/p/w500/8OrhMZWq9zK2LtpQikF9e8puCw2.jpg",
    link: "https://trakt.tv/shows/house-of-the-dragon"
  },
  {
    title: "The Boys",
    subtitle: "S04E08",
    date: "2025-07-28",
    image: "https://image.tmdb.org/t/p/w500/4G1tG2zj2W0dqQ7D7JtU0ZfM0cC.jpg",
    link: "https://trakt.tv/shows/the-boys"
  },
  {
    title: "Stranger Things",
    subtitle: "S05E01",
    date: "2025-07-29",
    image: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    link: "https://trakt.tv/shows/stranger-things"
  },
  {
    title: "Loki",
    subtitle: "S03E02",
    date: "2025-07-30",
    image: "https://image.tmdb.org/t/p/w500/6ELCZlTA5lGUops70hKdB83WJxH.jpg",
    link: "https://trakt.tv/shows/loki"
  },
  {
    title: "Andor",
    subtitle: "S02E10",
    date: "2025-07-31",
    image: "https://image.tmdb.org/t/p/w500/59SVNwLfoMnZPPB6ukW6dlPxAdI.jpg",
    link: "https://trakt.tv/shows/andor"
  }
];

async function getStaticCalendar() {
  return STATIC_CALENDAR.map(item => ({
    id: `calendar_${item.title}_${item.date}`,
    type: "link",
    title: item.title,
    subtitle: `${item.subtitle} | ${item.date}`,
    image: item.image,
    link: item.link
  }));
}
