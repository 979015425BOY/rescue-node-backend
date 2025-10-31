# 地理位置模块 API 文档

## 模块概述

地理位置模块负责处理平台中所有与地理位置相关的功能，包括位置获取、地址解析、距离计算、区域管理等。该模块为救援服务提供精准的位置支持，确保救援人员能够快速找到用户位置。

### 功能特性

- **位置获取**: 支持GPS定位和网络定位
- **地址解析**: 地理坐标与地址的相互转换
- **距离计算**: 计算两点间距离和预估时间
- **区域管理**: 服务区域和热点区域管理
- **地图服务**: 集成第三方地图服务

---

## API 接口定义

### 1. 位置服务

#### 1.1 获取当前位置

**接口地址**: `GET /api/location/current`

**功能描述**: 获取用户当前位置信息

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 否 | 定位类型：gps、network，默认gps |
| accuracy | string | 否 | 精度要求：high、medium、low |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "latitude": 39.908823,
    "longitude": 116.397470,
    "accuracy": 10.5,
    "altitude": 45.2,
    "speed": 0,
    "heading": 0,
    "timestamp": "2024-01-19T10:30:00Z",
    "address": {
      "province": "北京市",
      "city": "北京市",
      "district": "朝阳区",
      "street": "建国门外大街",
      "streetNumber": "1号",
      "formatted": "北京市朝阳区建国门外大街1号"
    }
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| latitude | number | 纬度 |
| longitude | number | 经度 |
| accuracy | number | 定位精度（米） |
| altitude | number | 海拔高度（米） |
| speed | number | 移动速度（米/秒） |
| heading | number | 移动方向（度） |
| address | object | 地址信息 |

---

#### 1.2 地理编码

**接口地址**: `GET /api/location/geocode`

**功能描述**: 将地址转换为地理坐标

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| address | string | 是 | 地址信息 |
| city | string | 否 | 城市限制 |

