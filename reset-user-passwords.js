/**
 * 重置用户密码为已知密码
 */

const { DataSource } = require('typeorm');
const bcrypt = require('bcrypt');

async function resetUserPasswords() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'rescue_system',
    synchronize: false,
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('数据库连接成功');

    // 设置新密码
    const newPassword = '123456';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新13800138001的密码
    await dataSource.query(
      'UPDATE users SET password = ? WHERE phone = ?',
      [hashedPassword, '13800138001']
    );
    console.log('已更新13800138001的密码为:', newPassword);

    // 更新13800138002的密码
    await dataSource.query(
      'UPDATE users SET password = ? WHERE phone = ?',
      [hashedPassword, '13800138002']
    );
    console.log('已更新13800138002的密码为:', newPassword);

    // 验证更新结果
    const users = await dataSource.query(
      'SELECT id, phone, username, nickname FROM users WHERE phone IN (?, ?)',
      ['13800138001', '13800138002']
    );
    console.log('用户信息:', users);

    console.log('密码重置完成！');
  } catch (error) {
    console.error('重置密码过程中出错:', error);
  } finally {
    await dataSource.destroy();
  }
}

resetUserPasswords();