# 减脂执行仪表盘

这是一个可直接部署到 Cloudflare Pages 的纯静态页面。

## 本地预览

直接打开 `index.html` 即可。也可以在本目录启动任意静态服务器。

## Cloudflare Pages 部署

### Direct Upload

1. 打开 Cloudflare Dashboard。
2. 进入 Workers & Pages。
3. 创建 Pages 项目。
4. 选择 Direct Upload。
5. 上传整个项目文件夹。

### 连接仓库

1. 连接 `LetheTK/eatplan` 仓库。
2. Build command 留空。
3. Build output directory 填 `.`。

## 隐私

页面没有后端、没有 API 请求、没有外部脚本。所有计算都在浏览器本地完成。

## 当前数据来源

- `docs/总表-v4.md`
- `docs/主食-健康饮食完整指南_v2.md`
- `docs/每日饮水完整指南.md`
- `docs/蛋白质补充方案-v2.md`
- `docs/水油焖菜手册_v19.md`
- `docs/调料使用速查表_v5.md`

这些 Markdown 是为了部署自包含而复制进来的快照。后续如果总表或专题页继续更新，需要同步复制到 `docs/`。

部署版第二餐的糙米和土豆统一按下锅前生重填写；馒头按个数填写（每个约75g）。页面会根据实际克数或个数动态计算热量和碳水。馒头替代规则：力量/跑步日1个，恢复/休息日0.5–0.75个，不能与米饭或土豆叠加。

三餐时间配置位于 `app.js` 的 `mealTimes`；其人工维护依据为根目录的
`个人作息与三餐时间安排.md`。调整真实作息时，请同步更新这两处。
