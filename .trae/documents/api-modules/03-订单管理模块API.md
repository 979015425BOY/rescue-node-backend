# 订单管理模块 API 文档

## 模块概述

订单管理模块是 Rescue 汽车救援平台的核心交易模块，负责处理救援订单的完整生命周期，包括订单创建、状态跟踪、订单完成、评价反馈等功能。该模块支持多种订单类型，提供实时的订单状态更新和完整的订单历史记录。

### 功能特性

- **多类型订单**: 支持救援订单、拖车订单等多种类型
- **实时状态跟踪**: 提供订单全流程状态跟踪
- **智能派单**: 自动匹配最优救援师傅
- **订单评价**: 完整的评价反馈系统
- **订单历史**: 完整的订单历史记录管理

---

## API 接口定义

### 1. 订单创建与管理

#### 1.1 创建救援订单

**接口地址**: `POST /api/orders/rescue`

**功能描述**: 创建新的救援服务订单

**请求参数**:
```json
{
  "serviceId": "emergency",
  "vehicleId": "vehicle_123",
  "location": {
    "latitude": 39.9042,
    "longitude": 116.4074,
    "address": "北京市朝阳区建国路88号",
    "detailAddress": "停车场A区"
  },
  "contact": {
    "name": "张三",
    "phone": "13800138000"
  },
  "problemDescription": "车辆无法启动，疑似电瓶问题",
  "images": [
    "https://example.com/problem1.jpg",
    "https://example.com/problem2.jpg"
  ],
  "urgentLevel": "normal"
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| serviceId | string | 是 | 服务类型ID |
| vehicleId | string | 是 | 车辆ID |
| location | object | 是 | 救援位置信息 |
| contact | object | 是 | 联系人信息 |
| problemDescription | string | 是 | 问题描述 |
| images | array | 否 | 问题图片列表 |
| urgentLevel | string | 是 | 紧急程度：normal、urgent、emergency |

**响应格式**:
```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "orderId": "ORDER_20240119_001",
    "status": "pending",
    "estimatedCost": 150,
    "estimatedArrivalTime": "30分钟",
    "createTime": "2024-01-19T10:30:00Z"
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| orderId | string | 订单唯一标识 |
| status | string | 订单状态 |
| estimatedCost | number | 预估费用 |
| estimatedArrivalTime | string | 预计到达时间 |
| createTime | string | 创建时间 |

---

#### 1.2 创建拖车订单

**接口地址**: `POST /api/orders/towing`

**功能描述**: 创建拖车服务订单

**请求参数**:
```json
{
  "towingType": "flatbed",
  "vehicleId": "vehicle_123",
  "fromLocation": {
    "latitude": 39.9042,
    "longitude": 116.4074,
    "address": "北京市朝阳区建国路88号"
  },
  "toLocation": {
    "latitude": 39.9142,
    "longitude": 116.4174,
    "address": "北京市海淀区中关村大街1号"
  },
  "contact": {
    "name": "张三",
    "phone": "13800138000"
  },
  "problemDescription": "车辆事故需要拖车",
  "images": ["https://example.com/accident.jpg"],
  "scheduledTime": "2024-01-19T14:00:00Z",
  "urgentLevel": "high"
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| towingType | string | 是 | 拖车类型ID |
| fromLocation | object | 是 | 起始位置 |
| toLocation | object | 是 | 目标位置 |
| scheduledTime | string | 否 | 预约时间，不填表示立即服务 |

---

#### 1.3 获取订单列表

**接口地址**: `GET /api/orders`

**功能描述**: 获取用户的订单列表

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |
| status | string | 否 | 订单状态筛选 |
| serviceType | string | 否 | 服务类型筛选 |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "ORDER_20240119_001",
        "serviceType": "emergency",
        "serviceName": "紧急救援",
        "status": "in_progress",
        "statusText": "救援中",
        "vehicleInfo": {
          "model": "奔驰C200",
          "licensePlate": "京A12345"
        },
        "location": {
          "address": "北京市朝阳区建国路88号"
        },
        "amount": 150,
        "createTime": "2024-01-19T10:30:00Z",
        "estimatedArrivalTime": "2024-01-19T11:00:00Z"
      }
    ],
    "total": 25,
    "page": 1,
    "pageSize": 10
  }
}
```

