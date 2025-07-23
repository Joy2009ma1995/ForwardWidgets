WidgetMetadata = {
    id: "Oscar",
    title: "Academy Award of Merit",
    version: "1.2.3",
    requiredVersion: "0.0.1",
    description: "旨在鼓勵過去一年間優秀電影創作、發展獎勵活動，不僅是美國電影業界年度最重要活動，亦是目前最受世界矚目的電影獎之一。",
    author: "Joey",
    modules: [{
        id: "Oscar",
        title: "Academy Award of Merit(Oscar)",
        functionName: "getCollections",
        cacheDuration: 3600,
        params: []
    }]
};

const Oscar_STATIC = [
    {
    "title": "鐵翼雄風",
    "type": "tmdb",
    "year": 1929,
    "tmdbID": 339847,
    "mediaType": "movie",
    "posterPath": "/zT0GvVwLtPS6LaNz4mrb25XHOe3.jpg",
    "backdropPath": "/ygmmnABINfDXQzNgeZdZmmm884E.jpg",
    "category": "最佳影片"
    },
    {
    "title": "百老汇旋律",
    "type": "tmdb",
    "year": 1930,
    "tmdbID": 60882,
    "mediaType": "movie",
    "posterPath": "https://image.tmdb.org/t/p/w500/nDg3fWjJhp0dfBFxyQANfNZy9GL.jpg",
    "category": "最佳影片"
    },
    {
    "title": "奥本海默",
    "type": "tmdb",
    "year": 2024,
    "tmdbID": 872585,
    "mediaType": "movie",
    "backdropPath": "/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg",
    "posterPath": "/a6v21Mgz2w6OQL7ezkQxGbGA92W.jpg",
    "category": "最佳影片"
    },    
    {
    "title": "阿诺拉",
    "type": "tmdb",
    "year": 2025,
    "tmdbID": 1064213,
    "mediaType": "movie",
    "backdropPath": "/kEYWal656zP5Q2Tohm91aw6orlT.jpg",
    "posterPath": "/2dNtTwMvoMGtISS2cTrMB8woqUy.jpg",
    "category": "最佳影片"
    },
];

async function getCollections(params = {}) {
    return getRandomArray(Oscar_STATIC);
}

function getRandomArray(arr) {
    return arr.slice().sort(() => Math.random() - 0.5);
}
