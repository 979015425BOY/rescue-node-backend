# 车辆管理模块 API 文档

## 模块概述

车辆管理模块负责用户车辆信息的管理，包括车辆的添加、编辑、删除、默认车辆设置等功能。该模块为救援服务提供车辆基础信息，支持多车辆管理，并提供车型数据查询服务。

### 功能特性

- **多车辆管理**: 支持用户管理多辆车辆
- **车型数据库**: 提供完整的车型品牌数据
- **默认车辆**: 支持设置默认车辆
- **车辆验证**: 车牌号、VIN码等信息验证
- **车辆分类**: 按车型、品牌等维度分类管理

---

## API 接口定义

### 1. 车辆信息管理

#### 1.1 获取用户车辆列表

**接口地址**: `GET /api/vehicles`

**功能描述**: 获取当前用户的所有车辆信息

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "vehicle_123",
      "brand": "奔驰",
      "model": "C200",
      "year": "2022",
      "licensePlate": "京A12345",
      "color": "白色",
      "engineNumber": "ABC123456",
      "vinNumber": "WDDGF4HB1CA123456",
      "isDefault": true,
      "createTime": "2024-01-19T10:30:00Z"
    }
  ]
}
```

---

#### 1.2 添加车辆

**接口地址**: `POST /api/vehicles`

**功能描述**: 添加新的车辆信息

**请求参数**:
```json
{
  "brand": "奔驰",
  "model": "C200",
  "year": "2022",
  "licensePlate": "京A12345",
  "color": "白色",
  "engineNumber": "ABC123456",
  "vinNumber": "WDDGF4HB1CA123456",
  "isDefault": false
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| brand | string | 是 | 车辆品牌 |
| model | string | 是 | 车型 |
| year | string | 是 | 年份 |
| licensePlate | string | 是 | 车牌号 |
| color | string | 是 | 车辆颜色 |
| engineNumber | string | 否 | 发动机号 |
| vinNumber | string | 否 | 车架号 |
| isDefault | boolean | 否 | 是否设为默认车辆 |

---

#### 1.3 更新车辆信息

**接口地址**: `PUT /api/vehicles/{vehicleId}`

**功能描述**: 更新指定车辆的信息

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| vehicleId | string | 是 | 车辆ID |

**请求参数**: 同添加车辆接口

---

#### 1.4 删除车辆

**接口地址**: `DELETE /api/vehicles/{vehicleId}`

**功能描述**: 删除指定车辆

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| vehicleId | string | 是 | 车辆ID |

---

#### 1.5 设置默认车辆

**接口地址**: `PUT /api/vehicles/{vehicleId}/default`

**功能描述**: 将指定车辆设置为默认车辆

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| vehicleId | string | 是 | 车辆ID |

---

### 2. 车型数据管理

#### 2.1 获取车型数据

**接口地址**: `GET /api/vehicles/models`

**功能描述**: 获取车型品牌和型号数据

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| brand | string | 否 | 品牌筛选 |
| keyword | string | 否 | 搜索关键词 |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "brands": [
      {
        "id": "benz",
        "name": "奔驰",
        "logo": "https://example.com/benz_logo.png",
        "models": [
          {
            "id": "c200",
            "name": "C200",
            "category": "轿车"
          }
        ]
      }
    ]
  }
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 4001 | 车辆不存在 |
| 4002 | 车牌号格式错误 |
| 4003 | 车牌号已存在 |
| 4004 | VIN码格式错误 |
| 4005 | 车辆品牌不存在 |
| 4006 | 车型不存在 |
| 4007 | 无法删除默认车辆 |
| 4008 | 车辆数量超限 |

---

## 数据模型定义

### Vehicle 车辆模型

```typescript
interface Vehicle {
  id: string;              // 车辆ID
  brand: string;           // 品牌
  model: string;           // 型号
  year: string;            // 年份
  licensePlate: string;    // 车牌号
  color: string;           // 颜色
  engineNumber?: string;   // 发动机号
  vinNumber?: string;      // 车架号
  isDefault: boolean;      // 是否默认车辆
  createTime: string;      // 创建时间
}
```

### VehicleBrand 车辆品牌模型

```typescript
interface VehicleBrand {
  id: string;              // 品牌ID
  name: string;            // 品牌名称
  logo: string;            // 品牌Logo
  models: VehicleModel[];  // 车型列表
}

interface VehicleModel {
  id: string;              // 车型ID
  name: string;            // 车型名称
  category: string;        // 车型分类
}
```

---

## 业务规则

1. **车牌号唯一性**: 同一用户不能添加相同车牌号的车辆
2. **默认车辆**: 每个用户必须有且只有一个默认车辆
3. **车辆数量限制**: 每个用户最多可添加10辆车辆
4. **车牌号格式**: 支持中国大陆车牌号格式验证
5. **VIN码验证**: 17位车架号格式验证

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0 | 2024-01-19 | 初始版本，包含基础车辆管理功能 |