---

#### 1.4 获取订单详情

**接口地址**: `GET /api/orders/{orderId}`

**功能描述**: 获取指定订单的详细信息

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| orderId | string | 是 | 订单ID |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "ORDER_20240119_001",
    "serviceType": "emergency",
    "serviceName": "紧急救援",
    "status": "in_progress",
    "statusText": "救援中",
    "vehicleInfo": {
      "id": "vehicle_123",
      "model": "奔驰C200",
      "licensePlate": "京A12345",
      "ownerName": "张三",
      "ownerPhone": "138****0000"
    },
    "location": {
      "latitude": 39.9042,
      "longitude": 116.4074,
      "address": "北京市朝阳区建国路88号",
      "detailAddress": "停车场A区"
    },
    "contact": {
      "name": "张三",
      "phone": "138****0000"
    },
    "problemDescription": "车辆无法启动，疑似电瓶问题",
    "images": [
      "https://example.com/problem1.jpg",
      "https://example.com/problem2.jpg"
    ],
    "driverInfo": {
      "name": "李师傅",
      "phone": "139****0000",
      "licensePlate": "京B88888",
      "avatar": "https://example.com/driver_avatar.jpg",
      "rating": 4.8
    },
    "timeline": [
      {
        "status": "pending",
        "statusText": "等待接单",
        "time": "2024-01-19T10:30:00Z"
      },
      {
        "status": "confirmed",
        "statusText": "已接单",
        "time": "2024-01-19T10:35:00Z"
      },
      {
        "status": "in_progress",
        "statusText": "救援中",
        "time": "2024-01-19T10:45:00Z"
      }
    ],
    "amount": 150,
    "createTime": "2024-01-19T10:30:00Z",
    "estimatedArrivalTime": "2024-01-19T11:00:00Z",
    "actualArrivalTime": "2024-01-19T10:55:00Z"
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| vehicleInfo | object | 车辆信息 |
| driverInfo | object | 救援师傅信息 |
| timeline | array | 订单状态时间线 |
| actualArrivalTime | string | 实际到达时间 |

---

#### 1.5 取消订单

**接口地址**: `PUT /api/orders/{orderId}/cancel`

**功能描述**: 取消指定订单

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| orderId | string | 是 | 订单ID |

