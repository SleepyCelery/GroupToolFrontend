# 分组工具 2.0 前端

这是一个基于 Vue 3 + Vite + TypeScript 开发的分组工具前端，可以帮助用户快速创建和管理分组，后端在这里：[分组工具 2.0 后端](https://github.com/SleepyCelery/GroupToolBackend)

## 主要功能

- 创建新的分组
  - 支持自定义分组名称
  - 可选择分组模式（按组数均分或按每组数量）
  - 支持公开/私有分组设置
  - 可自定义元素池或使用热门元素
- 查看分组详情
  - 显示分组ID、创建时间、分组名称等信息
  - 展示分组结果
  - 支持复制分享链接
- 分组分享
  - 通过剪贴板自动检测分享链接
  - 支持密码保护的私有分组
- 响应式设计
  - 适配移动端和桌面端
  - 自动调整布局

## 技术栈

- 前端框架：Vue 3
- UI 组件库：Naive UI
- 状态管理：Pinia
- 构建工具：Vite
- 类型检查：TypeScript
- 代码规范：ESLint + Prettier

## 部署说明

1. 确保已安装 Node.js (版本 >= 16.0.0)
2. 克隆项目仓库：`git clone https://github.com/SleepyCelery/GroupToolFrontend`
3. 安装依赖：`npm install`
4. 配置环境变量：
   - 修改 `.env.production` 文件
   - 设置 `VITE_SERVER_URL` 为完整后端服务地址
5. 构建项目：终端运行 `npm run build`
6. 部署生成的 `dist` 目录到 Web 服务器，如 Nginx 等，推荐使用 HTTPS 以确保功能完整

## 注意事项

1. 项目使用 TypeScript 开发，`.vue` 文件的类型支持需要 Volar 插件
2. 生产环境部署时请确保配置正确的后端服务地址
3. 分享链接功能需要浏览器支持 Clipboard API

## 许可证

MIT License
