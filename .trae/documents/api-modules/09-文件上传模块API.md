# 文件上传模块 API 文档

## 模块概述

文件上传模块负责处理平台中所有文件上传相关的功能，包括图片上传、文档上传、音视频上传等。该模块支持多种文件格式，提供文件预处理、存储管理、访问控制等功能，为救援服务提供完整的文件管理解决方案。

### 功能特性

- **多格式支持**: 支持图片、文档、音视频等多种文件格式
- **文件预处理**: 图片压缩、格式转换、水印添加
- **存储管理**: 云存储集成，支持CDN加速
- **安全控制**: 文件类型检查、病毒扫描、访问权限控制
- **批量操作**: 支持批量上传和管理

---

## API 接口定义

### 1. 文件上传

#### 1.1 单文件上传

**接口地址**: `POST /api/upload/single`

**功能描述**: 上传单个文件

**请求方式**: `multipart/form-data`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | File | 是 | 上传的文件 |
| type | string | 是 | 文件类型：image、document、video、audio |
| category | string | 否 | 文件分类：avatar、license、order、feedback |
| compress | boolean | 否 | 是否压缩（图片类型），默认true |
| watermark | boolean | 否 | 是否添加水印（图片类型），默认false |

**响应格式**:
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "fileId": "file_20240119_001",
    "fileName": "example.jpg",
    "originalName": "用户头像.jpg",
    "fileSize": 1024000,
    "mimeType": "image/jpeg",
    "url": "https://cdn.example.com/files/file_20240119_001.jpg",
    "thumbnailUrl": "https://cdn.example.com/thumbnails/file_20240119_001_thumb.jpg",
    "uploadTime": "2024-01-19T10:30:00Z",
    "expiresAt": "2024-07-19T10:30:00Z",
    "metadata": {
      "width": 1920,
      "height": 1080,
      "format": "JPEG",
      "compressed": true,
      "watermarked": false
    }
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| fileId | string | 文件唯一标识 |
| fileName | string | 存储文件名 |
| originalName | string | 原始文件名 |
| fileSize | number | 文件大小（字节） |
| mimeType | string | 文件MIME类型 |
| url | string | 文件访问URL |
| thumbnailUrl | string | 缩略图URL（图片类型） |
| expiresAt | string | 过期时间 |
| metadata | object | 文件元数据 |

---

#### 1.2 批量文件上传

**接口地址**: `POST /api/upload/batch`

**功能描述**: 批量上传多个文件

**请求方式**: `multipart/form-data`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| files | File[] | 是 | 上传的文件列表，最多10个 |
| type | string | 是 | 文件类型 |
| category | string | 否 | 文件分类 |
| compress | boolean | 否 | 是否压缩 |
| watermark | boolean | 否 | 是否添加水印 |

