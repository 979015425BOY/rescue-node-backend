# 内容管理模块 API 文档

## 模块概述

内容管理模块负责平台内容的展示和管理，包括轮播图、救援知识、救援案例等内容的获取和管理。该模块为用户提供丰富的救援相关知识和案例分享，提升用户体验和平台价值。

### 功能特性

- **轮播图管理**: 首页和发现页轮播图展示
- **救援知识库**: 专业的救援知识文章
- **案例分享**: 真实救援案例展示
- **内容分类**: 按类别组织内容
- **互动功能**: 点赞、收藏、分享等功能

---

## API 接口定义

### 1. 轮播图管理

#### 1.1 获取轮播图列表

**接口地址**: `GET /api/content/banners`

**功能描述**: 获取指定位置的轮播图列表

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| position | string | 否 | 位置：home(首页)、discover(发现页) |

**响应格式**:
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

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 轮播图ID |
| title | string | 标题 |
| image | string | 图片URL |
| link | string | 跳转链接 |
| linkType | string | 链接类型：page(页面)、url(外链)、none(无链接) |
| sort | number | 排序权重 |
| status | string | 状态：active(激活)、inactive(停用) |

---

### 2. 救援知识管理

#### 2.1 获取救援知识列表

**接口地址**: `GET /api/content/knowledge`

**功能描述**: 获取救援知识文章列表

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |
| category | string | 否 | 分类筛选 |
| keyword | string | 否 | 搜索关键词 |

**响应格式**:
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

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| summary | string | 文章摘要 |
| category | string | 文章分类 |
| readCount | number | 阅读次数 |
| publishTime | string | 发布时间 |

---

#### 2.2 获取救援知识详情

**接口地址**: `GET /api/content/knowledge/{knowledgeId}`

**功能描述**: 获取指定救援知识的详细内容

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| knowledgeId | string | 是 | 知识文章ID |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "knowledge_001",
    "title": "车辆电瓶没电怎么办",
    "summary": "车辆电瓶没电的应急处理方法",
    "content": "详细的文章内容...",
    "image": "https://example.com/knowledge1.jpg",
    "category": "电瓶问题",
    "tags": ["电瓶", "应急处理", "自救"],
    "readCount": 1250,
    "likeCount": 85,
    "collectCount": 32,
    "publishTime": "2024-01-19T10:30:00Z",
    "author": {
      "name": "救援专家",
      "avatar": "https://example.com/expert_avatar.jpg"
    }
  }
}
```

---

#### 2.3 获取知识分类

**接口地址**: `GET /api/content/knowledge/categories`

**功能描述**: 获取救援知识的分类列表

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "battery",
      "name": "电瓶问题",
      "icon": "https://example.com/battery_icon.svg",
      "count": 15
    },
    {
      "id": "tire",
      "name": "轮胎问题",
      "icon": "https://example.com/tire_icon.svg",
      "count": 12
    }
  ]
}
```

---

#### 2.4 搜索救援知识

**接口地址**: `GET /api/content/knowledge/search`

**功能描述**: 搜索救援知识文章

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 是 | 搜索关键词 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

---

### 3. 救援案例管理

#### 3.1 获取救援案例列表

**接口地址**: `GET /api/content/cases`

**功能描述**: 获取救援案例列表

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |
| category | string | 否 | 分类筛选 |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "case_001",
        "title": "高速公路紧急救援案例",
        "summary": "某用户在高速公路上车辆故障的救援过程",
        "image": "https://example.com/case1.jpg",
        "category": "紧急救援",
        "location": "京沪高速",
        "rescueTime": "25分钟",
        "likeCount": 156,
        "publishTime": "2024-01-19T10:30:00Z"
      }
    ],
    "total": 30,
    "page": 1,
    "pageSize": 10
  }
}
```

---

#### 3.2 获取救援案例详情

**接口地址**: `GET /api/content/cases/{caseId}`

**功能描述**: 获取指定救援案例的详细内容

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "case_001",
    "title": "高速公路紧急救援案例",
    "summary": "某用户在高速公路上车辆故障的救援过程",
    "content": "详细的案例内容...",
    "images": [
      "https://example.com/case1_1.jpg",
      "https://example.com/case1_2.jpg"
    ],
    "category": "紧急救援",
    "location": "京沪高速",
    "rescueTime": "25分钟",
    "vehicleInfo": "奔驰C200",
    "problemType": "发动机故障",
    "solution": "现场维修",
    "likeCount": 156,
    "isLiked": false,
    "publishTime": "2024-01-19T10:30:00Z"
  }
}
```

