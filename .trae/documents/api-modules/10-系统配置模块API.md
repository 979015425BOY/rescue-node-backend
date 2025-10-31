# 系统配置模块 API 文档

## 模块概述

系统配置模块负责管理平台的各种系统参数和配置信息，包括业务配置、系统参数、功能开关、价格策略等。该模块为平台提供灵活的配置管理能力，支持动态调整系统行为而无需重新部署。

### 功能特性

- **配置分类管理**: 支持多种配置类型的分类管理
- **动态配置**: 支持配置的实时更新和生效
- **版本控制**: 配置变更历史记录和版本管理
- **权限控制**: 不同角色的配置访问权限控制
- **配置验证**: 配置参数的格式和有效性验证

---

## API 接口定义

### 1. 系统配置管理

#### 1.1 获取系统配置

**接口地址**: `GET /api/config/system`

**功能描述**: 获取系统配置信息

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| category | string | 否 | 配置分类：business、system、feature、price |
| key | string | 否 | 配置键名 |
| version | string | 否 | 配置版本 |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "configs": [
      {
        "id": "config_001",
        "category": "business",
        "key": "rescue_timeout",
        "value": "1800",
        "type": "number",
        "description": "救援超时时间（秒）",
        "defaultValue": "1800",
        "required": true,
        "validation": {
          "min": 300,
          "max": 7200
        },
        "version": "1.0.0",
        "updateTime": "2024-01-19T10:30:00Z",
        "updatedBy": "admin"
      }
    ],
    "version": "1.2.0",
    "lastUpdate": "2024-01-19T10:30:00Z"
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| category | string | 配置分类 |
| key | string | 配置键名 |
| value | string | 配置值 |
| type | string | 数据类型：string、number、boolean、json |
| description | string | 配置描述 |
| defaultValue | string | 默认值 |
| required | boolean | 是否必需 |
| validation | object | 验证规则 |
| version | string | 配置版本 |

---

#### 1.2 更新系统配置

**接口地址**: `PUT /api/config/system`

**功能描述**: 更新系统配置

**请求参数**:
```json
{
  "configs": [
    {
      "key": "rescue_timeout",
      "value": "2400",
      "comment": "延长救援超时时间"
    },
    {
      "key": "max_rescue_distance",
      "value": "50000",
      "comment": "增加最大救援距离"
    }
  ]
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| configs | array | 是 | 配置更新列表 |
| key | string | 是 | 配置键名 |
| value | string | 是 | 新配置值 |
| comment | string | 否 | 更新说明 |

**响应格式**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "successCount": 2,
    "failCount": 0,
    "results": [
      {
        "key": "rescue_timeout",
        "success": true,
        "oldValue": "1800",
        "newValue": "2400"
      },
      {
        "key": "max_rescue_distance",
        "success": true,
        "oldValue": "30000",
        "newValue": "50000"
      }
    ],
    "version": "1.2.1",
    "updateTime": "2024-01-19T11:00:00Z"
  }
}
```

---

#### 1.3 重置配置

**接口地址**: `POST /api/config/system/reset`

**功能描述**: 重置配置为默认值

