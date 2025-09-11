# 静态资源管理平台

本项目是一个基于 **Next.js 13 (App Router)** + **TypeScript** + **Ant Design** 构建的前端应用，主要用于 **静态资源的管理与访问控制**。

---

## 🛠 技术栈

- **Next.js 13 (App Router)**  
  - 使用最新的 App Router 架构
  - API Routes 提供 JSON 数据的增删改查接口
- **React 18 + TypeScript**  
  - 类型安全的组件开发
- **Ant Design**  
  - UI 组件库，提供表格、弹窗、开关、按钮等常用组件
- **Node.js + fs**  
  - 读写本地 JSON 文件，模拟数据库
- **静态资源管理**  
  - 使用 Next.js 内置的 `public/` 目录存放资源
  - JSON 文件中记录资源的路径和访问权限

---

## 🚀 启动项目

### 1. 安装依赖
```bash
npm install
```

### 2. 开发模式运行

```
npm run dev
```

默认运行在 `http://localhost:3000`。
