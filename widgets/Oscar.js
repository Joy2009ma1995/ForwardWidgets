WidgetMetadata = {
    id: "Letterboxd",
    title: "Letterboxd片單-奧斯卡",
    modules: [
        {
            id: "letterboxdList",
            title: "Letterboxd片单",
            requiresWebView: false,
            functionName: "loadListItems",
            cacheDuration: 86400,
            params: [
                {
                    name: "input_type",
                    title: "输入类型",
                    type: "enumeration",
                    value: "select",
                    enumOptions: [
                        {title: "筛选", value: "select"},
                        {title: "自定义", value: "customize"},
                    ],
                },
                {
                    name: "list_select",
                    title: "片单完整URL",
                    type: "enumeration",
                    description: "如：https://letterboxd.com/crew/list/2024-highest-rated-films/",
                    belongTo: {
                        paramName: "input_type",
                        value: ["select"],
                    },
                    enumOptions: [
                        {
                            title: "奧斯卡獲獎影片：最佳影片",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-best-picture/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳男主角",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-actor-in-a-leading-role/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳女主角",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-actress-in-a-leading/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳男配角",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-actor-in-a-supporting/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳女配角",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-actress-in-a-supporting/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳導演",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-director/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳電影剪輯",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-film-editing/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳攝影",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-cinematography/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳原創劇本",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-original-screenplay/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳改編劇本",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-adapted-screenplay/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳製作設計",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-production-design/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳服裝設計",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-costume-design/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳化妝和髮型設計",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-makeup-and-hairstyling/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳視覺效果",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-visual-effects/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳聲音",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-sound/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳原創配樂",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-original-score/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳原創歌曲",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-original-song/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳動畫短片",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-animated-short/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳真人短片",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-live-action-short/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳國際長片",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-international-feature/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳紀錄片長片",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-documentary-feature/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳紀錄片短片",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-documentary-short/"
                        },
                        {
                            title: "奧斯卡獲獎影片：最佳動畫長片",
                            value: "https://letterboxd.com/oscars/list/oscar-winning-films-animated-feature/"
                        },
                    ],
                },
                {
                    name: "url_customize",
                    title: "自定义片单",
                    type: "input",
                    belongTo: {
                        paramName: "input_type",
                        value: ["customize"],
                    },
                    description: "自定义片单，如：https://letterboxd.com/crew/list/2024-highest-rated-films/",
                },
                {
                    name: "sort_by",
                    title: "排序",
                    type: "enumeration",
                    value: "default",
                    enumOptions: [
                        {
                            title: "默认排序",
                            value: "default",
                        },
                        {
                            title: "反序",
                            value: "reverse",
                        },
                        {
                            title: "名称",
                            value: "name",
                        },
                        {
                            title: "流行度",
                            value: "popular",
                        },
                        {
                            title: "随机",
                            value: "shuffle",
                        },
                        {
                            title: "最后添加",
                            value: "added",
                        },
                        {
                            title: "最早添加",
                            value: "added-earliest",
                        },
                        {
                            title: "最新发行",
                            value: "release",
                        },
                        {
                            title: "最早发行",
                            value: "release-earliest",
                        },
                        {
                            title: "最高评分",
                            value: "rating",
                        },
                        {
                            title: "最低评分",
                            value: "rating-lowest",
                        },
                        {
                            title: "最短时长",
                            value: "shortest",
                        },
                        {
                            title: "最长时长",
                            value: "longest",
                        },
                    ],
                },
                {
                    name: "genre",
                    title: "类型",
                    type: "enumeration",
                    value: "default",
                    enumOptions: [
                        {
                            title: "所有类型",
                            value: "default",
                        },
                        {
                            title: "动作",
                            value: "action",
                        },
                        {
                            title: "冒险",
                            value: "adventure",
                        },
                        {
                            title: "动画",
                            value: "animation",
                        },
                        {
                            title: "喜剧",
                            value: "comedy",
                        },
                        {
                            title: "犯罪",
                            value: "crime",
                        },
                        {
                            title: "纪录片",
                            value: "documentary",
                        },
                        {
                            title: "戏剧",
                            value: "drama",
                        },
                        {
                            title: "家庭",
                            value: "family",
                        },
                        {
                            title: "奇幻",
                            value: "fantasy",
                        },
                        {
                            title: "历史",
                            value: "history",
                        },
                        {
                            title: "恐怖",
                            value: "horror",
                        },
                        {
                            title: "音乐",
                            value: "music",
                        },
                        {
                            title: "神秘",
                            value: "mystery",
                        },
                        {
                            title: "浪漫",
                            value: "romance",
                        },
                        {
                            title: "科幻",
                            value: "science-fiction",
                        },
                        {
                            title: "惊悚",
                            value: "thriller",
                        },
                        {
                            title: "电视电影",
                            value: "tv-movie",
                        },
                        {
                            title: "战争",
                            value: "war",
                        },
                        {
                            title: "西部",
                            value: "western",
                        }
                    ],
                },
                {
                    name: "decade",
                    title: "年代",
                    type: "enumeration",
                    value: "default",
                    enumOptions: [
                        {
                            title: "所有年代",
                            value: "default",
                        },
                        {
                            title: "2020年代",
                            value: "2020s",
                        },
                        {
                            title: "2010年代",
                            value: "2010s",
                        },
                        {
                            title: "2000年代",
                            value: "2000s",
                        },
                        {
                            title: "1990年代",
                            value: "1990s",
                        },
                        {
                            title: "1980年代",
                            value: "1980s",
                        },
                        {
                            title: "1970年代",
                            value: "1970s",
                        },
                        {
                            title: "1960年代",
                            value: "1960s",
                        },
                        {
                            title: "1950年代",
                            value: "1950s",
                        },
                        {
                            title: "1940年代",
                            value: "1940s",
                        },
                        {
                            title: "1930年代",
                            value: "1930s",
                        },
                        {
                            title: "1920年代",
                            value: "1920s",
                        },
                        {
                            title: "1910年代",
                            value: "1910s",
                        },
                        {
                            title: "1900年代",
                            value: "1900s",
                        },
                        {
                            title: "1890年代",
                            value: "1890s",
                        },
                        {
                            title: "1880年代",
                            value: "1880s",
                        },
                        {
                            title: "1870年代",
                            value: "1870s",
                        }
                    ],
                },
                {
                    name: "page",
                    title: "页码",
                    type: "page"
                },
            ],
        },
    ],
    version: "1.0.0",
    requiredVersion: "0.0.1",
    description: "解析Letterboxd片单内的影片",
    author: "Joy",
    site: "https://github.com/Ma98hao04hsin15/ForwardWidgets"
};

