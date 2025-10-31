import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * 认证模块端到端测试
 * 测试用户注册、登录、密码重置等功能
 */
describe('Auth (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  const testPhone = '13800138000';
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
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/auth/send-sms (POST)', () => {
    it('应该成功发送短信验证码', () => {
      return request(app.getHttpServer())
        .post('/api/auth/send-sms')
        .send({
          phone: testPhone,
          type: 'register',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('操作成功');
        });
    });

    it('应该拒绝无效的手机号', () => {
      return request(app.getHttpServer())
        .post('/api/auth/send-sms')
        .send({
          phone: '123',
          type: 'register',
        })
        .expect(400);
    });

    it('应该拒绝无效的验证码类型', () => {
      return request(app.getHttpServer())
        .post('/api/auth/send-sms')
        .send({
          phone: testPhone,
          type: 'invalid',
        })
        .expect(400);
    });
  });

  describe('/auth/register (POST)', () => {
    beforeEach(async () => {
      // 先发送验证码
      await request(app.getHttpServer())
        .post('/api/auth/send-sms')
        .send({
          phone: testPhone,
          type: 'register',
        });
    });

    it('应该成功注册用户', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          phone: testPhone,
          username: 'testuser',
          password: testPassword,
          smsCode: '123456',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('refreshToken');
          expect(res.body.data).toHaveProperty('user');
          expect(res.body.data.user.phone).toBe(testPhone);
          
          // 保存token用于后续测试
          accessToken = res.body.data.accessToken;
          refreshToken = res.body.data.refreshToken;
        });
    });

    it('应该拒绝重复注册', async () => {
      // 先注册一次
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          phone: testPhone,
          username: 'testuser',
          password: testPassword,
          smsCode: '123456',
        });

      // 再次注册应该失败
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          phone: testPhone,
          username: 'testuser2',
          password: testPassword,
          smsCode: '123456',
        })
        .expect(409);
    });

    it('应该拒绝无效的验证码', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          phone: testPhone,
          username: 'testuser',
          password: testPassword,
          smsCode: '000000',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      // 先注册用户
      await request(app.getHttpServer())
        .post('/api/auth/send-sms')
        .send({
          phone: testPhone,
          type: 'register',
        });

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          phone: testPhone,
          username: 'testuser',
          password: testPassword,
          smsCode: '123456',
        });
    });

    it('应该成功登录', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          phone: testPhone,
          password: testPassword,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('refreshToken');
          expect(res.body.data).toHaveProperty('user');
          
          accessToken = res.body.data.accessToken;
          refreshToken = res.body.data.refreshToken;
        });
    });

    it('应该拒绝错误的密码', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          phone: testPhone,
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('应该拒绝不存在的用户', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          phone: '13900139000',
          password: testPassword,
        })
        .expect(401);
    });
  });

  describe('/auth/refresh (POST)', () => {
    beforeEach(async () => {
      // 先注册并登录获取token
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

      refreshToken = registerRes.body.data.refreshToken;
    });

    it('应该成功刷新token', () => {
      return request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({
          refreshToken,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toHaveProperty('accessToken');
          expect(res.body.data).toHaveProperty('refreshToken');
        });
    });

    it('应该拒绝无效的refresh token', () => {
      return request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid-token',
        })
        .expect(401);
    });
  });

  describe('/auth/reset-password (POST)', () => {
    beforeEach(async () => {
      // 先注册用户
      await request(app.getHttpServer())
        .post('/api/auth/send-sms')
        .send({
          phone: testPhone,
          type: 'register',
        });

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          phone: testPhone,
          username: 'testuser',
          password: testPassword,
          smsCode: '123456',
        });

      // 发送重置密码验证码
      await request(app.getHttpServer())
        .post('/api/auth/send-sms')
        .send({
          phone: testPhone,
          type: 'reset',
        });
    });

    it('应该成功重置密码', () => {
      const newPassword = 'NewPassword123';
      
      return request(app.getHttpServer())
        .post('/api/auth/reset-password')
        .send({
          phone: testPhone,
          newPassword,
          smsCode: '123456',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });

    it('应该拒绝无效的验证码', () => {
      return request(app.getHttpServer())
        .post('/api/auth/reset-password')
        .send({
          phone: testPhone,
          newPassword: 'NewPassword123',
          smsCode: '000000',
        })
        .expect(400);
    });
  });

  describe('/auth/logout (POST)', () => {
    beforeEach(async () => {
      // 先注册并登录获取token
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
      refreshToken = registerRes.body.data.refreshToken;
    });

    it('应该成功登出', () => {
      return request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          refreshToken,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });

    it('应该拒绝未认证的请求', () => {
      return request(app.getHttpServer())
        .post('/api/auth/logout')
        .send({
          refreshToken,
        })
        .expect(401);
    });
  });
});