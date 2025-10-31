-- 修复用户角色表结构
-- 检查user_roles表是否存在id列，如果不存在则添加

-- 首先检查表结构
DESCRIBE user_roles;

-- 如果user_roles表没有id列，添加id列
ALTER TABLE user_roles ADD COLUMN id VARCHAR(36) PRIMARY KEY FIRST;

-- 为现有记录生成UUID（如果有的话）
UPDATE user_roles SET id = UUID() WHERE id IS NULL OR id = '';

-- 检查roles表是否存在
DESCRIBE roles;

-- 检查users表是否存在
DESCRIBE users;

-- 显示当前的角色数据
SELECT * FROM roles;

-- 显示当前的用户数据
SELECT id, phone, username, nickname FROM users;

-- 显示当前的用户角色关联数据
SELECT * FROM user_roles;