**请求参数**:
```json
{
  "keys": ["rescue_timeout", "max_rescue_distance"],
  "resetAll": false
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keys | array | 否 | 要重置的配置键名列表 |
| resetAll | boolean | 否 | 是否重置所有配置 |

---

### 2. 业务配置

#### 2.1 获取救援服务配置

**接口地址**: `GET /api/config/rescue`

**功能描述**: 获取救援服务相关配置

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "serviceHours": {
      "start": "00:00",
      "end": "23:59",
      "timezone": "Asia/Shanghai"
    },
    "responseTime": {
      "normal": 1800,
      "urgent": 900,
      "emergency": 300
    },
    "serviceRadius": {
      "city": 30000,
      "highway": 50000,
      "rural": 20000
    },
    "pricing": {
      "baseFee": 100,
      "distanceFee": 2.5,
      "timeFee": 1.0,
      "nightSurcharge": 0.5,
      "holidaySurcharge": 0.3
    },
    "limits": {
      "maxDistance": 100000,
      "maxWeight": 5000,
      "dailyOrderLimit": 10
    }
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| serviceHours | object | 服务时间配置 |
| responseTime | object | 响应时间配置（秒） |
| serviceRadius | object | 服务半径配置（米） |
| pricing | object | 价格策略配置 |
| limits | object | 服务限制配置 |

---

#### 2.2 更新救援服务配置

**接口地址**: `PUT /api/config/rescue`

**功能描述**: 更新救援服务配置

**请求参数**:
```json
{
  "serviceHours": {
    "start": "06:00",
    "end": "22:00"
  },
  "pricing": {
    "baseFee": 120,
    "distanceFee": 3.0
  }
}
```

---

#### 2.3 获取拖车服务配置

**接口地址**: `GET /api/config/towing`

**功能描述**: 获取拖车服务相关配置

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "vehicleTypes": [
      {
        "type": "small_car",
        "name": "小型车",
        "maxWeight": 2000,
        "baseFee": 200,
        "distanceFee": 5.0
      },
      {
        "type": "suv",
        "name": "SUV",
        "maxWeight": 3000,
        "baseFee": 250,
        "distanceFee": 6.0
      }
    ],
    "serviceAreas": [
      {
        "area": "city_center",
        "name": "市中心",
        "surcharge": 0.2
      }
    ],
    "timeSlots": [
      {
        "slot": "daytime",
        "start": "08:00",
        "end": "18:00",
        "surcharge": 0
      },
      {
        "slot": "night",
        "start": "18:00",
        "end": "08:00",
        "surcharge": 0.5
      }
    ]
  }
}
```

---

### 3. 功能开关

#### 3.1 获取功能开关

**接口地址**: `GET /api/config/features`

**功能描述**: 获取功能开关配置

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "features": [
      {
        "key": "sms_notification",
        "name": "短信通知",
        "enabled": true,
        "description": "订单状态变更短信通知",
        "category": "notification",
        "rolloutPercentage": 100,
        "targetUsers": [],
        "conditions": {}
      },
      {
        "key": "ai_dispatch",
        "name": "智能调度",
        "enabled": false,
        "description": "AI智能救援调度",
        "category": "dispatch",
        "rolloutPercentage": 10,
        "targetUsers": ["premium"],
        "conditions": {
          "minVersion": "2.0.0"
        }
      }
    ]
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| key | string | 功能键名 |
| name | string | 功能名称 |
| enabled | boolean | 是否启用 |
| category | string | 功能分类 |
| rolloutPercentage | number | 灰度发布比例 |
| targetUsers | array | 目标用户群体 |
| conditions | object | 启用条件 |

---

#### 3.2 更新功能开关

**接口地址**: `PUT /api/config/features`

**功能描述**: 更新功能开关状态

**请求参数**:
```json
{
  "features": [
    {
      "key": "ai_dispatch",
      "enabled": true,
      "rolloutPercentage": 50
    }
  ]
}
```

---

#### 3.3 检查功能是否启用

**接口地址**: `GET /api/config/features/check`

**功能描述**: 检查指定功能是否对当前用户启用

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| feature | string | 是 | 功能键名 |
| userId | string | 否 | 用户ID |
| version | string | 否 | 客户端版本 |

**响应格式**:
```json
{
  "code": 200,
  "message": "检查完成",
  "data": {
    "feature": "ai_dispatch",
    "enabled": true,
    "reason": "feature_enabled",
    "metadata": {
      "rolloutGroup": "test_group_a",
      "experimentId": "exp_001"
    }
  }
}
```

---

### 4. 价格策略

#### 4.1 获取价格策略

**接口地址**: `GET /api/config/pricing`

