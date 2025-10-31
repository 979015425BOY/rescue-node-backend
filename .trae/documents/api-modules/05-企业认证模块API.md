# 企业认证模块 API 文档

## 模块概述

企业认证模块负责处理企业用户的认证申请、审核流程和认证状态管理。该模块支持企业用户提交认证资料，管理员审核，以及认证状态的查询和更新。

### 功能特性

- **企业资质认证**: 支持企业营业执照等资质认证
- **审核流程**: 完整的认证审核工作流
- **状态跟踪**: 实时跟踪认证进度
- **资料管理**: 企业认证资料的上传和管理
- **有效期管理**: 认证有效期管理和续期提醒

---

## API 接口定义

### 1. 企业认证申请

#### 1.1 提交企业认证申请

**接口地址**: `POST /api/enterprise/auth/apply`

**功能描述**: 提交企业认证申请

**请求参数**:
```json
{
  "companyName": "北京救援服务有限公司",
  "registeredAddress": "北京市朝阳区建国路88号",
  "legalPersonName": "张三",
  "accountName": "北京救援服务有限公司",
  "bankInfo": "中国银行北京分行",
  "businessLicense": [
    "https://example.com/license1.jpg",
    "https://example.com/license2.jpg"
  ]
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| companyName | string | 是 | 公司名称 |
| registeredAddress | string | 是 | 注册地址 |
| legalPersonName | string | 是 | 法人姓名 |
| accountName | string | 是 | 开户名称 |
| bankInfo | string | 是 | 开户银行 |
| businessLicense | array | 是 | 营业执照图片列表 |

**响应格式**:
```json
{
  "code": 200,
  "message": "申请提交成功",
  "data": {
    "applicationId": "APP_20240119_001",
    "status": "pending",
    "submitTime": "2024-01-19T10:30:00Z"
  }
}
```

---

#### 1.2 获取认证状态

**接口地址**: `GET /api/enterprise/auth/status`

**功能描述**: 获取当前用户的企业认证状态

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "status": "approved",
    "statusText": "已认证",
    "companyName": "北京救援服务有限公司",
    "approveTime": "2024-01-19T15:30:00Z",
    "expireTime": "2025-01-19T15:30:00Z"
  }
}
```

**状态说明**:
| 状态值 | 状态文本 | 说明 |
|--------|----------|------|
| pending | 审核中 | 申请已提交，等待审核 |
| approved | 已认证 | 认证通过 |
| rejected | 已拒绝 | 认证被拒绝 |
| expired | 已过期 | 认证已过期 |

---

#### 1.3 获取认证详情

**接口地址**: `GET /api/enterprise/auth/detail`

**功能描述**: 获取企业认证的详细信息

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "applicationId": "APP_20240119_001",
    "status": "approved",
    "statusText": "已认证",
    "companyInfo": {
      "companyName": "北京救援服务有限公司",
      "registeredAddress": "北京市朝阳区建国路88号",
      "legalPersonName": "张三",
      "accountName": "北京救援服务有限公司",
      "bankInfo": "中国银行北京分行"
    },
    "businessLicense": [
      "https://example.com/license1.jpg",
      "https://example.com/license2.jpg"
    ],
    "submitTime": "2024-01-19T10:30:00Z",
    "approveTime": "2024-01-19T15:30:00Z",
    "expireTime": "2025-01-19T15:30:00Z",
    "rejectReason": null
  }
}
```

---

#### 1.4 更新认证信息

**接口地址**: `PUT /api/enterprise/auth/update`

**功能描述**: 更新企业认证信息（仅在被拒绝状态下可用）

**请求参数**: 同提交认证申请接口

---

#### 1.5 撤销认证申请

**接口地址**: `DELETE /api/enterprise/auth/withdraw`

**功能描述**: 撤销待审核的认证申请

---

### 2. 认证续期

#### 2.1 申请认证续期

**接口地址**: `POST /api/enterprise/auth/renew`

**功能描述**: 申请企业认证续期

**请求参数**:
```json
{
  "businessLicense": [
    "https://example.com/new_license1.jpg",
    "https://example.com/new_license2.jpg"
  ]
}
```

---

#### 2.2 获取续期提醒

**接口地址**: `GET /api/enterprise/auth/renewal-reminder`

**功能描述**: 获取认证续期提醒信息

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "needRenewal": true,
    "expireTime": "2025-01-19T15:30:00Z",
    "daysLeft": 30,
    "reminderLevel": "warning"
  }
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 5001 | 企业认证申请不存在 |
| 5002 | 认证状态不允许此操作 |
| 5003 | 营业执照图片格式错误 |
| 5004 | 公司名称已存在 |
| 5005 | 认证已过期 |
| 5006 | 认证信息不完整 |
| 5007 | 审核中，无法修改 |
| 5008 | 认证已通过，无法撤销 |

---

## 数据模型定义

### EnterpriseAuth 企业认证模型

```typescript
interface EnterpriseAuth {
  applicationId: string;        // 申请ID
  status: AuthStatus;           // 认证状态
  statusText: string;           // 状态文本
  companyInfo: CompanyInfo;     // 公司信息
  businessLicense: string[];    // 营业执照图片
  submitTime: string;           // 提交时间
  approveTime?: string;         // 审核时间
  expireTime?: string;          // 过期时间
  rejectReason?: string;        // 拒绝原因
}

interface CompanyInfo {
  companyName: string;          // 公司名称
  registeredAddress: string;    // 注册地址
  legalPersonName: string;      // 法人姓名
  accountName: string;          // 开户名称
  bankInfo: string;             // 开户银行
}

enum AuthStatus {
  PENDING = 'pending',          // 审核中
  APPROVED = 'approved',        // 已认证
  REJECTED = 'rejected',        // 已拒绝
  EXPIRED = 'expired'           // 已过期
}
```

---

## 业务规则

1. **认证有效期**: 企业认证有效期为1年
2. **续期时间**: 可在过期前30天内申请续期
3. **资料要求**: 营业执照必须清晰可见，有效期内
4. **审核时间**: 工作日3-5天完成审核
5. **重新申请**: 被拒绝后可修改资料重新申请

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0 | 2024-01-19 | 初始版本，包含基础企业认证功能 |