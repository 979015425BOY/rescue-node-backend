# NestJS + TypeScript + MySQL 项目框架

基于 NestJS、TypeScript 和 MySQL 构建的现代化后端 API 框架。

## 🚀 特性

- ✅ **NestJS** - 企业级 Node.js 框架
- ✅ **TypeScript** - 类型安全的 JavaScript
- ✅ **MySQL** - 关系型数据库
- ✅ **TypeORM** - 强大的 ORM 框架
- ✅ **Swagger** - 自动生成 API 文档
- ✅ **全局异常处理** - 统一错误处理机制
- ✅ **请求日志** - 详细的请求日志记录
- ✅ **数据验证** - 基于 class-validator 的数据验证
- ✅ **CORS 支持** - 跨域资源共享
- ✅ **环境配置** - 灵活的环境变量管理

## 📁 项目结构

```
src/
├── common/                 # 公共模块
│   ├── filters/           # 全局异常过滤器
│   ├── interceptors/      # 拦截器
│   └── pipes/             # 管道
├── dto/                   # 数据传输对象
├── entities/              # 数据库实体
├── modules/               # 业务模块
│   └── users/            # 用户模块（CRUD 示例）
├── app.module.ts         # 应用主模块
└── main.ts               # 应用入口
```

## 🛠️ 安装和运行

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并配置数据库连接：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 应用配置
APP_PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=nodeMysql
```

### 3. 创建数据库

```bash
# 创建数据库（如果不存在）
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS nodeMysql;"
```

### 4. 启动应用

```bash
# 开发模式
pnpm run start:dev

# 生产模式
pnpm run build
pnpm run start:prod
```

## 📚 API 文档

启动应用后，访问以下地址查看 API 文档：

- **应用地址**: http://localhost:3000
- **API 文档**: http://localhost:3000/api

## 🔧 可用脚本

```bash
# 开发
pnpm run start:dev          # 开发模式启动
pnpm run start:debug        # 调试模式启动

# 构建
pnpm run build              # 构建项目
pnpm run start:prod         # 生产模式启动

# 测试
pnpm run test               # 运行单元测试
pnpm run test:e2e           # 运行端到端测试
pnpm run test:cov           # 运行测试覆盖率

# 代码质量
pnpm run lint               # 代码检查
pnpm run format             # 代码格式化
```

## 📊 API 端点

### 用户管理 (Users)
- `GET /users` - 获取所有用户
- `GET /users/:id` - 获取指定用户
- `POST /users` - 创建用户
- `PATCH /users/:id` - 更新用户
- `DELETE /users/:id` - 删除用户

## 🗄️ 数据库模型

### User (用户)
- `id` - 主键
- `username` - 用户名（唯一）
- `email` - 邮箱（唯一）
- `password` - 密码
- `nickname` - 昵称（可选）
- `avatar` - 头像（可选）
- `bio` - 个人简介（可选）
- `isActive` - 是否激活
- `createdAt` - 创建时间
- `updatedAt` - 更新时间

## 🔒 安全特性

- **数据验证**: 使用 class-validator 进行请求数据验证
- **密码加密**: 使用 bcrypt 进行密码哈希
- **全局异常处理**: 统一的错误响应格式
- **CORS 配置**: 跨域请求安全控制

## 🚀 部署

### Docker 部署（推荐）

```bash
# 构建镜像
docker build -t nestjs-mysql-app .

# 运行容器
docker run -p 3000:3000 nestjs-mysql-app
```

### 传统部署

```bash
# 构建项目
pnpm run build

# 启动生产服务
pnpm run start:prod
```

## 📝 开发指南

### 添加新模块

1. 创建模块目录：`src/modules/your-module/`
2. 创建实体：`src/entities/your-entity.entity.ts`
3. 创建 DTO：`src/dto/create-your-entity.dto.ts`
4. 创建服务：`src/modules/your-module/your-module.service.ts`
5. 创建控制器：`src/modules/your-module/your-module.controller.ts`
6. 创建模块：`src/modules/your-module/your-module.module.ts`
7. 在 `app.module.ts` 中导入新模块

### 数据库迁移

项目使用 TypeORM 的 `synchronize` 选项在开发环境中自动同步数据库结构。生产环境建议使用迁移文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)
