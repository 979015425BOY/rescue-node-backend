/**
 * 数据库初始化脚本 - 创建默认用户数据
 * 功能：在users表中插入普通用户和师傅端默认数据
 * 使用场景：项目初始化时运行，创建系统默认用户
 */

const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const bcrypt = require('bcrypt');

async function initDefaultUsers() {
  console.log('开始初始化默认用户数据...');
  
  try {
    // 创建应用实例
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // 获取用户仓库
    const userRepository = app.get('UserRepository');
    
    // 定义默认用户数据
    const defaultUsers = [
      {
        phone: '13800138001',
        username: 'normaluser',
        password: 'user123456',
        nickname: '普通用户',
        level: '普通用户',
        email: 'normaluser@example.com',
        realName: null,
        idCard: null,
        emergencyContact: null,
        emergencyPhone: null,
        address: null,
        points: 0,
        isActive: true
      },
      {
        phone: '13800138002',
        username: 'masteruser',
        password: 'master123456',
        nickname: '救援师傅',
        level: '专业师傅',
        email: 'masteruser@example.com',
        realName: '张师傅',
        idCard: null,
        emergencyContact: null,
        emergencyPhone: null,
        address: '北京市朝阳区救援服务中心',
        points: 1000,
        isActive: true
      }
    ];

    // 处理每个默认用户
    for (const userData of defaultUsers) {
      console.log(`正在处理用户: ${userData.username} (${userData.phone})`);
      
      // 检查用户是否已存在
      const existingUser = await userRepository.findOne({ 
        where: [
          { phone: userData.phone },
          { username: userData.username }
        ]
      });
      
      if (existingUser) {
        console.log(`用户 ${userData.username} 已存在，跳过创建`);
        continue;
      }
      
      // 加密密码
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // 创建用户数据
      const newUser = userRepository.create({
        ...userData,
        password: hashedPassword
      });
      
      // 保存用户
      const savedUser = await userRepository.save(newUser);
      console.log(`✅ 成功创建用户: ${savedUser.username} (ID: ${savedUser.id})`);
      console.log(`   - 手机号: ${savedUser.phone}`);
      console.log(`   - 昵称: ${savedUser.nickname}`);
      console.log(`   - 等级: ${savedUser.level}`);
      console.log(`   - 真实姓名: ${savedUser.realName || '未设置'}`);
      console.log(`   - 积分: ${savedUser.points}`);
      console.log('');
    }
    
    // 验证数据插入结果
    const totalUsers = await userRepository.count();
    console.log(`📊 数据库中总用户数: ${totalUsers}`);
    
    // 显示所有用户信息
    const allUsers = await userRepository.find({
      select: ['id', 'phone', 'username', 'nickname', 'level', 'realName', 'points', 'isActive', 'createdAt']
    });
    
    console.log('\n📋 当前数据库中的所有用户:');
    console.log('----------------------------------------');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.nickname})`);
      console.log(`   手机号: ${user.phone}`);
      console.log(`   等级: ${user.level}`);
      console.log(`   真实姓名: ${user.realName || '未设置'}`);
      console.log(`   积分: ${user.points}`);
      console.log(`   状态: ${user.isActive ? '激活' : '未激活'}`);
      console.log(`   创建时间: ${user.createdAt}`);
      console.log('');
    });
    
    await app.close();
    console.log('✅ 默认用户数据初始化完成！');
    
  } catch (error) {
    console.error('❌ 初始化失败:', error.message);
    console.error('错误详情:', error);
    process.exit(1);
  }
}

// 运行初始化
initDefaultUsers();