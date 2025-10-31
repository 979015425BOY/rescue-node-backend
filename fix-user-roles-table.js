/**
 * 修复user_roles表结构问题
 * 删除有问题的数据并重新创建表结构
 */

const { DataSource } = require('typeorm');
const crypto = require('crypto');

function uuidv4() {
  return crypto.randomUUID();
}

async function fixUserRolesTable() {
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

    // 1. 删除user_roles表中的所有数据
    console.log('清理user_roles表数据...');
    await dataSource.query('DELETE FROM user_roles');
    
    // 2. 删除user_roles表
    console.log('删除user_roles表...');
    await dataSource.query('DROP TABLE IF EXISTS user_roles');
    
    // 3. 重新创建user_roles表
    console.log('重新创建user_roles表...');
    await dataSource.query(`
      CREATE TABLE user_roles (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        roleId VARCHAR(36) NOT NULL,
        assignedBy VARCHAR(36),
        assignedAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
        INDEX IDX_user_roles_userId (userId),
        INDEX IDX_user_roles_roleId (roleId),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE
      )
    `);

    // 4. 检查并创建默认角色
    console.log('检查角色数据...');
    const roles = await dataSource.query('SELECT * FROM roles');
    console.log('现有角色:', roles);

    if (roles.length === 0) {
      console.log('创建默认角色...');
      const roleData = [
        {
          id: uuidv4(),
          code: 'USER',
          name: '普通用户',
          description: '普通用户角色',
          permissions: JSON.stringify(['user:read', 'user:update'])
        },
        {
          id: uuidv4(),
          code: 'MASTER',
          name: '救援师傅',
          description: '救援师傅角色',
          permissions: JSON.stringify(['user:read', 'user:update', 'rescue:create', 'rescue:update', 'rescue:read'])
        },
        {
          id: uuidv4(),
          code: 'ADMIN',
          name: '管理员',
          description: '系统管理员',
          permissions: JSON.stringify(['*'])
        }
      ];

      for (const role of roleData) {
        await dataSource.query(
          'INSERT INTO roles (id, code, name, description, permissions) VALUES (?, ?, ?, ?, ?)',
          [role.id, role.code, role.name, role.description, role.permissions]
        );
      }
    }

    // 5. 检查用户并分配角色
    console.log('检查用户数据...');
    const users = await dataSource.query('SELECT * FROM users');
    console.log('现有用户:', users);

    const updatedRoles = await dataSource.query('SELECT * FROM roles');
    const userRole = updatedRoles.find(r => r.code === 'USER');
    const masterRole = updatedRoles.find(r => r.code === 'MASTER');

    if (userRole && masterRole) {
      // 为13800138001分配USER角色
      const normalUser = users.find(u => u.phone === '13800138001');
      if (normalUser) {
        await dataSource.query(
          'INSERT INTO user_roles (id, userId, roleId, assignedAt) VALUES (?, ?, ?, NOW())',
          [uuidv4(), normalUser.id, userRole.id]
        );
        console.log('已为13800138001分配USER角色');
      }

      // 为13800138002分配MASTER角色
      const masterUser = users.find(u => u.phone === '13800138002');
      if (masterUser) {
        await dataSource.query(
          'INSERT INTO user_roles (id, userId, roleId, assignedAt) VALUES (?, ?, ?, NOW())',
          [uuidv4(), masterUser.id, masterRole.id]
        );
        console.log('已为13800138002分配MASTER角色');
      }
    }

    // 6. 验证结果
    console.log('验证角色分配结果...');
    const userRoles = await dataSource.query(`
      SELECT ur.*, u.phone, u.username, r.code as roleCode, r.name as roleName
      FROM user_roles ur
      JOIN users u ON ur.userId = u.id
      JOIN roles r ON ur.roleId = r.id
    `);
    console.log('用户角色分配结果:', userRoles);

    console.log('修复完成！');
  } catch (error) {
    console.error('修复过程中出错:', error);
  } finally {
    await dataSource.destroy();
  }
}

fixUserRolesTable();