# 消息通知模块 API 文档

## 模块概述

消息通知模块负责平台内各种消息的推送和管理，包括系统消息、订单通知、营销推广等。该模块支持多种消息类型，提供消息的发送、接收、已读状态管理等功能。

### 功能特性

- **多类型消息**: 支持系统、订单、推广等多种消息类型
- **实时推送**: 支持实时消息推送
- **状态管理**: 消息已读/未读状态管理
- **批量操作**: 支持批量标记已读等操作
- **消息统计**: 提供未读消息数量统计

---

## API 接口定义

### 1. 消息管理

#### 1.1 获取消息列表

**接口地址**: `GET /api/messages`

**功能描述**: 获取用户的消息列表

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |
| type | string | 否 | 消息类型：system、order、promotion |
| status | string | 否 | 状态：unread、read |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "msg_001",
        "type": "order",
        "title": "订单状态更新",
        "content": "您的救援订单已完成",
        "status": "unread",
        "relatedId": "ORDER_20240119_001",
        "createTime": "2024-01-19T10:30:00Z"
      }
    ],
    "total": 15,
    "unreadCount": 3
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| type | string | 消息类型 |
| title | string | 消息标题 |
| content | string | 消息内容 |
| status | string | 消息状态：unread(未读)、read(已读) |
| relatedId | string | 关联ID（如订单ID） |
| unreadCount | number | 未读消息总数 |

---

#### 1.2 获取消息详情

**接口地址**: `GET /api/messages/{messageId}`

**功能描述**: 获取指定消息的详细信息

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| messageId | string | 是 | 消息ID |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "msg_001",
    "type": "order",
    "title": "订单状态更新",
    "content": "您的救援订单ORDER_20240119_001已完成，感谢您的使用！",
    "status": "read",
    "relatedId": "ORDER_20240119_001",
    "relatedType": "order",
    "images": ["https://example.com/msg_image.jpg"],
    "actionButton": {
      "text": "查看订单",
      "action": "navigate",
      "target": "/pages/order/detail?id=ORDER_20240119_001"
    },
    "createTime": "2024-01-19T10:30:00Z",
    "readTime": "2024-01-19T11:00:00Z"
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| relatedType | string | 关联类型 |
| images | array | 消息图片 |
| actionButton | object | 操作按钮配置 |
| readTime | string | 阅读时间 |

---

#### 1.3 标记消息已读

**接口地址**: `PUT /api/messages/{messageId}/read`

**功能描述**: 将指定消息标记为已读

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| messageId | string | 是 | 消息ID |

**响应格式**:
```json
{
  "code": 200,
  "message": "标记成功",
  "data": {
    "messageId": "msg_001",
    "status": "read",
    "readTime": "2024-01-19T11:00:00Z"
  }
}
```

---

#### 1.4 批量标记已读

**接口地址**: `PUT /api/messages/batch/read`

**功能描述**: 批量将消息标记为已读

**请求参数**:
```json
{
  "messageIds": ["msg_001", "msg_002", "msg_003"]
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| messageIds | array | 是 | 消息ID列表，最多50个 |

**响应格式**:
```json
{
  "code": 200,
  "message": "批量标记成功",
  "data": {
    "successCount": 3,
    "failCount": 0,
    "unreadCount": 12
  }
}
```

---

#### 1.5 全部标记已读

**接口地址**: `PUT /api/messages/all/read`

**功能描述**: 将所有未读消息标记为已读

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 否 | 消息类型，不传则标记所有类型 |

---

#### 1.6 删除消息

**接口地址**: `DELETE /api/messages/{messageId}`

**功能描述**: 删除指定消息

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| messageId | string | 是 | 消息ID |

---

#### 1.7 批量删除消息

**接口地址**: `DELETE /api/messages/batch`

**功能描述**: 批量删除消息

**请求参数**:
```json
{
  "messageIds": ["msg_001", "msg_002", "msg_003"]
}
```

---

### 2. 消息统计

#### 2.1 获取未读消息数量

**接口地址**: `GET /api/messages/unread/count`

**功能描述**: 获取用户的未读消息数量统计

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 15,
    "system": 3,
    "order": 8,
    "promotion": 4
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| total | number | 未读消息总数 |
| system | number | 系统消息未读数 |
| order | number | 订单消息未读数 |
| promotion | number | 推广消息未读数 |

---

#### 2.2 获取消息统计

**接口地址**: `GET /api/messages/statistics`

**功能描述**: 获取消息的详细统计信息

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| period | string | 否 | 统计周期：week、month、year |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "totalMessages": 150,
    "readMessages": 135,
    "unreadMessages": 15,
    "readRate": 0.9,
    "typeDistribution": {
      "system": 45,
      "order": 80,
      "promotion": 25
    },
    "dailyStats": [
      {
        "date": "2024-01-19",
        "received": 8,
        "read": 6
      }
    ]
  }
}
```

