# 部署指南

本文档详细介绍了如何将 NestJS + TypeScript + MySQL 项目部署到各种云平台。

## 📋 部署前准备

### 1. 环境变量配置

复制 `.env.example` 文件为 `.env` 并配置相应的环境变量：

```bash
cp .env.example .env
```

### 2. 构建项目

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm run build

# 运行测试（可选）
pnpm run test
```

### 3. 健康检查

确保健康检查端点正常工作：

```bash
# 启动开发服务器
pnpm run start:dev

# 测试健康检查
curl http://localhost:3000/health
```

## 🚀 部署选项

### 1. Vercel 部署（推荐用于 Serverless）

#### 前置条件
- 安装 Vercel CLI：`npm i -g vercel`
- 注册 Vercel 账号

#### 部署步骤

1. **配置环境变量**
   ```bash
   # 在 Vercel 项目设置中添加以下环境变量：
   NODE_ENV=production
   DB_HOST=your-database-host
   DB_PORT=3306
   DB_USERNAME=your-username
   DB_PASSWORD=your-password
   DB_DATABASE=nodeMysql
   JWT_SECRET=your-super-secret-jwt-key
   ```

2. **部署命令**
   ```bash
   # 首次部署
   vercel

   # 生产环境部署
   pnpm run deploy:vercel
   ```

3. **数据库选择**
   - **PlanetScale**（推荐）：无服务器 MySQL 平台
   - **Railway MySQL**：简单易用的云数据库
   - **AWS RDS**：企业级数据库解决方案

#### Vercel 配置说明

项目已包含 `vercel.json` 配置文件：
- 使用 `@vercel/node` 运行时
- 最大执行时间：30秒
- 所有请求路由到 `dist/main.js`

### 2. Railway 部署（推荐用于全栈应用）

#### 前置条件
- 安装 Railway CLI：`npm i -g @railway/cli`
- 注册 Railway 账号

#### 部署步骤

1. **初始化 Railway 项目**
   ```bash
   railway login
   railway init
   ```

2. **添加 MySQL 数据库**
   ```bash
   railway add mysql
   ```

3. **配置环境变量**
   ```bash
   # Railway 会自动提供数据库连接信息
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your-super-secret-jwt-key
   ```

4. **部署**
   ```bash
   pnpm run deploy:railway
   ```

### 3. Docker 部署

#### 单容器部署

```bash
# 构建镜像
pnpm run docker:build

# 运行容器
pnpm run docker:run
```

#### Docker Compose 部署（包含 MySQL）

```bash
# 启动所有服务
pnpm run docker:compose

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 停止服务
docker-compose down
```

服务访问地址：
- API 服务：http://localhost:3000
- Swagger 文档：http://localhost:3000/api
- phpMyAdmin：http://localhost:8080

### 4. 传统 VPS 部署

#### 使用 PM2

1. **安装 PM2**
   ```bash
   npm install -g pm2
   ```

2. **创建 PM2 配置文件**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'nodemysql-api',
       script: 'dist/main.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'development'
       },
       env_production: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   };
   ```

3. **部署**
   ```bash
   # 构建项目
   pnpm run build

   # 启动 PM2
   pm2 start ecosystem.config.js --env production

   # 保存 PM2 配置
   pm2 save
   pm2 startup
   ```

## 🗄️ 数据库部署选项

### 1. PlanetScale（推荐）

**优势**：
- 无服务器 MySQL 平台
- 自动扩缩容
- 分支功能（类似 Git）
- 免费套餐

**配置步骤**：
1. 注册 PlanetScale 账号
2. 创建数据库
3. 获取连接字符串
4. 更新环境变量

### 2. Railway MySQL

**优势**：
- 简单易用
- 与 Railway 应用集成
- 自动备份

**配置步骤**：
1. 在 Railway 项目中添加 MySQL
2. 使用自动生成的连接信息

### 3. AWS RDS

**优势**：
- 企业级可靠性
- 多种实例类型
- 自动备份和恢复

**配置步骤**：
1. 创建 RDS MySQL 实例
2. 配置安全组
3. 获取连接信息

### 4. 自托管 MySQL

**使用 Docker**：
```bash
# 启动 MySQL 容器
docker run -d \
  --name mysql-server \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=nodeMysql \
  -p 3306:3306 \
  mysql:8.0
```

## 🔧 环境变量配置

### 必需变量

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |
| `DB_HOST` | 数据库主机 | `localhost` |
| `DB_PORT` | 数据库端口 | `3306` |
| `DB_USERNAME` | 数据库用户名 | `root` |
| `DB_PASSWORD` | 数据库密码 | `password` |
| `DB_DATABASE` | 数据库名称 | `nodeMysql` |
| `JWT_SECRET` | JWT 密钥 | `your-secret-key` |

### 可选变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `APP_PORT` | 应用端口 | `3000` |
| `CORS_ORIGIN` | CORS 允许的源 | `*` |
| `LOG_LEVEL` | 日志级别 | `info` |

## 🔍 监控和日志

### 健康检查

所有部署都包含健康检查端点：
- **URL**: `/health`
- **方法**: GET
- **响应**: JSON 格式的健康状态信息

### 日志监控

推荐的监控工具：
- **Sentry**: 错误追踪
- **New Relic**: 性能监控
- **LogRocket**: 用户会话记录

### 性能监控

```bash
# 检查应用健康状态
pnpm run health

# 查看 PM2 监控
pm2 monit

# Docker 容器监控
docker stats
```

## 🚨 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查数据库连接信息
   - 确认数据库服务正在运行
   - 检查防火墙设置

2. **端口冲突**
   - 修改 `APP_PORT` 环境变量
   - 检查端口是否被占用

3. **构建失败**
   - 清理 node_modules：`rm -rf node_modules && pnpm install`
   - 检查 TypeScript 编译错误

4. **内存不足**
   - 增加服务器内存
   - 优化应用代码
   - 使用 PM2 集群模式

### 调试命令

```bash
# 查看应用日志
docker-compose logs -f app

# 检查容器状态
docker ps

# 进入容器调试
docker exec -it nodemysql-api sh

# PM2 日志
pm2 logs

# 检查端口占用
netstat -tulpn | grep :3000
```

## 📈 性能优化

### 生产环境优化

1. **启用 Gzip 压缩**
2. **使用 CDN**
3. **数据库连接池**
4. **缓存策略**
5. **负载均衡**

### 安全配置

1. **HTTPS 证书**
2. **CORS 配置**
3. **速率限制**
4. **输入验证**
5. **SQL 注入防护**

## 📞 支持

如果在部署过程中遇到问题，请：

1. 检查本文档的故障排除部分
2. 查看项目的 GitHub Issues
3. 联系开发团队

---

**注意**: 请确保在生产环境中使用强密码和安全的 JWT 密钥，并定期更新依赖包以保持安全性。