# Render 部署指南

本文档详细说明如何将救援节点后端项目部署到 Render 平台。

## 📋 部署前准备

### 1. 确保项目配置完整

确保你的项目包含以下文件：
- ✅ `render.yaml` - Render 部署配置文件
- ✅ `package.json` - 包含正确的构建和启动脚本
- ✅ `.env.example` - 环境变量模板
- ✅ 健康检查端点 `/health`

### 2. 代码推送到 GitHub

确保最新代码已推送到 GitHub 仓库的 `master` 分支：

```bash
git add .
git commit -m "feat: 添加 Render 部署配置"
git push origin master
```

## 🚀 Render 部署步骤

### 步骤 1: 访问 Render Dashboard

1. 打开 [Render Dashboard](https://dashboard.render.com/)
2. 登录你的 Render 账户
3. 点击 "New +" 按钮

### 步骤 2: 选择部署方式

1. 选择 "Blueprint" 选项
2. 在 "Repository" 字段中输入你的 GitHub 仓库 URL：
   ```
   https://github.com/979015425BOY/rescue-node-backend.git
   ```
3. 选择 `master` 分支
4. 点击 "Connect"

### 步骤 3: 配置环境变量

Render 会自动读取 `render.yaml` 配置，但你需要手动设置以下敏感环境变量：

#### 必需的环境变量：

```bash
# 短信服务配置（阿里云SMS）
SMS_ACCESS_KEY_ID=你的阿里云AccessKeyId
SMS_ACCESS_KEY_SECRET=你的阿里云AccessKeySecret
SMS_SIGN_NAME=你的短信签名
SMS_TEMPLATE_CODE=你的短信模板代码
```

#### 自动生成的环境变量：
- `JWT_SECRET` - 自动生成
- `JWT_REFRESH_SECRET` - 自动生成
- `DATABASE_*` - 从数据库服务自动获取

### 步骤 4: 部署确认

1. 检查服务配置：
   - **服务名称**: `rescue-node-backend`
   - **环境**: Node.js
   - **构建命令**: `npm ci && npm run build`
   - **启动命令**: `npm run start:prod`
   - **健康检查**: `/health`

2. 检查数据库配置：
   - **数据库名称**: `rescue-mysql-db`
   - **数据库类型**: MySQL
   - **计划**: Starter

3. 点击 "Apply" 开始部署

## 📊 部署后验证

### 1. 检查服务状态

部署完成后，检查以下内容：

- ✅ Web 服务状态为 "Live"
- ✅ 数据库服务状态为 "Available"
- ✅ 构建日志无错误
- ✅ 应用日志正常

### 2. 测试 API 端点

使用 Render 提供的 URL 测试以下端点：

```bash
# 健康检查
curl https://your-app-name.onrender.com/health

# API 根路径
curl https://your-app-name.onrender.com/api

# 短信发送测试（需要有效手机号）
curl -X POST https://your-app-name.onrender.com/api/auth/send-sms \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000"}'
```

### 3. 预期响应

#### 健康检查响应：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "0.0.1",
  "memory": {
    "used": 45.67,
    "total": 128.00
  },
  "database": {
    "status": "connected",
    "type": "MySQL"
  }
}
```

## 🔧 配置说明

### render.yaml 配置详解

```yaml
services:
  - type: web                    # Web 服务类型
    name: rescue-node-backend    # 服务名称
    env: node                    # Node.js 环境
    plan: starter                # 免费计划
    buildCommand: npm ci && npm run build  # 构建命令
    startCommand: npm run start:prod       # 启动命令
    healthCheckPath: /health     # 健康检查路径
    
databases:
  - name: rescue-mysql-db        # 数据库服务名称
    databaseName: rescue_node_db # 数据库名称
    user: rescue_user           # 数据库用户
    plan: starter               # 免费计划
```

### 环境变量配置

| 变量名 | 描述 | 来源 |
|--------|------|------|
| `NODE_ENV` | 运行环境 | 固定值: production |
| `PORT` | 应用端口 | 固定值: 3000 |
| `JWT_SECRET` | JWT 密钥 | 自动生成 |
| `JWT_REFRESH_SECRET` | 刷新令牌密钥 | 自动生成 |
| `DATABASE_*` | 数据库连接信息 | 从数据库服务获取 |
| `SMS_*` | 短信服务配置 | 手动设置 |

## 🚨 常见问题

### 1. "No render.yaml found" 错误

**原因**: GitHub 仓库的 master 分支中没有 `render.yaml` 文件

**解决方案**:
```bash
# 确保 render.yaml 文件存在并推送到 master 分支
git add render.yaml
git commit -m "add: render.yaml 配置文件"
git push origin master
```

### 2. 构建失败

**常见原因**:
- Node.js 版本不兼容
- 依赖安装失败
- TypeScript 编译错误

**解决方案**:
```bash
# 本地测试构建
npm ci
npm run build
npm run start:prod

# 检查 package.json 中的 engines 字段
"engines": {
  "node": ">=18.0.0"
}
```

### 3. 数据库连接失败

**检查项目**:
- 数据库服务是否正常运行
- 环境变量是否正确设置
- 网络连接是否正常

### 4. 健康检查失败

**检查项目**:
- `/health` 端点是否正确实现
- 应用是否在正确端口启动
- 启动时间是否过长

## 📈 性能优化

### 1. 构建优化

```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main",
    "postinstall": "npm run build"
  }
}
```

### 2. 内存优化

```javascript
// 在 main.ts 中设置内存限制
process.env.NODE_OPTIONS = '--max-old-space-size=512';
```

### 3. 启动优化

```yaml
# render.yaml 中的优化配置
healthCheckPath: /health
startCommand: npm run start:prod
```

## 🔒 安全配置

### 1. 环境变量安全

- 使用 Render 的环境变量管理
- 不要在代码中硬编码敏感信息
- 定期轮换密钥

### 2. CORS 配置

```typescript
// 在生产环境中限制 CORS
app.enableCors({
  origin: process.env.CORS_ORIGIN?.split(',') || false,
  credentials: true,
});
```

### 3. 速率限制

```typescript
// 启用速率限制
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 分钟
    max: 100, // 限制每个 IP 100 次请求
  }),
);
```

## 📞 支持与帮助

如果在部署过程中遇到问题：

1. 查看 Render 控制台的构建和运行日志
2. 检查本文档的常见问题部分
3. 参考 [Render 官方文档](https://render.com/docs)
4. 联系项目维护者

---

**注意**: 免费计划有一定限制，生产环境建议升级到付费计划以获得更好的性能和可靠性。