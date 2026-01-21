# 🎨 圖片編輯器 Image Editor

 [github page](https://waynelin0128.github.io/imageEditWeb/)
 
線上圖片編輯器，使用純 HTML、CSS 和 JavaScript 開發。

## ✨ 功能特色

### 基本編輯工具
- 📁 **圖片上傳** - 支援 JPG、PNG、GIF 格式
- ✂️ **裁切** - 拖曳選擇裁切區域
- 🔄 **旋轉** - 90度順時針旋轉
- 🔃 **翻轉** - 水平/垂直翻轉
- 📏 **調整大小** - 自訂寬度和高度（可保持比例）

### 濾鏡與效果
- 🌈 **即時調整**
  - 亮度 (-100 到 100)
  - 對比度 (-100 到 100)
  - 飽和度 (0 到 200)
  - 色相 (0 到 360度)
- ✨ **預設濾鏡**
  - 灰階
  - 復古
  - 鮮豔
  - 反轉

### 繪圖工具
- ✏️ **畫筆** - 自由繪圖（可調顏色和筆刷大小 1-50px）
- 📝 **文字** - 添加文字（可調字體大小 10-100px 和顏色）
- 🔲 **形狀** - 矩形和圓形（可選填充或邊框）

### 操作控制
- ↩️ **撤銷** (Ctrl+Z) - 返回上一步
- ↪️ **重做** (Ctrl+Y) - 重做已撤銷的操作
- 🔄 **重置** - 恢復原始圖片
- 💾 **下載** - 儲存編輯後的圖片（PNG 格式）

## 🎨 設計特色

- 🌙 現代深色主題
- ✨ 漸變背景與動畫效果
- 🔮 玻璃擬態效果 (Glassmorphism)
- 📱 響應式設計
- 🎯 直觀的使用者介面
- ⚡ 流暢的過渡動畫

## 🚀 使用方法

### 本地運行

1. 克隆或下載此專案
```bash
git clone <你的 GitHub 倉庫 URL>
cd imageEditWeb
```

2. 使用本地伺服器開啟（推薦）
```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js http-server
npx http-server ./
```

3. 在瀏覽器中開啟 `http://localhost:8000`

### GitHub Pages 部署

1. 將專案推送到 GitHub 倉庫

2. 在 GitHub 倉庫設定中：
   - 前往 Settings > Pages
   - Source 選擇 `main` 分支
   - Folder 選擇 `/root`
   - 點擊 Save

3. 幾分鐘後，你的網站將在 `https://<你的用戶名>.github.io/<倉庫名稱>/` 上線

## 📖 操作指南

1. **上傳圖片**
   - 點擊「選擇圖片」按鈕
   - 或點擊工具列的「上傳」按鈕

2. **使用編輯工具**
   - 點擊右側工具列選擇要使用的工具
   - 相應的控制面板會在下方顯示

3. **裁切圖片**
   - 選擇裁切工具
   - 在畫布上拖曳選擇區域
   - 按 Enter 確認，Escape 取消

4. **繪圖和添加元素**
   - 繪圖：選擇畫筆工具，在畫布上拖曳繪製
   - 文字：輸入文字後，點擊畫布放置位置
   - 形狀：在畫布上拖曳繪製形狀

5. **調整濾鏡**
   - 選擇濾鏡工具
   - 使用滑桿即時調整效果

6. **下載結果**
   - 點擊「下載」按鈕
   - 圖片將以 PNG 格式保存

## 🛠️ 技術架構

- **HTML5** - 語義化結構和 Canvas API
- **CSS3** - 現代化設計、CSS Grid、Flexbox、動畫
- **JavaScript (ES6+)** - Canvas 操作、事件處理、狀態管理
- **Google Fonts** - Inter 字體提升視覺品質

## 📁 專案結構

```
imageEditWeb/
├── index.html      # 主頁面
├── style.css       # 樣式表
├── script.js       # JavaScript 邏輯
└── README.md       # 專案說明
```

## 🌐 瀏覽器支援

- Chrome (推薦)
- Firefox
- Edge
- Safari

## 📝 授權

MIT License - 自由使用和修改

## 🤝 貢獻

歡迎提交 Issues 和 Pull Requests！

---

Made with ❤️ using vanilla HTML, CSS, and JavaScript
