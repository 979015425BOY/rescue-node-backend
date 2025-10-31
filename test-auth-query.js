/**
 * 测试AuthService查询逻辑脚本
 */

const mysql = require('mysql2/promise');

async function testAuthQuery() {
  console.log('开始测试AuthService查询逻辑...');
  
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

    // 模拟AuthService中的查询
    const userId1 = '5e40305a-c922-439d-888d-1a86ea895851'; // 13800138001
    const userId2 = 'ed5c5353-4844-48c3-861b-766e03b82f7d'; // 13800138002

    console.log('\n=== 测试用户1 (13800138001) 的角色查询 ===');
    const [userRoles1] = await connection.execute(`
      SELECT 
        ur.id,
        ur.userId,
        ur.roleId,
        r.id as role_id,
        r.name as role_name,
        r.code as role_code,
        r.permissions
      FROM user_roles ur
      LEFT JOIN roles r ON ur.roleId = r.id
      WHERE ur.userId = ?
    `, [userId1]);
    console.log('用户1角色查询结果:', userRoles1);

    console.log('\n=== 测试用户2 (13800138002) 的角色查询 ===');
    const [userRoles2] = await connection.execute(`
      SELECT 
        ur.id,
        ur.userId,
        ur.roleId,
        r.id as role_id,
        r.name as role_name,
        r.code as role_code,
        r.permissions
      FROM user_roles ur
      LEFT JOIN roles r ON ur.roleId = r.id
      WHERE ur.userId = ?
    `, [userId2]);
    console.log('用户2角色查询结果:', userRoles2);

    await connection.end();
    console.log('\n测试完成');

  } catch (error) {
    console.error('测试失败:', error);
  }
}

testAuthQuery();