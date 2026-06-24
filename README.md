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

这些 Markdown 是为了部署自包含而复制进来的快照。后续如果总表或专题页继续更新，需要同步复制到 `docs/`。