function extractLetterboxdUrlsFromResponse(responseData, minNum, maxNum) {
    // 创建Cheerio实例解析HTML
    let $ = Widget.html.load(responseData);

    // 定位所有包含data-target-link属性的影片容器div
    // 选择器匹配：li.poster-container 下的 div.film-poster（包含data-target-link属性）
    let filmContainers = $('li.poster-container div.film-poster[data-target-link]');

    if (!filmContainers.length) {
        throw new Error("未找到包含data-target-link属性的电影容器");
    }

    // 提取并去重URL（从data-target-link属性获取，拼接完整域名）
    let letterboxdUrls = Array.from(new Set(
        filmContainers
            .map((i, el) => {
                // 获取data-target-link属性值（影片相对路径）
                const targetLink = $(el).data('target-link') || $(el).attr('data-target-link');
                // 过滤无效链接（确保路径以/film/开头，符合Letterboxd影片页规则）
                if (!targetLink || !targetLink.startsWith('/film/')) {
                    console.warn(`无效的影片链接属性值：${targetLink}`);
                    return null;
                }
                return `https://letterboxd.com${targetLink}`;
            })
            .get()
            .filter(Boolean) // 移除null值
    ));

    // 处理边界情况，确保索引在有效范围内
    const start = Math.max(0, minNum - 1);
    const end = Math.min(maxNum, letterboxdUrls.length);
    return letterboxdUrls.slice(start, end);
}

async function fetchImdbIdsFromLetterboxdUrls(letterboxdUrls) {
    let imdbIdPromises = letterboxdUrls.map(async (url) => {
        try {
            let detailResponse = await Widget.http.get(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0",
                },
            });

            // 使用 Widget.html.load 解析详情页
            let $ = Widget.html.load(detailResponse.data);
            let imdbLinkEl = $('a[data-track-action="IMDb"]').first();

            if (!imdbLinkEl.length) return null;

            let href = imdbLinkEl.attr('href');
            let match = href.match(/title\/(tt\d+)/);

            return match ? `${match[1]}` : null;
        } catch {
            return null; // 忽略单个失败请求
        }
    });

    let imdbIds = [...new Set(
        (await Promise.all(imdbIdPromises))
            .filter(Boolean)
            .map((item) => item)
    )].map((id) => ({
        id,
        type: "imdb",
    }));
    console.log("请求imdbIds:", imdbIds);
    return imdbIds;
}

async function fetchLetterboxdData(url, headers = {}, minNum, maxNum) {
    try {
        const response = await Widget.http.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
                ...headers,
            },
        });

        console.log("请求结果:", response.data);

        let letterboxdUrls = extractLetterboxdUrlsFromResponse(response.data, minNum, maxNum);

        return await fetchImdbIdsFromLetterboxdUrls(letterboxdUrls);
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}

async function loadListItems(params = {}) {
    try {
        const page = params.page;
        const inputType = params.input_type || "";
        const listSelect = params.list_select || "";
        const urlCustomize = params.url_customize || "";
        const sortBy = params.sort_by || "default";
        const genre = params.genre || "default";
        const decade = params.decade || "default";
        const count = 20;
        const minNum = ((page - 1) % 5) * count + 1;
        const maxNum = ((page - 1) % 5) * count + 20;
        const letterboxdPage = Math.floor((page - 1) / 5) + 1;

        let listUrl;
        if (inputType === "select") {
            listUrl = listSelect
        } else {
            listUrl = urlCustomize
        }

        if (!listUrl) {
            throw new Error("必须提供 Letterboxd 片单完整URL");
        }

        // 确保 URL 以斜杠结尾，然后附加页面和排序参数
        let baseUrl = listUrl.endsWith('/') ? listUrl : `${listUrl}/`;
        let url = `${baseUrl}page/${letterboxdPage}/`;
        if (decade !== "default") {
            url += `decade/${decade}/`;
        }
        if (genre !== "default") {
            url += `genre/${genre}/`;
        }
        if (sortBy !== "default") {
            url += `by/${sortBy}/`;
        }

        return await fetchLetterboxdData(url, {}, minNum, maxNum);
    } catch (error) {
        console.error("处理失败:", error);
        throw error;
    }
}
