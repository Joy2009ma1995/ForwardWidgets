var WidgetMetadata = {
  id: "staticWidget",
  title: "靜態電影或劇集模塊",
  description: "靜態展示電影或劇集資訊",
  author: "Joey",                 // 作者
  site: "https://example.com",    // 網站地址
  version: "1.0.0",              // Widget 版本
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "靜態內容",
      functionName: "getStaticContent",
      params: [] // 不需要參數
    }
  ]
};

async function getStaticContent() {
  // 靜態數據
  const staticData = [
    {
      id: "749170",
      type:"tmdb",
      title: "國家元首",
      description:"英國首相與美國總統之間的私人恩怨危及兩國關係。然而兩人被強大的敵人鎖定，被迫相依為命，踏上瘋狂的跨國逃亡之旅。在軍情六處菁英幹員諾兒的幫助下，兩國元首必須設法打擊威脅自由世界的巨大陰謀。",
      releaseDate:"2025/07/02",
      backropPath:"/vJbEUMeI2AxBUZKjP6ZVeVNNTLh.jpg",
      posterPath: "/gsp6imDEkBtJV0BZ1HMdEcG9UH7.jpg",
      mediatype: "movie"
    }
  ];

  return staticData.map(item => ({
    id: item.id,
    title: item.title,
    image: item.poster,
    type: item.type
  }));
}