**请求参数**:
```json
{
  "reason": "临时有事，不需要救援了"
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| reason | string | 是 | 取消原因 |

**响应格式**:
```json
{
  "code": 200,
  "message": "订单取消成功",
  "data": {
    "orderId": "ORDER_20240119_001",
    "status": "cancelled",
    "cancelTime": "2024-01-19T10:45:00Z",
    "refundAmount": 0
  }
}
```

---

#### 1.6 确认订单完成

**接口地址**: `PUT /api/orders/{orderId}/complete`

**功能描述**: 确认订单服务完成

**请求参数**:
```json
{
  "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "actualAmount": 150,
  "completionNotes": "救援完成，车辆已正常启动"
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| signature | string | 否 | 用户签名图片（Base64） |
| actualAmount | number | 是 | 实际费用 |
| completionNotes | string | 否 | 完成备注 |

---

### 2. 订单状态管理

#### 2.1 获取订单状态

**接口地址**: `GET /api/orders/{orderId}/status`

**功能描述**: 获取订单当前状态信息

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "orderId": "ORDER_20240119_001",
    "status": "in_progress",
    "statusText": "救援中",
    "driverLocation": {
      "latitude": 39.9052,
      "longitude": 116.4084
    },
    "estimatedArrivalTime": "15分钟",
    "lastUpdateTime": "2024-01-19T10:45:00Z"
  }
}
```

---

#### 2.2 订单状态变更通知

**接口地址**: `WebSocket /ws/orders/{orderId}/status`

**功能描述**: 通过WebSocket实时推送订单状态变更

**消息格式**:
```json
{
  "type": "status_update",
  "orderId": "ORDER_20240119_001",
  "status": "confirmed",
  "statusText": "已接单",
  "driverInfo": {
    "name": "李师傅",
    "phone": "139****0000",
    "avatar": "https://example.com/driver_avatar.jpg"
  },
  "timestamp": "2024-01-19T10:35:00Z"
}
```

---

### 3. 订单评价

#### 3.1 提交订单评价

**接口地址**: `POST /api/orders/{orderId}/evaluate`

**功能描述**: 对已完成的订单进行评价

**请求参数**:
```json
{
  "rating": 5,
  "comment": "服务很好，师傅很专业",
  "images": [
    "https://example.com/service1.jpg",
    "https://example.com/service2.jpg"
  ],
  "tags": ["专业", "及时", "态度好"]
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| rating | number | 是 | 评分，1-5分 |
| comment | string | 否 | 评价内容 |
| images | array | 否 | 评价图片 |
| tags | array | 否 | 评价标签 |

**响应格式**:
```json
{
  "code": 200,
  "message": "评价提交成功",
  "data": {
    "evaluationId": "EVAL_20240119_001",
    "points": 10
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| evaluationId | string | 评价ID |
| points | number | 获得积分 |

---

#### 3.2 获取订单评价

**接口地址**: `GET /api/orders/{orderId}/evaluate`

**功能描述**: 获取指定订单的评价信息

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "EVAL_20240119_001",
    "orderId": "ORDER_20240119_001",
    "rating": 5,
    "comment": "服务很好，师傅很专业",
    "images": [
      "https://example.com/service1.jpg",
      "https://example.com/service2.jpg"
    ],
    "tags": ["专业", "及时", "态度好"],
    "createTime": "2024-01-19T12:30:00Z"
  }
}
```

---

#### 3.3 获取评价统计

**接口地址**: `GET /api/orders/evaluate/statistics`

**功能描述**: 获取用户的评价统计信息

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "totalEvaluations": 25,
    "averageRating": 4.6,
    "ratingDistribution": {
      "5": 15,
      "4": 8,
      "3": 2,
      "2": 0,
      "1": 0
    },
    "commonTags": [
      { "tag": "专业", "count": 20 },
      { "tag": "及时", "count": 18 },
      { "tag": "态度好", "count": 15 }
    ]
  }
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 3001 | 订单不存在 |
| 3002 | 订单状态不允许此操作 |
| 3003 | 车辆信息不存在 |
| 3004 | 服务类型不支持 |
| 3005 | 订单已取消 |
| 3006 | 订单已完成 |
| 3007 | 评价已存在 |
| 3008 | 订单未完成，无法评价 |
| 3009 | 取消时间超限 |
| 3010 | 签名验证失败 |

---

## 数据模型定义

### Order 订单模型

```typescript
interface Order {
  id: string;                    // 订单ID
  serviceType: string;           // 服务类型
  serviceName: string;           // 服务名称
  status: OrderStatus;           // 订单状态
  statusText: string;            // 状态文本
  vehicleInfo: VehicleInfo;      // 车辆信息
  location: Location;            // 服务位置
  contact: ContactInfo;          // 联系人信息
  problemDescription: string;    // 问题描述
  images: string[];              // 问题图片
  driverInfo?: DriverInfo;       // 救援师傅信息
  timeline: OrderTimeline[];     // 状态时间线
  amount: number;                // 订单金额
  createTime: string;            // 创建时间
  estimatedArrivalTime?: string; // 预计到达时间
  actualArrivalTime?: string;    // 实际到达时间
  completionTime?: string;       // 完成时间
}
```

### OrderStatus 订单状态枚举

```typescript
enum OrderStatus {
  PENDING = 'pending',           // 等待接单
  CONFIRMED = 'confirmed',       // 已接单
  IN_PROGRESS = 'in_progress',   // 救援中
  COMPLETED = 'completed',       // 已完成
  CANCELLED = 'cancelled',       // 已取消
  EVALUATE = 'evaluate'          // 待评价
}
```

