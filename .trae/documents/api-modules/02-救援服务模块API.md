# 救援服务模块 API 文档

## 模块概述

救援服务模块是 Rescue 汽车救援平台的核心业务模块，提供多种类型的汽车救援服务，包括紧急救援、搭电救援、换胎服务、拖车服务、送油服务和现场维修等。该模块负责管理服务类型、价格计算、服务预约等功能。

### 功能特性

- **多种救援服务**: 支持6种主要救援服务类型
- **智能定价**: 基于距离、时间、紧急程度的动态定价
- **服务预约**: 支持即时救援和预约救援
- **拖车专业服务**: 提供多种拖车类型选择
- **费用透明**: 详细的费用计算和说明

---

## API 接口定义

### 1. 服务类型管理

#### 1.1 获取服务类型列表

**接口地址**: `GET /api/services/types`

**功能描述**: 获取所有可用的救援服务类型列表

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "emergency",
      "name": "紧急救援",
      "description": "24小时专业救援服务",
      "icon": "https://example.com/emergency_icon.svg",
      "price": "100",
      "responseTime": "30分钟",
      "serviceRange": "市区范围",
      "color": "#FF4444"
    },
    {
      "id": "battery",
      "name": "搭电救援",
      "description": "专业搭电服务",
      "icon": "https://example.com/battery_icon.svg",
      "price": "80",
      "responseTime": "45分钟",
      "serviceRange": "市区范围",
      "color": "#FFA500"
    },
    {
      "id": "tire",
      "name": "换胎服务",
      "description": "专业换胎服务",
      "icon": "https://example.com/tire_icon.svg",
      "price": "120",
      "responseTime": "45分钟",
      "serviceRange": "市区范围",
      "color": "#32CD32"
    },
    {
      "id": "tow",
      "name": "拖车服务",
      "description": "专业拖车服务",
      "icon": "https://example.com/tow_icon.svg",
      "price": "200",
      "responseTime": "60分钟",
      "serviceRange": "市区范围",
      "color": "#1E90FF"
    },
    {
      "id": "fuel",
      "name": "送油服务",
      "description": "紧急送油服务",
      "icon": "https://example.com/fuel_icon.svg",
      "price": "150",
      "responseTime": "45分钟",
      "serviceRange": "市区范围",
      "color": "#FF6347"
    },
    {
      "id": "repair",
      "name": "现场维修",
      "description": "现场故障维修",
      "icon": "https://example.com/repair_icon.svg",
      "price": "180",
      "responseTime": "60分钟",
      "serviceRange": "市区范围",
      "color": "#9370DB"
    }
  ]
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 服务类型唯一标识 |
| name | string | 服务名称 |
| description | string | 服务描述 |
| icon | string | 服务图标URL |
| price | string | 起步价格 |
| responseTime | string | 预计响应时间 |
| serviceRange | string | 服务范围 |
| color | string | 主题颜色 |

---

#### 1.2 获取服务详情

**接口地址**: `GET /api/services/types/{serviceId}`

**功能描述**: 获取指定服务类型的详细信息

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| serviceId | string | 是 | 服务类型ID |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "emergency",
    "name": "紧急救援",
    "description": "24小时专业救援服务",
    "icon": "https://example.com/emergency_icon.svg",
    "price": "100",
    "responseTime": "30分钟",
    "serviceRange": "市区范围",
    "color": "#FF4444",
    "features": [
      "24小时服务",
      "专业救援团队",
      "快速响应"
    ],
    "priceDetails": {
      "basePrice": 100,
      "distancePrice": 5,
      "timePrice": 2
    }
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| features | array | 服务特色列表 |
| priceDetails | object | 详细价格信息 |
| basePrice | number | 基础价格 |
| distancePrice | number | 每公里价格 |
| timePrice | number | 每分钟价格 |

---

### 2. 拖车服务

#### 2.1 获取拖车类型

**接口地址**: `GET /api/services/towing/types`

