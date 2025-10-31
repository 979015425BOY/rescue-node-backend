# 用户管理模块 API 文档

## 模块概述

用户管理模块是 Rescue 汽车救援平台的核心基础模块，负责处理用户的注册、登录、身份认证、个人信息管理等功能。该模块采用 JWT Token 认证机制，支持短信验证码登录、密码登录等多种登录方式。

### 功能特性

* **多种登录方式**: 支持短信验证码登录、密码登录

* **安全认证**: 基于 JWT Token 的身份认证机制

* **用户信息管理**: 完整的用户资料管理功能

* **密码安全**: 支持密码重置、修改等安全操作

* **头像上传**: 支持用户头像上传和管理

***

## API 接口定义

### 1. 用户注册与登录

#### 1.1 发送短信验证码

**接口地址**: `POST /api/auth/sms/send`

**功能描述**: 向指定手机号发送短信验证码，支持登录、注册、重置密码等场景

**请求参数**:

```json
{
  "phone": "13800138000",
  "type": "login|register|reset_password"
}
```

**参数说明**:

| 参数名   | 类型     | 必填 | 说明                                                 |
| ----- | ------ | -- | -------------------------------------------------- |
| phone | string | 是  | 手机号码，11位数字                                         |
| type  | string | 是  | 验证码类型：login(登录)、register(注册)、reset\_password(重置密码) |

**响应格式**:

```json
{
  "code": 200,
  "message": "验证码发送成功",
  "data": {
    "countdown": 60
  }
}
```

**响应参数说明**:

| 参数名       | 类型     | 说明               |
| --------- | ------ | ---------------- |
| countdown | number | 倒计时秒数，用于前端控制重发按钮 |

***

#### 1.2 短信验证码登录

**接口地址**: `POST /api/auth/login/sms`

**功能描述**: 使用手机号和短信验证码进行登录,短信验证并不需要真实的短信验证码,可以使用固定的验证码"123456"进行登录

**请求参数**:

```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

**参数说明**:

| 参数名   | 类型     | 必填 | 说明      |
| ----- | ------ | -- | ------- |
| phone | string | 是  | 手机号码    |
| code  | string | 是  | 6位数字验证码 |

**响应格式**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": "user_123456",
      "phone": "13800138000",
      "nickname": "救援用户",
      "avatar": "https://example.com/avatar.jpg",
      "email": "user@example.com",
      "realName": "张三",
      "idCard": "110101199001011234",
      "emergencyContact": "李四",
      "emergencyPhone": "13900139000",
      "address": "北京市朝阳区",
      "createTime": "2024-01-19T10:30:00Z",
      "lastLoginTime": "2024-01-19T10:30:00Z"
    }
  }
}
```

***

#### 1.3 密码登录

**接口地址**: `POST /api/auth/login/password`

**功能描述**: 使用手机号和密码进行登录

**请求参数**:

```json
{
  "phone": "13800138000",
  "password": "password123"
}
```

**参数说明**:

| 参数名      | 类型     | 必填 | 说明   |
| -------- | ------ | -- | ---- |
| phone    | string | 是  | 手机号码 |
| password | string | 是  | 用户密码 |

**响应格式**: 同短信验证码登录

***

#### 1.4 用户注册

**接口地址**: `POST /api/auth/register`

**功能描述**: 新用户注册

**请求参数**:

```json
{
  "phone": "13800138000",
  "code": "123456",
  "password": "password123",
  "username": "用户昵称",
  "inviteCode": "INVITE123"
}
```

**参数说明**:

| 参数名        | 类型     | 必填 | 说明         |
| ---------- | ------ | -- | ---------- |
| phone      | string | 是  | 手机号码       |
| code       | string | 是  | 短信验证码      |
| password   | string | 是  | 登录密码，6-20位 |
| username   | string | 是  | 用户昵称       |
| inviteCode | string | 否  | 邀请码        |

**响应格式**: 同登录接口

***

#### 1.5 重置密码

**接口地址**: `POST /api/auth/password/reset`

**功能描述**: 通过短信验证码重置密码

**请求参数**:

```json
{
  "phone": "13800138000",
  "code": "123456",
  "newPassword": "newpassword123"
}
```

***

#### 1.6 刷新Token

**接口地址**: `POST /api/auth/token/refresh`