**响应格式**:
```json
{
  "code": 200,
  "message": "批量上传完成",
  "data": {
    "successCount": 8,
    "failCount": 2,
    "results": [
      {
        "index": 0,
        "success": true,
        "fileInfo": {
          "fileId": "file_20240119_001",
          "fileName": "example1.jpg",
          "url": "https://cdn.example.com/files/file_20240119_001.jpg"
        }
      },
      {
        "index": 1,
        "success": false,
        "error": "文件格式不支持"
      }
    ]
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| successCount | number | 成功上传数量 |
| failCount | number | 失败上传数量 |
| results | array | 每个文件的上传结果 |
| index | number | 文件在请求中的索引 |

---

#### 1.3 分片上传初始化

**接口地址**: `POST /api/upload/multipart/init`

**功能描述**: 初始化大文件分片上传

**请求参数**:
```json
{
  "fileName": "large_video.mp4",
  "fileSize": 104857600,
  "mimeType": "video/mp4",
  "type": "video",
  "category": "feedback",
  "chunkSize": 1048576
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| fileName | string | 是 | 文件名 |
| fileSize | number | 是 | 文件总大小 |
| mimeType | string | 是 | 文件MIME类型 |
| type | string | 是 | 文件类型 |
| category | string | 否 | 文件分类 |
| chunkSize | number | 否 | 分片大小，默认1MB |

**响应格式**:
```json
{
  "code": 200,
  "message": "初始化成功",
  "data": {
    "uploadId": "upload_20240119_001",
    "chunkSize": 1048576,
    "totalChunks": 100,
    "expiresAt": "2024-01-19T12:30:00Z"
  }
}
```

---

#### 1.4 分片上传

**接口地址**: `POST /api/upload/multipart/chunk`

**功能描述**: 上传文件分片

**请求方式**: `multipart/form-data`

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| uploadId | string | 是 | 上传ID |
| chunkIndex | number | 是 | 分片索引（从0开始） |
| chunk | File | 是 | 分片数据 |
| md5 | string | 是 | 分片MD5校验值 |

**响应格式**:
```json
{
  "code": 200,
  "message": "分片上传成功",
  "data": {
    "uploadId": "upload_20240119_001",
    "chunkIndex": 0,
    "uploaded": true,
    "progress": 0.01
  }
}
```

---

#### 1.5 完成分片上传

**接口地址**: `POST /api/upload/multipart/complete`

**功能描述**: 完成分片上传，合并文件

**请求参数**:
```json
{
  "uploadId": "upload_20240119_001",
  "chunks": [
    {
      "index": 0,
      "etag": "etag_chunk_0"
    },
    {
      "index": 1,
      "etag": "etag_chunk_1"
    }
  ]
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| uploadId | string | 是 | 上传ID |
| chunks | array | 是 | 分片信息列表 |
| etag | string | 是 | 分片标识 |

**响应格式**:
```json
{
  "code": 200,
  "message": "文件合并成功",
  "data": {
    "fileId": "file_20240119_002",
    "fileName": "large_video.mp4",
    "fileSize": 104857600,
    "url": "https://cdn.example.com/files/file_20240119_002.mp4",
    "uploadTime": "2024-01-19T10:45:00Z"
  }
}
```

---

### 2. 文件管理

#### 2.1 获取文件信息

**接口地址**: `GET /api/upload/files/{fileId}`

**功能描述**: 获取指定文件的详细信息

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| fileId | string | 是 | 文件ID |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "fileId": "file_20240119_001",
    "fileName": "example.jpg",
    "originalName": "用户头像.jpg",
    "fileSize": 1024000,
    "mimeType": "image/jpeg",
    "type": "image",
    "category": "avatar",
    "url": "https://cdn.example.com/files/file_20240119_001.jpg",
    "thumbnailUrl": "https://cdn.example.com/thumbnails/file_20240119_001_thumb.jpg",
    "status": "active",
    "uploadTime": "2024-01-19T10:30:00Z",
    "expiresAt": "2024-07-19T10:30:00Z",
    "downloadCount": 15,
    "metadata": {
      "width": 1920,
      "height": 1080,
      "format": "JPEG"
    }
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| status | string | 文件状态：active、deleted、expired |
| downloadCount | number | 下载次数 |

---

#### 2.2 获取文件列表

**接口地址**: `GET /api/upload/files`

**功能描述**: 获取用户上传的文件列表

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 否 | 文件类型筛选 |
| category | string | 否 | 文件分类筛选 |
| status | string | 否 | 文件状态筛选 |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |
| sortBy | string | 否 | 排序字段：uploadTime、fileSize、fileName |
| sortOrder | string | 否 | 排序方向：asc、desc，默认desc |

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "fileId": "file_20240119_001",
        "fileName": "example.jpg",
        "originalName": "用户头像.jpg",
        "fileSize": 1024000,
        "mimeType": "image/jpeg",
        "type": "image",
        "category": "avatar",
        "url": "https://cdn.example.com/files/file_20240119_001.jpg",
        "thumbnailUrl": "https://cdn.example.com/thumbnails/file_20240119_001_thumb.jpg",
        "status": "active",
        "uploadTime": "2024-01-19T10:30:00Z"
      }
    ],
    "total": 50,
    "totalSize": 52428800
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| totalSize | number | 文件总大小（字节） |

---

#### 2.3 删除文件

**接口地址**: `DELETE /api/upload/files/{fileId}`

**功能描述**: 删除指定文件

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| fileId | string | 是 | 文件ID |

**响应格式**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": {
    "fileId": "file_20240119_001",
    "deleted": true,
    "deleteTime": "2024-01-19T11:00:00Z"
  }
}
```

---

#### 2.4 批量删除文件

**接口地址**: `DELETE /api/upload/files/batch`

**功能描述**: 批量删除文件

**请求参数**:
```json
{
  "fileIds": ["file_20240119_001", "file_20240119_002", "file_20240119_003"]
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| fileIds | array | 是 | 文件ID列表，最多50个 |

**响应格式**:
```json
{
  "code": 200,
  "message": "批量删除完成",
  "data": {
    "successCount": 2,
    "failCount": 1,
    "results": [
      {
        "fileId": "file_20240119_001",
        "success": true
      },
      {
        "fileId": "file_20240119_002",
        "success": true
      },
      {
        "fileId": "file_20240119_003",
        "success": false,
        "error": "文件不存在"
      }
    ]
  }
}
```

---

### 3. 图片处理

#### 3.1 图片压缩

**接口地址**: `POST /api/upload/image/compress`

**功能描述**: 压缩已上传的图片

**请求参数**:
```json
{
  "fileId": "file_20240119_001",
  "quality": 80,
  "maxWidth": 1920,
  "maxHeight": 1080,
  "format": "jpeg"
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| fileId | string | 是 | 原图片文件ID |
| quality | number | 否 | 压缩质量1-100，默认80 |
| maxWidth | number | 否 | 最大宽度 |
| maxHeight | number | 否 | 最大高度 |
| format | string | 否 | 输出格式：jpeg、png、webp |

**响应格式**:
```json
{
  "code": 200,
  "message": "压缩成功",
  "data": {
    "fileId": "file_20240119_001_compressed",
    "originalSize": 2048000,
    "compressedSize": 512000,
    "compressionRatio": 0.75,
    "url": "https://cdn.example.com/files/file_20240119_001_compressed.jpg"
  }
}
```

---

#### 3.2 生成缩略图

**接口地址**: `POST /api/upload/image/thumbnail`

**功能描述**: 为图片生成缩略图

**请求参数**:
```json
{
  "fileId": "file_20240119_001",
  "width": 200,
  "height": 200,
  "mode": "crop"
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| fileId | string | 是 | 原图片文件ID |
| width | number | 是 | 缩略图宽度 |
| height | number | 是 | 缩略图高度 |
| mode | string | 否 | 缩放模式：crop、fit、fill，默认crop |

**响应格式**:
```json
{
  "code": 200,
  "message": "生成成功",
  "data": {
    "fileId": "file_20240119_001_thumb",
    "width": 200,
    "height": 200,
    "url": "https://cdn.example.com/thumbnails/file_20240119_001_thumb.jpg"
  }
}
```

---

#### 3.3 添加水印

**接口地址**: `POST /api/upload/image/watermark`

**功能描述**: 为图片添加水印

**请求参数**:
```json
{
  "fileId": "file_20240119_001",
  "watermarkType": "text",
  "text": "救援平台",
  "position": "bottom-right",
  "opacity": 0.5,
  "fontSize": 24,
  "color": "#FFFFFF"
}
```

**参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| fileId | string | 是 | 原图片文件ID |
| watermarkType | string | 是 | 水印类型：text、image |
| text | string | 否 | 水印文字（text类型） |
| watermarkFileId | string | 否 | 水印图片ID（image类型） |
| position | string | 否 | 位置：top-left、top-right、bottom-left、bottom-right、center |
| opacity | number | 否 | 透明度0-1，默认0.5 |
| fontSize | number | 否 | 字体大小（text类型） |
| color | string | 否 | 字体颜色（text类型） |

---

### 4. 文件安全

#### 4.1 病毒扫描

**接口地址**: `POST /api/upload/security/scan`

**功能描述**: 对上传文件进行病毒扫描

**请求参数**:
```json
{
  "fileId": "file_20240119_001"
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "扫描完成",
  "data": {
    "fileId": "file_20240119_001",
    "scanResult": "clean",
    "scanTime": "2024-01-19T10:35:00Z",
    "engine": "ClamAV",
    "version": "0.103.7"
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| scanResult | string | 扫描结果：clean、infected、error |
| engine | string | 扫描引擎 |
| version | string | 引擎版本 |

---

#### 4.2 文件类型检查

**接口地址**: `POST /api/upload/security/check-type`

**功能描述**: 检查文件真实类型

**请求参数**:
```json
{
  "fileId": "file_20240119_001"
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "检查完成",
  "data": {
    "fileId": "file_20240119_001",
    "declaredType": "image/jpeg",
    "actualType": "image/jpeg",
    "typeMatch": true,
    "safe": true
  }
}
```

---

### 5. 存储统计

#### 5.1 获取存储统计

**接口地址**: `GET /api/upload/statistics`

**功能描述**: 获取用户的存储使用统计

**响应格式**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "totalFiles": 150,
    "totalSize": 524288000,
    "usedQuota": 0.5,
    "quotaLimit": 1073741824,
    "typeDistribution": {
      "image": {
        "count": 100,
        "size": 314572800
      },
      "document": {
        "count": 30,
        "size": 157286400
      },
      "video": {
        "count": 15,
        "size": 52428800
      },
      "audio": {
        "count": 5,
        "size": 0
      }
    },
    "monthlyUpload": [
      {
        "month": "2024-01",
        "count": 25,
        "size": 104857600
      }
    ]
  }
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| usedQuota | number | 已使用配额比例 |
| quotaLimit | number | 配额限制（字节） |
| typeDistribution | object | 文件类型分布 |
| monthlyUpload | array | 月度上传统计 |

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 9001 | 文件格式不支持 |
| 9002 | 文件大小超限 |
| 9003 | 存储配额不足 |
| 9004 | 文件上传失败 |
| 9005 | 文件不存在 |
| 9006 | 文件已删除 |
| 9007 | 病毒扫描失败 |
| 9008 | 文件类型不匹配 |
| 9009 | 分片上传失败 |
| 9010 | 图片处理失败 |
| 9011 | 批量操作超限 |
| 9012 | 文件访问权限不足 |

---

## 数据模型定义

### FileInfo 文件信息模型

```typescript
interface FileInfo {
  fileId: string;                // 文件ID
  fileName: string;              // 存储文件名
  originalName: string;          // 原始文件名
  fileSize: number;              // 文件大小
  mimeType: string;              // MIME类型
  type: FileType;                // 文件类型
  category?: string;             // 文件分类
  url: string;                   // 访问URL
  thumbnailUrl?: string;         // 缩略图URL
  status: FileStatus;            // 文件状态
  uploadTime: string;            // 上传时间
  expiresAt?: string;            // 过期时间
  downloadCount: number;         // 下载次数
  metadata?: FileMetadata;       // 文件元数据
}

enum FileType {
  IMAGE = 'image',               // 图片
  DOCUMENT = 'document',         // 文档
  VIDEO = 'video',               // 视频
  AUDIO = 'audio'                // 音频
}

enum FileStatus {
  ACTIVE = 'active',             // 正常
  DELETED = 'deleted',           // 已删除
  EXPIRED = 'expired'            // 已过期
}

interface FileMetadata {
  width?: number;                // 宽度（图片/视频）
  height?: number;               // 高度（图片/视频）
  duration?: number;             // 时长（音视频）
  format?: string;               // 格式
  compressed?: boolean;          // 是否压缩
  watermarked?: boolean;         // 是否有水印
}
```

### UploadSession 上传会话模型

```typescript
interface UploadSession {
  uploadId: string;              // 上传ID
  fileName: string;              // 文件名
  fileSize: number;              // 文件大小
  chunkSize: number;             // 分片大小
  totalChunks: number;           // 总分片数
  uploadedChunks: number[];      // 已上传分片
  status: UploadStatus;          // 上传状态
  createTime: string;            // 创建时间
  expiresAt: string;             // 过期时间
}

enum UploadStatus {
  INITIALIZED = 'initialized',   // 已初始化
  UPLOADING = 'uploading',       // 上传中
  COMPLETED = 'completed',       // 已完成
  FAILED = 'failed',             // 失败
  EXPIRED = 'expired'            // 已过期
}
```

---

## 业务规则

1. **文件大小限制**: 
   - 图片：最大10MB
   - 文档：最大50MB
   - 视频：最大500MB
   - 音频：最大100MB

2. **格式支持**:
   - 图片：JPEG、PNG、GIF、WebP
   - 文档：PDF、DOC、DOCX、XLS、XLSX
   - 视频：MP4、AVI、MOV
   - 音频：MP3、WAV、AAC

3. **存储配额**: 普通用户1GB，企业用户10GB

4. **文件保留**: 文件默认保留6个月，可设置自动过期

5. **安全检查**: 所有文件必须通过病毒扫描和类型检查

---

## 安全考虑

1. **文件类型验证**: 检查文件头部信息，防止伪造文件类型
2. **病毒扫描**: 集成杀毒引擎，扫描上传文件
3. **访问控制**: 文件访问需要权限验证
4. **内容过滤**: 图片内容识别，过滤违规内容
5. **传输安全**: 文件传输使用HTTPS加密
6. **存储安全**: 文件存储加密，定期备份

---

## 性能要求

1. **上传速度**: 单文件上传响应时间<5秒
2. **并发处理**: 支持1000个并发上传
3. **CDN加速**: 文件访问通过CDN分发
4. **缓存策略**: 缩略图和处理后文件缓存24小时
5. **清理机制**: 定期清理过期和删除的文件

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0 | 2024-01-19 | 初始版本，包含基础文件上传功能 |