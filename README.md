# 食品标签审核软件 (Food Label Review System)

一个用于审核预包装食品、食用农产品和进口食品标签合规性的完整解决方案。

## 功能特性

- 🔐 用户认证与权限管理 (10人团队)
- 📸 标签图片上传与OCR识别
- ✅ 自动合规审核 (基于GB 7718、GB 28050等标准)
- 📊 审核报告生成
- 🖥️ 桌面应用支持 (Electron)

## 技术栈

### 前端
- React 18 + TypeScript
- Ant Design 5.x
- Vite
- React Router

### 后端
- NestJS + TypeScript
- Prisma ORM
- SQLite数据库
- JWT认证
- 文件上传处理

### 桌面端
- Electron

## 快速开始

### 环境要求
- Node.js >= 18
- pnpm >= 8
- Python 3.x (用于文件写入脚本)

### 安装依赖
```bash
pnpm install
```

### 数据库初始化
```bash
pnpm --filter server prisma:generate
pnpm --filter server prisma:migrate
```

### 启动开发服务器
```bash
pnpm dev
```

应用将在以下地址运行：
- 前端: http://localhost:3000
- 后端: http://localhost:3001
- API文档: http://localhost:3001/api/docs

## 项目结构

```
food-label-review/
├── server/          # NestJS 后端
├── web/             # React 前端
├── electron/        # Electron 桌面应用
├── package.json     # Monorepo 根配置
└── turbo.json       # Turborepo 配置
```

## 食品类型支持

### 预包装食品 (GB 7718)
- 食品名称规范性
- 配料表完整性 (递减顺序排列、过敏原提示)
- 净含量和规格格式
- 生产者/经销者信息
- 生产日期和保质期
- 贮存条件
- 食品生产许可证编号 (SC编号)
- 产品标准代号
- 营养成分表 (GB 28050)
- 过敏原提示

### 食用农产品
- 产品名称
- 产地
- 生产者/销售者信息
- 生产日期
- 保质期

### 进口食品
- 原产国/地区
- 国内进口商/经销商信息
- 中文标签完整性
- 原文标签信息对照

## 审核流程

1. **上传标签图片** - 支持拖拽上传，自动保存到服务器
2. **OCR识别** - 模拟OCR识别 (可接入百度OCR、腾讯OCR等)
3. **自动审核** - 根据食品类型和法规库自动检查合规性
4. **人工复核** - 审核人员可查看检查项、法规依据和修改建议
5. **生成报告** - 导出JSON格式的审核报告

## 用户角色

- **admin** - 系统管理员，管理用户和法规库
- **reviewer** - 审核员，执行标签审核
- **viewer** - 查看者，仅查看审核结果

## 开发说明

### 后端API
- `POST /api/auth/login` - 用户登录
- `POST /api/labels/upload` - 上传标签图片
- `POST /api/labels/:id/ocr` - 触发OCR识别
- `GET /api/labels` - 获取标签列表
- `GET /api/reviews` - 获取审核列表
- `POST /api/reviews/:id/process` - 执行审核
- `GET /api/reports/:id` - 获取审核报告

### 数据库
使用Prisma ORM，数据模型包括：
- User (用户)
- Label (标签)
- Review (审核)
- ReviewItem (审核项)
- Regulation (法规)
- Report (报告)

## License

MIT