**功能描述**: 使用刷新令牌获取新的访问令牌

**请求参数**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

***

#### 1.7 退出登录

**接口地址**: `POST /api/auth/logout`

**功能描述**: 用户退出登录，使当前Token失效

**请求头**: 需要携带 Authorization Bearer Token

***

### 2. 用户信息管理

#### 2.1 获取用户信息

**接口地址**: `GET /api/user/profile`

**功能描述**: 获取当前登录用户的详细信息

**请求头**: 需要携带 Authorization Bearer Token

**响应格式**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "user_123456",
    "phone": "13800138000",
    "nickname": "救援用户",
    "avatar": "https://example.com/avatar.jpg",
    "email": "user@example.com",
    "realName": "张三",
    "idCard": "110101199001011234",
    "emergencyContact": "李四",
    "emergencyPhone": "13900139000",
    "address": "北京市朝阳区",
    "points": 1500,
    "level": "VIP会员",
    "createTime": "2024-01-19T10:30:00Z",
    "lastLoginTime": "2024-01-19T10:30:00Z"
  }
}
```

***

#### 2.4 修改密码

**接口地址**: `PUT /api/user/password/change`

**功能描述**: 修改登录密码

**请求参数**:

```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "code": "123456"
}
```

**参数说明**:

| 参数名         | 类型     | 必填 | 说明        |
| ----------- | ------ | -- | --------- |
| oldPassword | string | 是  | 原密码       |
| newPassword | string | 是  | 新密码，6-20位 |
| code        | string | 是  | 短信验证码     |

***

## 错误码说明

| 错误码  | 说明           |
| ---- | ------------ |
| 1001 | 手机号格式错误      |
| 1002 | 验证码错误或已过期    |
| 1003 | 用户不存在        |
| 1004 | 密码错误         |
| 1005 | 用户已存在        |
| 1006 | Token 无效或已过期 |
| 1007 | 刷新Token无效    |
| 1008 | 原密码错误        |
| 1009 | 验证码发送频繁      |
| 1010 | 头像上传失败       |

***

## 数据模型定义

### UserInfo 用户信息模型

```typescript
interface UserInfo {
  id: string;              // 用户ID
  phone: string;           // 手机号
  nickname: string;        // 昵称
  avatar?: string;         // 头像URL
  email?: string;          // 邮箱
  realName?: string;       // 真实姓名
  idCard?: string;         // 身份证号
  emergencyContact?: string; // 紧急联系人
  emergencyPhone?: string;   // 紧急联系电话
  address?: string;        // 地址
  points: number;          // 积分
  level: string;           // 用户等级
  createTime: string;      // 创建时间
  lastLoginTime: string;   // 最后登录时间
}
```

### AuthResponse 认证响应模型

```typescript
interface AuthResponse {
  accessToken: string;     // 访问令牌
  refreshToken: string;    // 刷新令牌
  userInfo: UserInfo;      // 用户信息
}
```

***

## 业务规则

1. **手机号验证**: 必须是11位有效的中国大陆手机号
2. **验证码有效期**: 短信验证码有效期为5分钟
3. **验证码发送限制**: 同一手机号1分钟内只能发送1次验证码
4. **密码规则**: 密码长度6-20位，必须包含字母和数字
5. **Token有效期**: 访问令牌有效期2小时，刷新令牌有效期7天
6. **头像限制**: 支持jpg、png、gif格式，大小不超过2MB

***

## 安全考虑

1. **密码加密**: 用户密码使用bcrypt进行加密存储
2. **Token安全**: JWT Token包含用户基本信息，使用RSA256签名
3. **接口限流**: 登录接口实施频率限制，防止暴力破解
4. **验证码保护**: 验证码存储在Redis中，设置过期时间
5. **敏感信息脱敏**: 返回用户信息时对手机号、身份证等敏感信息进行脱敏处理

***

## 测试用例

### 用户注册测试用例

```javascript
// 正常注册流程
const registerTest = {
  phone: "13800138000",
  code: "123456",
  password: "test123456",
  username: "测试用户"
};

// 异常情况测试
const errorCases = [
  { phone: "138001380", error: "手机号格式错误" },
  { phone: "13800138000", code: "000000", error: "验证码错误" },
  { phone: "13800138000", code: "123456", password: "123", error: "密码长度不足" }
];
```

***

<br />

***