---

#### 3.3 点赞救援案例

**接口地址**: `POST /api/content/cases/{caseId}/like`

**功能描述**: 对救援案例进行点赞或取消点赞

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| caseId | string | 是 | 案例ID |

**响应格式**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "isLiked": true,
    "likeCount": 157
  }
}
```

---

### 4. 内容互动

#### 4.1 收藏内容

**接口地址**: `POST /api/content/collect`

**功能描述**: 收藏知识文章或案例

**请求参数**:
```json
{
  "contentId": "knowledge_001",
  "contentType": "knowledge"
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| contentId | string | 是 | 内容ID |
| contentType | string | 是 | 内容类型：knowledge(知识)、case(案例) |

---

#### 4.2 获取收藏列表

**接口地址**: `GET /api/content/collections`

**功能描述**: 获取用户的收藏列表

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| contentType | string | 否 | 内容类型筛选 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

---

#### 4.3 分享内容

**接口地址**: `POST /api/content/share`

**功能描述**: 记录内容分享行为

**请求参数**:
```json
{
  "contentId": "knowledge_001",
  "contentType": "knowledge",
  "platform": "wechat"
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 6001 | 内容不存在 |
| 6002 | 内容已下线 |
| 6003 | 分类不存在 |
| 6004 | 搜索关键词为空 |
| 6005 | 已收藏该内容 |
| 6006 | 收藏不存在 |
| 6007 | 分享平台不支持 |

---

## 数据模型定义

### Banner 轮播图模型

```typescript
interface Banner {
  id: string;              // 轮播图ID
  title: string;           // 标题
  image: string;           // 图片URL
  link: string;            // 跳转链接
  linkType: LinkType;      // 链接类型
  sort: number;            // 排序权重
  status: string;          // 状态
}

enum LinkType {
  PAGE = 'page',           // 页面跳转
  URL = 'url',             // 外链
  NONE = 'none'            // 无链接
}
```

### Knowledge 救援知识模型

```typescript
interface Knowledge {
  id: string;              // 知识ID
  title: string;           // 标题
  summary: string;         // 摘要
  content?: string;        // 详细内容
  image: string;           // 封面图片
  category: string;        // 分类
  tags?: string[];         // 标签
  readCount: number;       // 阅读次数
  likeCount?: number;      // 点赞次数
  collectCount?: number;   // 收藏次数
  publishTime: string;     // 发布时间
  author?: Author;         // 作者信息
}

interface Author {
  name: string;            // 作者姓名
  avatar: string;          // 作者头像
}
```

### Case 救援案例模型

```typescript
interface Case {
  id: string;              // 案例ID
  title: string;           // 标题
  summary: string;         // 摘要
  content?: string;        // 详细内容
  images: string[];        // 图片列表
  category: string;        // 分类
  location: string;        // 救援地点
  rescueTime: string;      // 救援用时
  vehicleInfo?: string;    // 车辆信息
  problemType?: string;    // 问题类型
  solution?: string;       // 解决方案
  likeCount: number;       // 点赞次数
  isLiked?: boolean;       // 是否已点赞
  publishTime: string;     // 发布时间
}
```

---

## 业务规则

1. **内容审核**: 所有内容发布前需要审核
2. **分类管理**: 内容按分类组织，便于用户查找
3. **互动限制**: 用户对同一内容只能点赞一次
4. **收藏限制**: 用户最多可收藏500个内容
5. **搜索优化**: 支持标题、内容、标签的全文搜索

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0 | 2024-01-19 | 初始版本，包含基础内容管理功能 |