/**
 * 测试用户角色查询脚本
 * 功能：直接查询数据库中的用户角色关联数据
 * 使用场景：调试角色绑定问题
 */

const { createConnection } = require('typeorm');

async function testUserRoles() {
  console.log('开始测试用户角色查询...');
  
  try {
    // 创建数据库连接
    const connection = await createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'rescue_system',
      synchronize: false,
      logging: true,
    });

    console.log('数据库连接成功');

    // 1. 查询所有用户
    console.log('\n=== 查询所有用户 ===');
    const users = await connection.query('SELECT id, phone, username, nickname FROM users');
    console.log('用户列表:', users);

    // 2. 查询所有角色
    console.log('\n=== 查询所有角色 ===');
    const roles = await connection.query('SELECT id, name, code, description FROM roles');
    console.log('角色列表:', roles);

    // 3. 查询user_roles表结构
    console.log('\n=== 查询user_roles表结构 ===');
    const tableStructure = await connection.query('DESCRIBE user_roles');
    console.log('user_roles表结构:', tableStructure);

    // 4. 查询所有用户角色关联
    console.log('\n=== 查询所有用户角色关联 ===');
    const userRoles = await connection.query('SELECT * FROM user_roles');
    console.log('用户角色关联:', userRoles);

    // 4. 查询特定用户的角色
    console.log('\n=== 查询13800138001的角色 ===');
    const user1Roles = await connection.query(`
      SELECT 
        ur.id,
        ur.user_id,
        ur.role_id,
        u.phone,
        u.username,
        r.name as role_name,
        r.code as role_code,
        r.permissions
      FROM user_roles ur
      LEFT JOIN users u ON ur.user_id = u.id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.phone = '13800138001'
    `);
    console.log('13800138001的角色:', user1Roles);

    console.log('\n=== 查询13800138002的角色 ===');
    const user2Roles = await connection.query(`
      SELECT 
        ur.id,
        ur.user_id,
        ur.role_id,
        u.phone,
        u.username,
        r.name as role_name,
        r.code as role_code,
        r.permissions
      FROM user_roles ur
      LEFT JOIN users u ON ur.user_id = u.id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.phone = '13800138002'
    `);
    console.log('13800138002的角色:', user2Roles);

    await connection.close();
    console.log('\n测试完成');

  } catch (error) {
    console.error('测试失败:', error);
  }
}

testUserRoles();