---

### 3. 消息设置

#### 3.1 获取消息设置

**接口地址**: `GET /api/messages/settings`

**功能描述**: 获取用户的消息推送设置

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "pushEnabled": true,
    "systemMessages": true,
    "orderMessages": true,
    "promotionMessages": false,
    "quietHours": {
      "enabled": true,
      "startTime": "22:00",
      "endTime": "08:00"
    }
  }
}
```

---

#### 3.2 更新消息设置

**接口地址**: `PUT /api/messages/settings`

**功能描述**: 更新用户的消息推送设置

**请求参数**:
```json
{
  "pushEnabled": true,
  "systemMessages": true,
  "orderMessages": true,
  "promotionMessages": false,
  "quietHours": {
    "enabled": true,
    "startTime": "22:00",
    "endTime": "08:00"
  }
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pushEnabled | boolean | 是 | 是否启用推送 |
| systemMessages | boolean | 是 | 是否接收系统消息 |
| orderMessages | boolean | 是 | 是否接收订单消息 |
| promotionMessages | boolean | 是 | 是否接收推广消息 |
| quietHours | object | 否 | 免打扰时间设置 |

---

### 4. 实时消息推送

#### 4.1 WebSocket 连接

**接口地址**: `WebSocket /ws/messages`

**功能描述**: 建立WebSocket连接接收实时消息推送

**连接参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| token | string | 是 | 用户认证Token |

**消息格式**:
```json
{
  "type": "new_message",
  "data": {
    "id": "msg_001",
    "type": "order",
    "title": "订单状态更新",
    "content": "您的救援订单已完成",
    "createTime": "2024-01-19T10:30:00Z"
  }
}
```

---

#### 4.2 推送消息确认

**接口地址**: `POST /api/messages/push/confirm`

**功能描述**: 确认收到推送消息

**请求参数**:
```json
{
  "messageId": "msg_001",
  "pushId": "push_123456",
  "status": "delivered"
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 7001 | 消息不存在 |
| 7002 | 消息已删除 |
| 7003 | 批量操作数量超限 |
| 7004 | 消息类型不支持 |
| 7005 | 推送设置更新失败 |
| 7006 | WebSocket连接失败 |
| 7007 | 消息推送失败 |

---

## 数据模型定义

### Message 消息模型

```typescript
interface Message {
  id: string;                    // 消息ID
  type: MessageType;             // 消息类型
  title: string;                 // 消息标题
  content: string;               // 消息内容
  status: MessageStatus;         // 消息状态
  relatedId?: string;            // 关联ID
  relatedType?: string;          // 关联类型
  images?: string[];             // 消息图片
  actionButton?: ActionButton;   // 操作按钮
  createTime: string;            // 创建时间
  readTime?: string;             // 阅读时间
}

enum MessageType {
  SYSTEM = 'system',             // 系统消息
  ORDER = 'order',               // 订单消息
  PROMOTION = 'promotion'        // 推广消息
}

enum MessageStatus {
  UNREAD = 'unread',             // 未读
  READ = 'read'                  // 已读
}

interface ActionButton {
  text: string;                  // 按钮文本
  action: string;                // 操作类型
  target: string;                // 目标地址
}
```

### MessageSettings 消息设置模型

```typescript
interface MessageSettings {
  pushEnabled: boolean;          // 是否启用推送
  systemMessages: boolean;       // 系统消息开关
  orderMessages: boolean;        // 订单消息开关
  promotionMessages: boolean;    // 推广消息开关
  quietHours?: QuietHours;       // 免打扰时间
}

interface QuietHours {
  enabled: boolean;              // 是否启用免打扰
  startTime: string;             // 开始时间
  endTime: string;               // 结束时间
}
```

---

## 业务规则

1. **消息保留期**: 消息保留30天，超期自动删除
2. **推送限制**: 推广消息每天最多推送3条
3. **免打扰时间**: 在设定的免打扰时间内不推送消息
4. **批量操作限制**: 批量操作最多支持50条消息
5. **消息优先级**: 订单消息 > 系统消息 > 推广消息

---

## 安全考虑

1. **消息权限**: 用户只能查看自己的消息
2. **推送安全**: 推送内容不包含敏感信息
3. **连接验证**: WebSocket连接需要Token验证
4. **频率限制**: 防止消息推送频率过高
5. **内容过滤**: 消息内容进行安全过滤

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0 | 2024-01-19 | 初始版本，包含基础消息通知功能 |