**功能描述**: 获取价格策略配置

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| serviceType | string | 否 | 服务类型：rescue、towing |
| region | string | 否 | 地区代码 |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "rescue": {
      "baseFee": 100,
      "distanceFee": 2.5,
      "timeFee": 1.0,
      "surcharges": {
        "night": 0.5,
        "holiday": 0.3,
        "emergency": 1.0
      },
      "discounts": {
        "member": 0.1,
        "enterprise": 0.15
      }
    },
    "towing": {
      "vehicleTypes": {
        "small_car": {
          "baseFee": 200,
          "distanceFee": 5.0
        },
        "large_car": {
          "baseFee": 300,
          "distanceFee": 7.0
        }
      }
    },
    "regions": {
      "beijing": {
        "multiplier": 1.2
      },
      "shanghai": {
        "multiplier": 1.3
      }
    }
  }
}
```

---

#### 4.2 更新价格策略

**接口地址**: `PUT /api/config/pricing`

**功能描述**: 更新价格策略

**请求参数**:
```json
{
  "serviceType": "rescue",
  "pricing": {
    "baseFee": 120,
    "distanceFee": 3.0,
    "surcharges": {
      "night": 0.6
    }
  },
  "effectiveDate": "2024-02-01T00:00:00Z"
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| serviceType | string | 是 | 服务类型 |
| pricing | object | 是 | 价格配置 |
| effectiveDate | string | 否 | 生效时间 |

---

### 5. 配置历史

#### 5.1 获取配置变更历史

**接口地址**: `GET /api/config/history`

**功能描述**: 获取配置变更历史记录

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| category | string | 否 | 配置分类 |
| key | string | 否 | 配置键名 |
| startTime | string | 否 | 开始时间 |
| endTime | string | 否 | 结束时间 |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "history_001",
        "category": "business",
        "key": "rescue_timeout",
        "oldValue": "1800",
        "newValue": "2400",
        "operation": "update",
        "operator": "admin",
        "operatorName": "系统管理员",
        "comment": "延长救援超时时间",
        "createTime": "2024-01-19T11:00:00Z",
        "version": "1.2.1"
      }
    ],
    "total": 50
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| operation | string | 操作类型：create、update、delete、reset |
| operator | string | 操作者ID |
| operatorName | string | 操作者姓名 |
| comment | string | 变更说明 |

---

#### 5.2 回滚配置

**接口地址**: `POST /api/config/rollback`

**功能描述**: 回滚配置到指定版本

**请求参数**:
```json
{
  "version": "1.2.0",
  "keys": ["rescue_timeout", "max_rescue_distance"],
  "comment": "回滚到稳定版本"
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| version | string | 是 | 目标版本 |
| keys | array | 否 | 指定回滚的配置键，不传则回滚所有 |
| comment | string | 否 | 回滚说明 |

---

### 6. 配置验证

#### 6.1 验证配置

**接口地址**: `POST /api/config/validate`

**功能描述**: 验证配置参数的有效性

**请求参数**:
```json
{
  "configs": [
    {
      "key": "rescue_timeout",
      "value": "2400",
      "type": "number"
    },
    {
      "key": "service_phone",
      "value": "400-123-4567",
      "type": "string"
    }
  ]
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "验证完成",
  "data": {
    "valid": false,
    "results": [
      {
        "key": "rescue_timeout",
        "valid": true,
        "value": "2400"
      },
      {
        "key": "service_phone",
        "valid": false,
        "value": "400-123-4567",
        "errors": ["电话号码格式不正确"]
      }
    ]
  }
}
```

---

#### 6.2 获取配置模板

**接口地址**: `GET /api/config/template`

**功能描述**: 获取配置参数模板和验证规则

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| category | string | 否 | 配置分类 |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "templates": [
      {
        "key": "rescue_timeout",
        "name": "救援超时时间",
        "type": "number",
        "required": true,
        "defaultValue": "1800",
        "validation": {
          "min": 300,
          "max": 7200
        },
        "description": "救援服务超时时间，单位：秒",
        "category": "business"
      }
    ]
  }
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 10001 | 配置不存在 |
| 10002 | 配置值格式错误 |
| 10003 | 配置验证失败 |
| 10004 | 配置更新失败 |
| 10005 | 权限不足 |
| 10006 | 版本不存在 |
| 10007 | 回滚失败 |
| 10008 | 配置冲突 |
| 10009 | 配置锁定中 |
| 10010 | 批量操作超限 |

---

## 数据模型定义

### Config 配置模型

```typescript
interface Config {
  id: string;                    // 配置ID
  category: ConfigCategory;      // 配置分类
  key: string;                   // 配置键名
  value: string;                 // 配置值
  type: ConfigType;              // 数据类型
  description: string;           // 配置描述
  defaultValue: string;          // 默认值
  required: boolean;             // 是否必需
  validation?: ValidationRule;   // 验证规则
  version: string;               // 配置版本
  updateTime: string;            // 更新时间
  updatedBy: string;             // 更新者
}

