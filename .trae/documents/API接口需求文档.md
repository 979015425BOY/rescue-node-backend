# Rescue 汽车救援平台 API 接口需求文档

## 文档概述

本文档基于 Rescue 汽车救援平台的前端代码分析，梳理出项目运行所需的完整后端 API 接口。该平台是一个基于 uni-app 开发的多端汽车救援服务应用，支持 H5、微信小程序和 App 平台。

### 项目技术栈
- **前端框架**: uni-app + Vue3 + TypeScript
- **状态管理**: Vuex 4.x
- **UI组件**: uni-ui
- **地图服务**: 高德地图
- **图表库**: lime-echart

### 核心业务模块
1. **用户管理模块** - 用户注册、登录、个人信息管理
2. **救援服务模块** - 救援服务类型、服务预约、紧急救援
3. **订单管理模块** - 订单创建、状态跟踪、订单评价
4. **车辆管理模块** - 车辆信息管理、默认车辆设置
5. **企业认证模块** - 企业用户认证、资质审核
6. **内容管理模块** - 轮播图、救援知识、案例分享
7. **消息通知模块** - 系统消息、订单通知
8. **地理位置模块** - 定位服务、地址解析

---

## 1. 用户管理模块 API

### 1.1 用户注册与登录

#### 1.1.1 发送短信验证码
```http
POST /api/auth/sms/send
```

**请求参数:**
```json
{
  "phone": "13800138000",
  "type": "login|register|reset_password"
}
```

**响应格式:**
```json
{
  "code": 200,
  "message": "验证码发送成功",
  "data": {
    "countdown": 60
  }
}
```

#### 1.1.2 短信验证码登录
```http
POST /api/auth/login/sms
```

**请求参数:**
```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

**响应格式:**
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

#### 1.1.3 密码登录
```http
POST /api/auth/login/password
```

**请求参数:**
```json
{
  "phone": "13800138000",
  "password": "password123"
}
```

#### 1.1.5 用户注册
```http
POST /api/auth/register
```

**请求参数:**
```json
{
  "phone": "13800138000",
  "code": "123456",
  "password": "password123",
  "username": "用户昵称",
  "inviteCode": "INVITE123"
}
```

#### 1.1.6 重置密码
```http
POST /api/auth/password/reset
```

**请求参数:**
```json
{
  "phone": "13800138000",
  "code": "123456",
  "newPassword": "newpassword123"
}
```

#### 1.1.7 刷新Token
```http
POST /api/auth/token/refresh
```

**请求参数:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 1.1.8 退出登录
```http
POST /api/auth/logout
```

### 1.2 用户信息管理

#### 1.2.1 获取用户信息
```http
GET /api/user/profile
```

**响应格式:**
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

#### 1.2.2 更新用户信息
```http
PUT /api/user/profile
```

**请求参数:**
```json
{
  "nickname": "新昵称",
  "email": "newemail@example.com",
  "realName": "李四",
  "idCard": "110101199001011234",
  "emergencyContact": "王五",
  "emergencyPhone": "13700137000",
  "address": "北京市海淀区"
}
```

#### 1.2.3 上传头像
```http
POST /api/user/avatar/upload
```

**请求参数:** FormData
- `avatar`: 头像文件

**响应格式:**
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "avatarUrl": "https://example.com/new_avatar.jpg"
  }
}
```

#### 1.2.4 修改密码
```http
PUT /api/user/password/change
```

**请求参数:**
```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "code": "123456"
}
```

---

## 2. 救援服务模块 API

### 2.1 服务类型管理

#### 2.1.1 获取服务类型列表
```http
GET /api/services/types
```

**响应格式:**
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

#### 2.1.2 获取服务详情
```http
GET /api/services/types/{serviceId}
```

**响应格式:**
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

### 2.2 拖车服务

#### 2.2.1 获取拖车类型
```http
GET /api/services/towing/types
```

**响应格式:**
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

#### 2.2.2 计算拖车费用
```http
POST /api/services/towing/calculate
```

**请求参数:**
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

**响应格式:**
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

---

## 3. 订单管理模块 API

### 3.1 订单创建与管理

#### 3.1.1 创建救援订单
```http
POST /api/orders/rescue
```

**请求参数:**
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

**响应格式:**
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

#### 3.1.2 创建拖车订单
```http
POST /api/orders/towing
```

**请求参数:**
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

#### 3.1.3 获取订单列表
```http
GET /api/orders
```

**查询参数:**
- `page`: 页码 (默认: 1)
- `pageSize`: 每页数量 (默认: 10)
- `status`: 订单状态 (可选: pending, confirmed, in_progress, completed, cancelled, evaluate)
- `serviceType`: 服务类型 (可选)

