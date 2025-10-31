import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * 用户模块端到端测试
 * 测试用户信息管理、密码修改等功能
 */
describe('Users (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: string;
  const testPhone = '13800138001';
  const testPassword = 'Test123456';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // 配置全局管道和过滤器
    const { ValidationPipe } = await import('@nestjs/common');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    
    await app.init();

    // 注册并登录获取token
    await request(app.getHttpServer())
      .post('/api/auth/send-sms')
      .send({
        phone: testPhone,
        type: 'register',
      });

    const registerRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        phone: testPhone,
        username: 'testuser',
        password: testPassword,
        smsCode: '123456',
      });

    accessToken = registerRes.body.data.accessToken;
    userId = registerRes.body.data.user.id;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/users/profile (GET)', () => {
    it('应该成功获取当前用户信息', () => {
      return request(app.getHttpServer())
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data).toHaveProperty('phone');
          expect(res.body.data).toHaveProperty('username');
          expect(res.body.data.phone).toBe(testPhone);
        });
    });

    it('应该拒绝未认证的请求', () => {
      return request(app.getHttpServer())
        .get('/api/users/profile')
        .expect(401);
    });
  });

  describe('/users/profile (PATCH)', () => {
    it('应该成功更新用户信息', () => {
      const updateData = {
        realName: '张三',
        address: '北京市朝阳区',
      };

      return request(app.getHttpServer())
        .patch('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.realName).toBe(updateData.realName);
          expect(res.body.data.address).toBe(updateData.address);
        });
    });

    it('应该拒绝无效的手机号格式', () => {
      return request(app.getHttpServer())
        .patch('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          phone: '123',
        })
        .expect(400);
    });

    it('应该拒绝未认证的请求', () => {
      return request(app.getHttpServer())
        .patch('/api/users/profile')
        .send({
          realName: '张三',
        })
        .expect(401);
    });
  });

  describe('/users/change-password (POST)', () => {
    it('应该成功修改密码', () => {
      const newPassword = 'NewPassword123';

      return request(app.getHttpServer())
        .post('/api/users/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          oldPassword: testPassword,
          newPassword,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });

    it('应该拒绝错误的当前密码', () => {
      return request(app.getHttpServer())
        .post('/api/users/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          oldPassword: 'wrongpassword',
          newPassword: 'NewPassword123',
        })
        .expect(400);
    });

    it('应该拒绝与当前密码相同的新密码', () => {
      return request(app.getHttpServer())
        .post('/api/users/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          oldPassword: testPassword,
          newPassword: testPassword,
        })
        .expect(400);
    });

    it('应该拒绝未认证的请求', () => {
      return request(app.getHttpServer())
        .post('/api/users/change-password')
        .send({
          oldPassword: testPassword,
          newPassword: 'NewPassword123',
        })
        .expect(401);
    });
  });

  describe('/users (GET)', () => {
    it('应该成功获取用户列表（需要认证）', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('应该拒绝未认证的请求', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .expect(401);
    });
  });

  describe('/users/:id (GET)', () => {
    it('应该成功获取指定用户信息', () => {
      return request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.id).toBe(userId);
        });
    });

    it('应该返回404当用户不存在', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      return request(app.getHttpServer())
        .get(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('应该拒绝未认证的请求', () => {
      return request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .expect(401);
    });
  });

  describe('/users/:id (PATCH)', () => {
    it('应该成功更新指定用户信息', () => {
      const updateData = {
        realName: '李四',
        points: 100,
      };

      return request(app.getHttpServer())
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.realName).toBe(updateData.realName);
          expect(res.body.data.points).toBe(updateData.points);
        });
    });

    it('应该返回404当用户不存在', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      return request(app.getHttpServer())
        .patch(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          realName: '不存在的用户',
        })
        .expect(404);
    });

    it('应该拒绝未认证的请求', () => {
      return request(app.getHttpServer())
        .patch(`/api/users/${userId}`)
        .send({
          realName: '李四',
        })
        .expect(401);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('应该成功删除指定用户', () => {
      return request(app.getHttpServer())
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });

    it('应该返回404当用户不存在', () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      return request(app.getHttpServer())
        .delete(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('应该拒绝未认证的请求', () => {
      return request(app.getHttpServer())
        .delete(`/api/users/${userId}`)
        .expect(401);
    });
  });

  describe('/users (POST)', () => {
    it('应该成功创建用户（公开接口）', () => {
      const userData = {
        username: 'newuser',
        phone: '13900139000',
        password: 'Password123',
        email: 'newuser@example.com',
        realName: '新用户',
      };

      return request(app.getHttpServer())
        .post('/api/users')
        .send(userData)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.username).toBe(userData.username);
          expect(res.body.data.phone).toBe(userData.phone);
        });
    });

    it('应该拒绝重复的手机号', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'duplicateuser',
          phone: testPhone, // 使用已存在的手机号
          password: 'Password123',
        })
        .expect(409);
    });

    it('应该拒绝无效的数据格式', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'a', // 用户名太短
          phone: '123', // 无效手机号
          password: '123', // 密码太短
        })
        .expect(400);
    });
  });
});