enum ConfigCategory {
  BUSINESS = 'business',         // 业务配置
  SYSTEM = 'system',             // 系统配置
  FEATURE = 'feature',           // 功能开关
  PRICE = 'price'                // 价格策略
}

enum ConfigType {
  STRING = 'string',             // 字符串
  NUMBER = 'number',             // 数字
  BOOLEAN = 'boolean',           // 布尔值
  JSON = 'json'                  // JSON对象
}

interface ValidationRule {
  min?: number;                  // 最小值
  max?: number;                  // 最大值
  pattern?: string;              // 正则表达式
  enum?: string[];               // 枚举值
  required?: boolean;            // 是否必需
}
```

### Feature 功能开关模型

```typescript
interface Feature {
  key: string;                   // 功能键名
  name: string;                  // 功能名称
  enabled: boolean;              // 是否启用
  description: string;           // 功能描述
  category: string;              // 功能分类
  rolloutPercentage: number;     // 灰度发布比例
  targetUsers: string[];         // 目标用户群体
  conditions: FeatureCondition;  // 启用条件
  createTime: string;            // 创建时间
  updateTime: string;            // 更新时间
}

interface FeatureCondition {
  minVersion?: string;           // 最小版本要求
  maxVersion?: string;           // 最大版本要求
  userTypes?: string[];          // 用户类型
  regions?: string[];            // 地区限制
  timeRange?: TimeRange;         // 时间范围
}

interface TimeRange {
  start: string;                 // 开始时间
  end: string;                   // 结束时间
}
```

### ConfigHistory 配置历史模型

```typescript
interface ConfigHistory {
  id: string;                    // 历史记录ID
  category: ConfigCategory;      // 配置分类
  key: string;                   // 配置键名
  oldValue?: string;             // 旧值
  newValue?: string;             // 新值
  operation: ConfigOperation;    // 操作类型
  operator: string;              // 操作者ID
  operatorName: string;          // 操作者姓名
  comment?: string;              // 变更说明
  createTime: string;            // 创建时间
  version: string;               // 配置版本
}

enum ConfigOperation {
  CREATE = 'create',             // 创建
  UPDATE = 'update',             // 更新
  DELETE = 'delete',             // 删除
  RESET = 'reset'                // 重置
}
```

---

## 业务规则

1. **配置分类**: 配置按业务、系统、功能、价格等分类管理
2. **版本控制**: 每次配置变更生成新版本号
3. **权限控制**: 不同角色对配置的访问权限不同
4. **生效机制**: 配置更新后实时生效或定时生效
5. **回滚限制**: 只能回滚到最近10个版本

---

## 安全考虑

1. **权限验证**: 配置操作需要管理员权限
2. **操作审计**: 所有配置变更记录操作日志
3. **数据验证**: 配置值必须通过格式和业务规则验证
4. **备份机制**: 配置数据定期备份
5. **访问控制**: 敏感配置信息加密存储

---

## 性能要求

1. **响应时间**: 配置查询响应时间<100ms
2. **缓存策略**: 配置数据缓存30分钟
3. **并发处理**: 支持100个并发配置查询
4. **更新延迟**: 配置更新后5秒内生效
5. **存储优化**: 配置历史数据压缩存储

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0 | 2024-01-19 | 初始版本，包含基础系统配置功能 |