**响应格式:**
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

#### 3.1.4 获取订单详情
```http
GET /api/orders/{orderId}
```

**响应格式:**
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

#### 3.1.5 取消订单
```http
PUT /api/orders/{orderId}/cancel
```

**请求参数:**
```json
{
  "reason": "临时有事，不需要救援了"
}
```

#### 3.1.6 确认订单完成
```http
PUT /api/orders/{orderId}/complete
```

**请求参数:**
```json
{
  "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "actualAmount": 150,
  "completionNotes": "救援完成，车辆已正常启动"
}
```

### 3.2 订单评价

#### 3.2.1 提交订单评价
```http
POST /api/orders/{orderId}/evaluate
```

**请求参数:**
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

**响应格式:**
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

#### 3.2.2 获取订单评价
```http
GET /api/orders/{orderId}/evaluate
```

---

## 4. 车辆管理模块 API

### 4.1 车辆信息管理

#### 4.1.1 获取用户车辆列表
```http
GET /api/vehicles
```

**响应格式:**
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

#### 4.1.2 添加车辆
```http
POST /api/vehicles
```

**请求参数:**
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

#### 4.1.3 更新车辆信息
```http
PUT /api/vehicles/{vehicleId}
```

#### 4.1.4 删除车辆
```http
DELETE /api/vehicles/{vehicleId}
```

#### 4.1.5 设置默认车辆
```http
PUT /api/vehicles/{vehicleId}/default
```

#### 4.1.6 获取车型数据
```http
GET /api/vehicles/models
```

**查询参数:**
- `brand`: 品牌 (可选)
- `keyword`: 搜索关键词 (可选)

**响应格式:**
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

## 5. 企业认证模块 API

### 5.1 企业认证

#### 5.1.1 提交企业认证申请
```http
POST /api/enterprise/auth/apply
```

**请求参数:**
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

**响应格式:**
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

#### 5.1.2 获取认证状态
```http
GET /api/enterprise/auth/status
```

**响应格式:**
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

---

## 6. 内容管理模块 API

### 6.1 轮播图管理

#### 6.1.1 获取轮播图列表
```http
GET /api/content/banners
```

**查询参数:**
- `position`: 位置 (home, discover)

**响应格式:**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "banner_001",
      "title": "24小时救援服务",
      "image": "https://example.com/banner1.jpg",
      "link": "/pages/home/service-type",
      "linkType": "page",
      "sort": 1,
      "status": "active"
    }
  ]
}
```

### 6.2 救援知识

#### 6.2.1 获取救援知识列表
```http
GET /api/content/knowledge
```

**查询参数:**
- `page`: 页码
- `pageSize`: 每页数量
- `category`: 分类

**响应格式:**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "knowledge_001",
        "title": "车辆电瓶没电怎么办",
        "summary": "车辆电瓶没电的应急处理方法",
        "image": "https://example.com/knowledge1.jpg",
        "category": "电瓶问题",
        "readCount": 1250,
        "publishTime": "2024-01-19T10:30:00Z"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 10
  }
}
```

#### 6.2.2 获取救援知识详情
```http
GET /api/content/knowledge/{knowledgeId}
```

### 6.3 救援案例

#### 6.3.1 获取救援案例列表
```http
GET /api/content/cases
```

#### 6.3.2 点赞救援案例
```http
POST /api/content/cases/{caseId}/like
```

---

## 7. 消息通知模块 API

### 7.1 消息管理

#### 7.1.1 获取消息列表
```http
GET /api/messages
```

**查询参数:**
- `page`: 页码
- `pageSize`: 每页数量
- `type`: 消息类型 (system, order, promotion)
- `status`: 状态 (unread, read)

**响应格式:**
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

#### 7.1.2 标记消息已读
```http
PUT /api/messages/{messageId}/read
```

#### 7.1.3 批量标记已读
```http
PUT /api/messages/batch/read
```

**请求参数:**
```json
{
  "messageIds": ["msg_001", "msg_002", "msg_003"]
}
```

#### 7.1.4 获取未读消息数量
```http
GET /api/messages/unread/count
```

---

## 8. 地理位置模块 API

### 8.1 位置服务

#### 8.1.1 地址解析 (逆地理编码)
```http
GET /api/location/geocode/reverse
```

**查询参数:**
- `latitude`: 纬度
- `longitude`: 经度

**响应格式:**
```json
{
  "code": 200,
  "message": "解析成功",
  "data": {
    "address": "北京市朝阳区建国路88号",
    "province": "北京市",
    "city": "北京市",
    "district": "朝阳区",
    "street": "建国路",
    "streetNumber": "88号",
    "adcode": "110105"
  }
}
```

