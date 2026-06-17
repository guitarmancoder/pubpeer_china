# 项目上下文

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase PostgreSQL
- **Font**: Noto Serif SC (via next/font/google)

## 项目概述

学术同行评审社区 (PPPR) - 中文版出版后同行评审平台，类似 PubPeer。采用哈佛大学风格设计（哈佛红 #A51C30 + 白色背景 + 极简大气风格）。

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   │   ├── api/            # API 路由
│   │   │   ├── papers/     # 论文相关 API
│   │   │   ├── search/     # 搜索 API
│   │   │   ├── browse/     # 浏览 API
│   │   │   ├── auth/       # 认证 API (login/register/verify)
│   │   │   ├── donations/  # 捐款 API
│   │   │   └── admin/      # 管理 API (stats/comments/users)
│   │   ├── papers/[id]/    # 论文详情页
│   │   ├── search/         # 搜索页
│   │   ├── browse/         # 浏览页
│   │   ├── login/          # 登录页
│   │   ├── register/       # 注册页
│   │   ├── profile/        # 个人资料页
│   │   ├── donate/         # 捐款页
│   │   ├── admin/          # 管理后台
│   │   └── (placeholder pages: blog, journals, institutions, about, etc.)
│   ├── components/         # 共享组件
│   │   ├── ui/             # Shadcn UI 组件库
│   │   ├── Navbar.tsx      # 导航栏
│   │   ├── Footer.tsx      # 页脚
│   │   └── PlaceholderPage.tsx  # 占位页面组件
│   ├── storage/database/   # Supabase 客户端与 Schema
│   └── lib/                # 工具库
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖管理
└── tsconfig.json           # TypeScript 配置
```

## 数据库表结构

- **profiles**: 用户表 (id, email, username, password_hash, display_name, role, is_active)
- **papers**: 论文表 (id, title, authors, doi, pubmed_id, journal, publish_date, abstract, comment_count)
- **comments**: 评论表 (id, paper_id, user_id, parent_id, content, is_anonymous, status)
- **donations**: 捐款表 (id, user_id, amount, donor_name, is_anonymous, message)

## API 接口清单

| 路径 | 方法 | 说明 |
|------|------|------|
| /api/papers | GET | 论文列表 |
| /api/papers | POST | 创建论文 |
| /api/papers/[id] | GET | 论文详情+评论 |
| /api/papers/[id]/comments | POST | 添加评论 |
| /api/search | GET | 搜索论文 |
| /api/browse | GET | 浏览论文 |
| /api/auth/login | POST | 登录 |
| /api/auth/register | POST | 注册 |
| /api/auth/verify | POST | 验证令牌 |
| /api/donations | GET | 捐款列表 |
| /api/donations | POST | 创建捐款 |
| /api/admin/stats | GET | 平台统计 |
| /api/admin/comments | GET | 待审核评论 |
| /api/admin/comments/approve | POST | 通过评论 |
| /api/admin/comments/reject | POST | 拒绝评论 |
| /api/admin/users | GET | 用户列表 |
| /api/admin/users/toggle | POST | 启用/禁用用户 |

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。

## 开发规范

### 编码规范

- 默认按 TypeScript `strict` 心智写代码
- 禁止隐式 `any` 和 `as any`
- 函数参数必须有类型标注

### Hydration 问题防范

1. 动态内容必须使用 'use client' + useEffect + useState
2. 禁止使用 head 标签，优先使用 metadata
3. 三方字体通过 next/font 引入

## 预置账户

- 管理员: admin@pppr.cn / admin123456

## 设计风格

- 主色: 哈佛红 Crimson (#A51C30)
- 标题字体: Noto Serif SC (衬线)
- 正文字体: 系统无衬线字体
- 风格: 极简、大气、学术权威感，大量留白