**功能描述**: 获取所有可用的拖车类型

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "flatbed",
      "name": "平板拖车",
      "description": "适用于轿车、SUV等小型车辆",
      "basePrice": 200,
      "pricePerKm": 5,
      "image": "https://example.com/flatbed.jpg",
      "features": ["安全稳定", "适用面广", "装卸方便"]
    },
    {
      "id": "wheel_lift",
      "name": "轮胎拖车",
      "description": "适用于前驱或后驱车辆",
      "basePrice": 150,
      "pricePerKm": 4,
      "image": "https://example.com/wheel_lift.jpg",
      "features": ["经济实惠", "操作简单", "适用性强"]
    },
    {
      "id": "heavy_duty",
      "name": "重型拖车",
      "description": "适用于大型车辆、货车等",
      "basePrice": 300,
      "pricePerKm": 8,
      "image": "https://example.com/heavy_duty.jpg",
      "features": ["承载力强", "专业设备", "安全可靠"]
    }
  ]
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| basePrice | number | 基础价格 |
| pricePerKm | number | 每公里价格 |
| image | string | 拖车类型图片 |
| features | array | 特色功能列表 |

---

#### 2.2 计算拖车费用

**接口地址**: `POST /api/services/towing/calculate`

**功能描述**: 根据拖车类型、距离等因素计算拖车费用