#### 8.1.2 地址搜索
```http
GET /api/location/search
```

**查询参数:**
- `keyword`: 搜索关键词
- `city`: 城市 (可选)
- `page`: 页码
- `pageSize`: 每页数量

**响应格式:**
```json
{
  "code": 200,
  "message": "搜索成功",
  "data": {
    "list": [
      {
        "id": "poi_001",
        "name": "北京朝阳医院",
        "address": "北京市朝阳区工人体育场南路8号",
        "latitude": 39.9042,
        "longitude": 116.4074,
        "category": "医疗服务"
      }
    ],
    "total": 25
  }
}
```

#### 8.1.3 获取城市列表
```http
GET /api/location/cities
```

---

## 9. 文件上传模块 API

### 9.1 文件上传

#### 9.1.1 上传图片
```http
POST /api/upload/image
```

**请求参数:** FormData
- `file`: 图片文件
- `type`: 上传类型 (avatar, problem, license, signature)

**响应格式:**
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "url": "https://example.com/uploads/image_123.jpg",
    "filename": "image_123.jpg",
    "size": 1024000
  }
}
```

#### 9.1.2 批量上传图片
```http
POST /api/upload/images/batch
```

---

## 10. 系统配置模块 API

### 10.1 系统配置

#### 10.1.1 获取系统配置
```http
GET /api/system/config
```

**响应格式:**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "appVersion": "1.0.0",
    "minVersion": "1.0.0",
    "updateUrl": "https://example.com/app.apk",
    "hotline": "400-123-4567",
    "serviceTime": "24小时",
    "agreementUrl": "https://example.com/agreement.html",
    "privacyUrl": "https://example.com/privacy.html",
    "aboutUs": "关于我们的介绍",
    "contactInfo": {
      "phone": "400-123-4567",
      "email": "service@rescue.com",
      "address": "北京市朝阳区建国路88号"
    }
  }
}
```

#### 10.1.2 检查版本更新
```http
GET /api/system/version/check
```

**查询参数:**
- `platform`: 平台 (android, ios, h5)
- `currentVersion`: 当前版本

---

## 11. 统计分析模块 API

### 11.1 用户统计

#### 11.1.1 获取用户统计数据
```http
GET /api/statistics/user
```

**响应格式:**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "totalOrders": 25,
    "completedOrders": 20,
    "totalAmount": 3500,
    "totalPoints": 1500,
    "memberLevel": "VIP会员"
  }
}
```

---

## 12. 通用响应格式

### 12.1 成功响应
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 12.2 错误响应
```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": null,
  "errors": [
    {
      "field": "phone",
      "message": "手机号格式不正确"
    }
  ]
}
```

### 12.3 状态码说明
- `200`: 成功
- `400`: 请求参数错误
- `401`: 未授权/登录过期
- `403`: 权限不足
- `404`: 资源不存在
- `500`: 服务器内部错误

---

## 13. 认证与授权

### 13.1 请求头设置
```http
Authorization: Bearer {accessToken}
Content-Type: application/json
x-source: rescue-app
```

### 13.2 Token 刷新机制
当 `accessToken` 过期时，使用 `refreshToken` 获取新的 `accessToken`。

---

## 14. 接口调用频率限制

### 14.1 限制规则
- 短信验证码：同一手机号 1分钟内最多发送 1次
- 文件上传：单个用户每分钟最多上传 10个文件
- 订单创建：单个用户每分钟最多创建 5个订单

---

## 15. 数据库设计建议

### 15.1 核心表结构
1. **用户表 (users)**
2. **车辆表 (vehicles)**
3. **订单表 (orders)**
4. **订单状态记录表 (order_status_logs)**
5. **服务类型表 (service_types)**
6. **司机表 (drivers)**
7. **评价表 (evaluations)**
8. **消息表 (messages)**
9. **企业认证表 (enterprise_auth)**
10. **内容管理表 (contents)**

---

## 16. 部署与运维

### 16.1 环境要求
- **开发环境**: 用于开发测试
- **测试环境**: 用于功能测试
- **生产环境**: 用于正式运营

### 16.2 监控指标
- API 响应时间
- 错误率统计
- 并发用户数
- 订单完成率

---

## 总结

本文档基于 Rescue 汽车救援平台前端代码分析，详细梳理了项目运行所需的完整后端 API 接口。涵盖了用户管理、救援服务、订单管理、车辆管理、企业认证、内容管理、消息通知、地理位置、文件上传、系统配置等核心业务模块。

后端开发团队可以基于此文档进行 API 接口的设计与实现，确保前后端的完美对接，为用户提供稳定可靠的汽车救援服务。