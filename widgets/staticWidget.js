// 靜態生成的 ForwardWidget 模塊示例
var WidgetMetadata = {
  id: "staticWidget",
  title: "靜態 ForwardWidget 模塊",
  description: "使用靜態數據生成的 ForwardWidget 範例",
  author: "Joey",
  site: "https://example.com",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "靜態數據列表",
      functionName: "getStaticData",
      params: []
    }
  ]
};

// 在此定義所有靜態項目
const STATIC_DATA = [
  {
    id: "item_1",
    type: "link",
    title: "範例連結一",
    image: "https://example.com/image1.jpg",
    desc: "這是一個靜態生成的示例項目。"
  },
  {
    id: "item_2",
    type: "link",
    title: "範例連結二",
    image: "https://example.com/image2.jpg",
    desc: "第二個示例項目。"
  }
  // 如需更多項目，可在此添加
];

/**
 * 返回靜態數據
 * @returns {Array<Object>} 靜態項目列表
 */
async function getStaticData() {
  // 若有需要，可在此過濾、排序或轉換 STATIC_DATA
  return STATIC_DATA;
}

// 與 ForwardWidget 平台整合：
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WidgetMetadata,
    getStaticData
  };
} else {
  // 瀏覽器環境下暴露到全域變數
  window.WidgetMetadata = WidgetMetadata;
  window.getStaticData = getStaticData;
}