**响应格式**:
```json
{
  "code": 200,
  "message": "转换成功",
  "data": {
    "results": [
      {
        "latitude": 39.908823,
        "longitude": 116.397470,
        "address": {
          "province": "北京市",
          "city": "北京市",
          "district": "朝阳区",
          "street": "建国门外大街",
          "streetNumber": "1号",
          "formatted": "北京市朝阳区建国门外大街1号"
        },
        "confidence": 0.95,
        "level": "门牌号"
      }
    ]
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| confidence | number | 匹配置信度 |
| level | string | 匹配级别：省、市、区、街道、门牌号 |

---

#### 1.3 逆地理编码

**接口地址**: `GET /api/location/reverse-geocode`

**功能描述**: 将地理坐标转换为地址信息

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| latitude | number | 是 | 纬度 |
| longitude | number | 是 | 经度 |
| radius | number | 否 | 搜索半径（米），默认1000 |

**响应格式**:
```json
{
  "code": 200,
  "message": "转换成功",
  "data": {
    "address": {
      "province": "北京市",
      "city": "北京市",
      "district": "朝阳区",
      "street": "建国门外大街",
      "streetNumber": "1号",
      "formatted": "北京市朝阳区建国门外大街1号",
      "adcode": "110105"
    },
    "pois": [
      {
        "name": "国贸大厦",
        "type": "商务楼宇",
        "distance": 50.2,
        "latitude": 39.908900,
        "longitude": 116.397500
      }
    ]
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| adcode | string | 行政区划代码 |
| pois | array | 周边兴趣点 |
| distance | number | 距离（米） |

---

### 2. 距离计算

#### 2.1 计算两点距离

**接口地址**: `GET /api/location/distance`

**功能描述**: 计算两个地理位置之间的距离

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| fromLat | number | 是 | 起点纬度 |
| fromLng | number | 是 | 起点经度 |
| toLat | number | 是 | 终点纬度 |
| toLng | number | 是 | 终点经度 |
| type | string | 否 | 计算类型：straight、driving，默认straight |

**响应格式**:
```json
{
  "code": 200,
  "message": "计算成功",
  "data": {
    "distance": 1250.5,
    "duration": 180,
    "route": {
      "steps": [
        {
          "instruction": "向北行驶",
          "distance": 500,
          "duration": 60,
          "polyline": "encoded_polyline_string"
        }
      ],
      "polyline": "encoded_route_polyline"
    }
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| distance | number | 距离（米） |
| duration | number | 预估时间（秒） |
| route | object | 路线信息（driving类型时返回） |
| polyline | string | 路线编码字符串 |

---

#### 2.2 批量距离计算

**接口地址**: `POST /api/location/distance/batch`

**功能描述**: 批量计算多个目标点到起点的距离

**请求参数**:
```json
{
  "origin": {
    "latitude": 39.908823,
    "longitude": 116.397470
  },
  "destinations": [
    {
      "latitude": 39.918823,
      "longitude": 116.407470
    },
    {
      "latitude": 39.928823,
      "longitude": 116.417470
    }
  ],
  "type": "driving"
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| origin | object | 是 | 起点坐标 |
| destinations | array | 是 | 目标点列表，最多20个 |
| type | string | 否 | 计算类型 |

**响应格式**:
```json
{
  "code": 200,
  "message": "计算成功",
  "data": {
    "results": [
      {
        "index": 0,
        "distance": 1250.5,
        "duration": 180
      },
      {
        "index": 1,
        "distance": 2100.8,
        "duration": 300
      }
    ]
  }
}
```

---

### 3. 区域管理

#### 3.1 获取服务区域

**接口地址**: `GET /api/location/service-areas`

**功能描述**: 获取平台服务覆盖区域

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| city | string | 否 | 城市筛选 |
| type | string | 否 | 服务类型：rescue、towing |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "areas": [
      {
        "id": "area_001",
        "name": "北京市朝阳区",
        "city": "北京市",
        "district": "朝阳区",
        "boundary": [
          {
            "latitude": 39.908823,
            "longitude": 116.397470
          }
        ],
        "serviceTypes": ["rescue", "towing"],
        "status": "active"
      }
    ]
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| boundary | array | 区域边界坐标点 |
| serviceTypes | array | 支持的服务类型 |
| status | string | 区域状态：active、inactive |

---

#### 3.2 检查位置是否在服务区域

**接口地址**: `GET /api/location/check-service-area`

**功能描述**: 检查指定位置是否在服务覆盖范围内

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| latitude | number | 是 | 纬度 |
| longitude | number | 是 | 经度 |
| serviceType | string | 否 | 服务类型 |

**响应格式**:
```json
{
  "code": 200,
  "message": "检查完成",
  "data": {
    "inServiceArea": true,
    "areaInfo": {
      "id": "area_001",
      "name": "北京市朝阳区",
      "serviceTypes": ["rescue", "towing"]
    },
    "nearestArea": null
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| inServiceArea | boolean | 是否在服务区域内 |
| areaInfo | object | 所在区域信息 |
| nearestArea | object | 最近的服务区域（不在服务区域时返回） |

---

### 4. 地址搜索

#### 4.1 地址搜索

**接口地址**: `GET /api/location/search`

**功能描述**: 根据关键词搜索地址

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 是 | 搜索关键词 |
| city | string | 否 | 城市限制 |
| type | string | 否 | 搜索类型：all、poi、address |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |

**响应格式**:
```json
{
  "code": 200,
  "message": "搜索成功",
  "data": {
    "results": [
      {
        "id": "poi_001",
        "name": "国贸大厦",
        "type": "商务楼宇",
        "address": {
          "province": "北京市",
          "city": "北京市",
          "district": "朝阳区",
          "street": "建国门外大街",
          "streetNumber": "1号",
          "formatted": "北京市朝阳区建国门外大街1号"
        },
        "location": {
          "latitude": 39.908823,
          "longitude": 116.397470
        },
        "distance": 1250.5
      }
    ],
    "total": 25
  }
}
```

---

#### 4.2 周边搜索

**接口地址**: `GET /api/location/nearby`

**功能描述**: 搜索指定位置周边的兴趣点

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| latitude | number | 是 | 中心点纬度 |
| longitude | number | 是 | 中心点经度 |
| keyword | string | 否 | 搜索关键词 |
| category | string | 否 | 分类：gas_station、hospital、hotel等 |
| radius | number | 否 | 搜索半径（米），默认1000 |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |

**响应格式**:
```json
{
  "code": 200,
  "message": "搜索成功",
  "data": {
    "results": [
      {
        "id": "poi_002",
        "name": "中石化加油站",
        "category": "gas_station",
        "address": {
          "formatted": "北京市朝阳区建国门外大街2号"
        },
        "location": {
          "latitude": 39.909823,
          "longitude": 116.398470
        },
        "distance": 150.2,
        "phone": "010-12345678",
        "rating": 4.5,
        "businessHours": "24小时营业"
      }
    ],
    "total": 8
  }
}
```

---

### 5. 位置历史

#### 5.1 保存位置记录

**接口地址**: `POST /api/location/history`

**功能描述**: 保存用户位置历史记录

**请求参数**:
```json
{
  "latitude": 39.908823,
  "longitude": 116.397470,
  "address": {
    "formatted": "北京市朝阳区建国门外大街1号"
  },
  "type": "manual",
  "description": "公司地址"
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| latitude | number | 是 | 纬度 |
| longitude | number | 是 | 经度 |
| address | object | 是 | 地址信息 |
| type | string | 是 | 记录类型：manual、auto |
| description | string | 否 | 位置描述 |

---

#### 5.2 获取位置历史

**接口地址**: `GET /api/location/history`

**功能描述**: 获取用户的位置历史记录

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 否 | 记录类型筛选 |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "history_001",
        "latitude": 39.908823,
        "longitude": 116.397470,
        "address": {
          "formatted": "北京市朝阳区建国门外大街1号"
        },
        "type": "manual",
        "description": "公司地址",
        "createTime": "2024-01-19T10:30:00Z",
        "useCount": 5
      }
    ],
    "total": 15
  }
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 8001 | 定位失败 |
| 8002 | 地址解析失败 |
| 8003 | 坐标格式错误 |
| 8004 | 超出服务区域 |
| 8005 | 距离计算失败 |
| 8006 | 地图服务不可用 |
| 8007 | 搜索结果为空 |
| 8008 | 批量请求超限 |

---

## 数据模型定义

### Location 位置模型

```typescript
interface Location {
  latitude: number;              // 纬度
  longitude: number;             // 经度
  accuracy?: number;             // 精度
  altitude?: number;             // 海拔
  speed?: number;                // 速度
  heading?: number;              // 方向
  timestamp?: string;            // 时间戳
}

interface Address {
  province: string;              // 省份
  city: string;                  // 城市
  district: string;              // 区县
  street: string;                // 街道
  streetNumber: string;          // 门牌号
  formatted: string;             // 格式化地址
  adcode?: string;               // 行政区划代码
}
```

### POI 兴趣点模型

```typescript
interface POI {
  id: string;                    // POI ID
  name: string;                  // 名称
  type: string;                  // 类型
  category: string;              // 分类
  address: Address;              // 地址
  location: Location;            // 位置
  distance?: number;             // 距离
  phone?: string;                // 电话
  rating?: number;               // 评分
  businessHours?: string;        // 营业时间
}
```

### ServiceArea 服务区域模型

```typescript
interface ServiceArea {
  id: string;                    // 区域ID
  name: string;                  // 区域名称
  city: string;                  // 城市
  district: string;              // 区县
  boundary: Location[];          // 边界坐标
  serviceTypes: string[];        // 服务类型
  status: AreaStatus;            // 区域状态
}

enum AreaStatus {
  ACTIVE = 'active',             // 激活
  INACTIVE = 'inactive'          // 停用
}
```

---

## 业务规则

1. **定位精度**: GPS定位精度要求在50米以内
2. **服务区域**: 只在指定服务区域内提供救援服务
3. **历史记录**: 位置历史记录保留30天
4. **搜索限制**: 单次搜索最多返回50个结果
5. **批量限制**: 批量距离计算最多支持20个目标点

---

## 安全考虑

1. **位置隐私**: 用户位置信息加密存储
2. **权限控制**: 位置获取需要用户授权
3. **数据脱敏**: 历史位置数据定期清理
4. **访问限制**: API调用频率限制
5. **数据传输**: 位置数据传输使用HTTPS

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0 | 2024-01-19 | 初始版本，包含基础地理位置功能 |