### VehicleInfo 车辆信息模型

```typescript
interface VehicleInfo {
  id: string;                    // 车辆ID
  model: string;                 // 车型
  licensePlate: string;          // 车牌号
  ownerName: string;             // 车主姓名
  ownerPhone: string;            // 车主电话
}
```

### DriverInfo 救援师傅信息模型

```typescript
interface DriverInfo {
  id: string;                    // 师傅ID
  name: string;                  // 姓名
  phone: string;                 // 电话
  licensePlate: string;          // 救援车牌号
  avatar: string;                // 头像
  rating: number;                // 评分
  location?: {                   // 当前位置
    latitude: number;
    longitude: number;
  };
}
```

### OrderTimeline 订单时间线模型

```typescript
interface OrderTimeline {
  status: OrderStatus;           // 状态
  statusText: string;            // 状态文本
  time: string;                  // 时间
  description?: string;          // 描述
}
```

### Evaluation 评价模型

```typescript
interface Evaluation {
  id: string;                    // 评价ID
  orderId: string;               // 订单ID
  rating: number;                // 评分 1-5
  comment?: string;              // 评价内容
  images?: string[];             // 评价图片
  tags?: string[];               // 评价标签
  createTime: string;            // 创建时间
}
```

---

## 业务规则

1. **订单状态流转**: pending → confirmed → in_progress → completed → evaluate
2. **取消规则**: 只有pending和confirmed状态的订单可以取消
3. **评价规则**: 只有completed状态的订单可以评价，每个订单只能评价一次
4. **金额计算**: 基础费用 + 距离费用 + 时间费用 + 加急费用
5. **超时处理**: 订单创建后30分钟内无人接单自动取消
6. **完成确认**: 需要用户确认或签名才能完成订单

---

## 安全考虑

1. **订单权限**: 用户只能操作自己的订单
2. **状态验证**: 严格验证订单状态变更的合法性
3. **金额保护**: 防止订单金额被恶意修改
4. **敏感信息**: 电话号码等敏感信息进行脱敏处理
5. **操作日志**: 记录所有订单操作日志

---

## 测试用例

### 订单创建测试

```javascript
const createOrderTest = {
  serviceId: "emergency",
  vehicleId: "vehicle_123",
  location: {
    latitude: 39.9042,
    longitude: 116.4074,
    address: "北京市朝阳区建国路88号"
  },
  contact: {
    name: "张三",
    phone: "13800138000"
  },
  problemDescription: "车辆无法启动",
  urgentLevel: "normal"
};

// 预期结果
const expectedResult = {
  code: 200,
  data: {
    orderId: expect.stringMatching(/^ORDER_\d{8}_\d{3}$/),
    status: "pending",
    estimatedCost: expect.any(Number)
  }
};
```

### 订单状态变更测试

```javascript
const statusUpdateTest = async (orderId) => {
  // 测试取消订单
  const cancelResponse = await fetch(`/api/orders/${orderId}/cancel`, {
    method: 'PUT',
    body: JSON.stringify({ reason: "测试取消" })
  });
  
  expect(cancelResponse.status).toBe(200);
  
  // 验证状态已更新
  const statusResponse = await fetch(`/api/orders/${orderId}/status`);
  const statusData = await statusResponse.json();
  
  expect(statusData.data.status).toBe('cancelled');
};
```

---

## 性能要求

- **订单创建**: 响应时间 < 1000ms
- **订单查询**: 响应时间 < 300ms
- **状态更新**: 实时推送延迟 < 2s
- **并发支持**: 支持1000+并发订单处理
- **数据一致性**: 订单状态变更保证强一致性

---

## 监控指标

- **订单创建量**: 每日订单创建数量统计
- **订单完成率**: 订单完成率统计
- **平均响应时间**: 救援师傅平均响应时间
- **用户满意度**: 基于评价的满意度统计
- **取消率**: 订单取消率分析

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0 | 2024-01-19 | 初始版本，包含基础订单管理功能 |