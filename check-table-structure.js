/**
 * 检查数据库表结构脚本
 */

const mysql = require('mysql2/promise');

async function checkTableStructure() {
  console.log('开始检查数据库表结构...');
  
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '123456',
      database: 'rescue_system'
    });

    console.log('数据库连接成功');

    // 查询user_roles表结构
    console.log('\n=== user_roles表结构 ===');
    const [userRolesStructure] = await connection.execute('DESCRIBE user_roles');
    console.log(userRolesStructure);

    // 查询user_roles表数据
    console.log('\n=== user_roles表数据 ===');
    const [userRolesData] = await connection.execute('SELECT * FROM user_roles');
    console.log(userRolesData);

    // 查询users表数据
    console.log('\n=== users表数据 ===');
    const [usersData] = await connection.execute('SELECT id, phone, username, nickname FROM users');
    console.log(usersData);

    // 查询roles表数据
    console.log('\n=== roles表数据 ===');
    const [rolesData] = await connection.execute('SELECT * FROM roles');
    console.log(rolesData);

    await connection.end();
    console.log('\n检查完成');

  } catch (error) {
    console.error('检查失败:', error);
  }
}

checkTableStructure();