**请求参数**:
```json
{
  "towingType": "flatbed",
  "fromLocation": {
    "latitude": 39.9042,
    "longitude": 116.4074,
    "address": "北京市朝阳区"
  },
  "toLocation": {
    "latitude": 39.9142,
    "longitude": 116.4174,
    "address": "北京市海淀区"
  },
  "vehicleType": "sedan",
  "urgentLevel": "normal"
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| towingType | string | 是 | 拖车类型ID |
| fromLocation | object | 是 | 起始位置信息 |
| toLocation | object | 是 | 目标位置信息 |
| vehicleType | string | 是 | 车辆类型：sedan(轿车)、suv、truck等 |
| urgentLevel | string | 是 | 紧急程度：normal(普通)、urgent(紧急)、emergency(特急) |

**响应格式**:
```json
{
  "code": 200,
  "message": "计算成功",
  "data": {
    "distance": 15.5,
    "basePrice": 200,
    "distancePrice": 77.5,
    "urgentFee": 0,
    "totalPrice": 277.5,
    "estimatedTime": "45分钟"
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| distance | number | 拖车距离（公里） |
| basePrice | number | 基础费用 |
| distancePrice | number | 距离费用 |
| urgentFee | number | 加急费用 |
| totalPrice | number | 总费用 |
| estimatedTime | string | 预计用时 |

---

### 3. 服务预约

#### 3.1 预约救援服务

**接口地址**: `POST /api/services/appointment`

**功能描述**: 预约指定时间的救援服务

**请求参数**:
```json
{
  "serviceId": "battery",
  "vehicleId": "vehicle_123",
  "location": {
    "latitude": 39.9042,
    "longitude": 116.4074,
    "address": "北京市朝阳区建国路88号",
    "detailAddress": "停车场A区"
  },
  "scheduledTime": "2024-01-20T09:00:00Z",
  "contact": {
    "name": "张三",
    "phone": "13800138000"
  },
  "problemDescription": "车辆电瓶没电，需要搭电服务",
  "images": ["https://example.com/problem.jpg"]
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| serviceId | string | 是 | 服务类型ID |
| vehicleId | string | 是 | 车辆ID |
| location | object | 是 | 服务位置信息 |
| scheduledTime | string | 是 | 预约时间（ISO 8601格式） |
| contact | object | 是 | 联系人信息 |
| problemDescription | string | 是 | 问题描述 |
| images | array | 否 | 问题图片列表 |

**响应格式**:
```json
{
  "code": 200,
  "message": "预约成功",
  "data": {
    "appointmentId": "APPT_20240119_001",
    "status": "scheduled",
    "estimatedCost": 80,
    "scheduledTime": "2024-01-20T09:00:00Z",
    "createTime": "2024-01-19T10:30:00Z"
  }
}
```

---

#### 3.2 取消预约

**接口地址**: `PUT /api/services/appointment/{appointmentId}/cancel`

**功能描述**: 取消已预约的救援服务

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appointmentId | string | 是 | 预约ID |

**请求参数**:
```json
{
  "reason": "临时有事，需要取消预约"
}
```

---

#### 3.3 获取预约列表

**接口地址**: `GET /api/services/appointments`

**功能描述**: 获取用户的预约列表

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |
| status | string | 否 | 预约状态筛选 |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "APPT_20240119_001",
        "serviceType": "battery",
        "serviceName": "搭电救援",
        "status": "scheduled",
        "statusText": "已预约",
        "scheduledTime": "2024-01-20T09:00:00Z",
        "location": {
          "address": "北京市朝阳区建国路88号"
        },
        "estimatedCost": 80
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 10
  }
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 2001 | 服务类型不存在 |
| 2002 | 拖车类型不存在 |
| 2003 | 服务区域不支持 |
| 2004 | 预约时间无效 |
| 2005 | 预约时间冲突 |
| 2006 | 预约已取消，无法操作 |
| 2007 | 距离计算失败 |
| 2008 | 车辆类型不支持 |
| 2009 | 紧急程度参数错误 |
| 2010 | 服务暂时不可用 |

---

## 数据模型定义

### ServiceType 服务类型模型

```typescript
interface ServiceType {
  id: string;              // 服务类型ID
  name: string;            // 服务名称
  description: string;     // 服务描述
  icon: string;            // 图标URL
  price: string;           // 起步价格
  responseTime: string;    // 响应时间
  serviceRange: string;    // 服务范围
  color: string;           // 主题颜色
  features?: string[];     // 服务特色
  priceDetails?: {         // 价格详情
    basePrice: number;     // 基础价格
    distancePrice: number; // 每公里价格
    timePrice: number;     // 每分钟价格
  };
}
```

### TowingType 拖车类型模型

```typescript
interface TowingType {
  id: string;              // 拖车类型ID
  name: string;            // 拖车名称
  description: string;     // 描述
  basePrice: number;       // 基础价格
  pricePerKm: number;      // 每公里价格
  image: string;           // 图片URL
  features: string[];      // 特色功能
}
```

### Location 位置信息模型

```typescript
interface Location {
  latitude: number;        // 纬度
  longitude: number;       // 经度
  address: string;         // 地址
  detailAddress?: string;  // 详细地址
}
```

### PriceCalculation 价格计算模型

```typescript
interface PriceCalculation {
  distance: number;        // 距离
  basePrice: number;       // 基础价格
  distancePrice: number;   // 距离费用
  urgentFee: number;       // 加急费用
  totalPrice: number;      // 总价格
  estimatedTime: string;   // 预计时间
}
```

---

## 业务规则

1. **服务时间**: 紧急救援提供24小时服务，其他服务时间为8:00-22:00
2. **服务范围**: 市区范围内提供服务，郊区需要额外费用
3. **价格计算**: 基础价格 + 距离费用 + 时间费用 + 加急费用
4. **预约限制**: 预约时间必须在当前时间1小时后
5. **取消规则**: 预约开始前2小时可免费取消，否则收取30%费用
6. **拖车限制**: 拖车距离不超过100公里

---

## 安全考虑

1. **位置验证**: 验证服务位置是否在服务范围内
2. **价格保护**: 设置价格上限，防止异常计费
3. **预约验证**: 验证预约时间的合理性
4. **服务限制**: 限制单个用户的并发服务数量
5. **数据加密**: 敏感位置信息进行加密传输

---

## 测试用例

### 服务类型获取测试

```javascript
// 正常获取服务类型列表
const getServicesTest = async () => {
  const response = await fetch('/api/services/types');
  const data = await response.json();
  
  expect(data.code).toBe(200);
  expect(data.data).toBeInstanceOf(Array);
  expect(data.data.length).toBeGreaterThan(0);
};

// 获取特定服务详情
const getServiceDetailTest = async () => {
  const response = await fetch('/api/services/types/emergency');
  const data = await response.json();
  
  expect(data.code).toBe(200);
  expect(data.data.id).toBe('emergency');
  expect(data.data.priceDetails).toBeDefined();
};
```

### 拖车费用计算测试

```javascript
const calculateTowingTest = {
  towingType: "flatbed",
  fromLocation: {
    latitude: 39.9042,
    longitude: 116.4074,
    address: "北京市朝阳区"
  },
  toLocation: {
    latitude: 39.9142,
    longitude: 116.4174,
    address: "北京市海淀区"
  },
  vehicleType: "sedan",
  urgentLevel: "normal"
};

// 预期结果验证
const expectedResult = {
  distance: expect.any(Number),
  basePrice: expect.any(Number),
  totalPrice: expect.any(Number)
};
```

---

## 性能要求

- **服务类型查询**: 响应时间 < 200ms
- **费用计算**: 响应时间 < 500ms
- **预约创建**: 响应时间 < 1000ms
- **并发支持**: 支持500+并发预约请求
- **缓存策略**: 服务类型信息缓存1小时

---

## 监控指标

- **服务调用量**: 各服务类型的调用统计
- **预约成功率**: 预约创建成功率
- **取消率**: 预约取消率统计
- **响应时间**: 各接口平均响应时间
- **地理覆盖**: 服务地理位置分布统计

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0 | 2024-01-19 | 初始版本，包含基础救援服务功能 |