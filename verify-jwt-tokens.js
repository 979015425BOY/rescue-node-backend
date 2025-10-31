/**
 * JWT Token验证脚本
 * 用于解析和验证登录返回的JWT token中的角色和权限信息
 */

// 简单的JWT解码函数（不验证签名）
function base64UrlDecode(str) {
  // 添加padding
  str += new Array(5 - str.length % 4).join('=');
  // 替换URL安全字符
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Base64解码
  return Buffer.from(str, 'base64').toString();
}

// 从环境变量获取JWT密钥（需要与应用程序一致）
const JWT_SECRET = 'your-secret-key'; // 这里需要与实际应用的密钥一致

// 测试用的JWT tokens（从登录响应中获取）
const testTokens = {
  normalUser: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTQwMzA1YS1jOTIyLTQzOWQtODg4ZC0xYTg2ZWE4OTU4NTEiLCJwaG9uZSI6IjEzODAwMTM4MDAxIiwidXNlcm5hbWUiOiJub3JtYWx1c2VyIiwibmlja25hbWUiOiLmma7pgJrnlKjmiLciLCJyb2xlcyI6WyJVU0VSIl0sInBlcm1pc3Npb25zIjpbInJlc2N1ZTpjcmVhdGUiLCJyZXNjdWU6dmlldyIsInJlc2N1ZTp1cGRhdGVfb3duIiwicHJvZmlsZTp2aWV3IiwicHJvZmlsZTp1cGRhdGUiXSwiaWF0IjoxNzYxODc5MjQ1LCJleHAiOjE3NjE4ODY0NDV9.PCcaCvYIKacmsgZfdLch1JgTQ44UX4dieKenIgHidUI',
  masterUser: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlZDVjNTM1My00ODQ0LTQ4YzMtODYxYi03NjZlMDNiODJmN2QiLCJwaG9uZSI6IjEzODAwMTM4MDAyIiwidXNlcm5hbWUiOiJtYXN0ZXJ1c2VyIiwibmlja25hbWUiOiLmlZHmj7TluIjlgoUiLCJyb2xlcyI6WyJNQVNURVIiXSwicGVybWlzc2lvbnMiOlsicmVzY3VlOnZpZXciLCJyZXNjdWU6YWNjZXB0IiwicmVzY3VlOnByb2Nlc3MiLCJyZXNjdWU6Y29tcGxldGUiLCJyZXNjdWU6Y2FuY2VsIiwicHJvZmlsZTp2aWV3IiwicHJvZmlsZTp1cGRhdGUiLCJtYXN0ZXI6ZGFzaGJvYXJkIl0sImlhdCI6MTc2MTg3OTI1NSwiZXhwIjoxNzYxODg2NDU1fQ.0AmdvsgMF6eUGLxj0Lru-jQfKV-NPUBaKexKKkjj70k'
};

/**
 * 解析JWT token（不验证签名，仅解码payload）
 * @param {string} token - JWT token
 * @returns {object} 解码后的payload
 */
function decodeToken(token) {
  try {
    // JWT格式: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    // 解码payload部分
    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload);
  } catch (error) {
    console.error('Token解码失败:', error.message);
    return null;
  }
}

/**
 * 验证JWT token（需要正确的密钥）
 * 注意：这里只是解码，不进行签名验证
 * @param {string} token - JWT token
 * @param {string} secret - JWT密钥（此处未使用）
 * @returns {object} 验证后的payload
 */
function verifyToken(token, secret) {
  // 简化版本：只解码不验证签名
  return decodeToken(token);
}

/**
 * 格式化显示用户信息
 * @param {object} payload - JWT payload
 * @param {string} userType - 用户类型
 */
function displayUserInfo(payload, userType) {
  if (!payload) {
    console.log(`❌ ${userType} - Token解析失败`);
    return;
  }

  console.log(`\n✅ ${userType} Token信息:`);
  console.log(`   用户ID: ${payload.sub}`);
  console.log(`   手机号: ${payload.phone}`);
  console.log(`   用户名: ${payload.username}`);
  console.log(`   昵称: ${payload.nickname}`);
  console.log(`   角色: [${payload.roles ? payload.roles.join(', ') : '无'}]`);
  console.log(`   权限: [${payload.permissions ? payload.permissions.join(', ') : '无'}]`);
  console.log(`   签发时间: ${new Date(payload.iat * 1000).toLocaleString()}`);
  console.log(`   过期时间: ${new Date(payload.exp * 1000).toLocaleString()}`);
}

/**
 * 验证角色绑定是否正确
 * @param {object} normalPayload - 普通用户payload
 * @param {object} masterPayload - 救援师傅payload
 */
function validateRoleBindings(normalPayload, masterPayload) {
  console.log('\n🔍 角色绑定验证:');
  
  // 验证普通用户角色
  const normalUserHasCorrectRole = normalPayload && 
    normalPayload.roles && 
    normalPayload.roles.includes('USER');
  
  console.log(`   13800138001 (normaluser) -> USER角色: ${normalUserHasCorrectRole ? '✅ 正确' : '❌ 错误'}`);
  
  // 验证救援师傅角色
  const masterUserHasCorrectRole = masterPayload && 
    masterPayload.roles && 
    masterPayload.roles.includes('MASTER');
  
  console.log(`   13800138002 (masteruser) -> MASTER角色: ${masterUserHasCorrectRole ? '✅ 正确' : '❌ 错误'}`);
  
  // 验证权限
  console.log('\n🔑 权限验证:');
  if (normalPayload && normalPayload.permissions) {
    console.log(`   普通用户权限数量: ${normalPayload.permissions.length}`);
    console.log(`   包含rescue:create权限: ${normalPayload.permissions.includes('rescue:create') ? '✅' : '❌'}`);
  }
  
  if (masterPayload && masterPayload.permissions) {
    console.log(`   救援师傅权限数量: ${masterPayload.permissions.length}`);
    console.log(`   包含rescue:accept权限: ${masterPayload.permissions.includes('rescue:accept') ? '✅' : '❌'}`);
    console.log(`   包含master:dashboard权限: ${masterPayload.permissions.includes('master:dashboard') ? '✅' : '❌'}`);
  }
}

// 主执行函数
function main() {
  console.log('🚀 开始验证JWT Token中的角色和权限信息...\n');
  
  // 解码tokens
  const normalUserPayload = decodeToken(testTokens.normalUser);
  const masterUserPayload = decodeToken(testTokens.masterUser);
  
  // 显示用户信息
  displayUserInfo(normalUserPayload, '普通用户 (13800138001)');
  displayUserInfo(masterUserPayload, '救援师傅 (13800138002)');
  
  // 验证角色绑定
  validateRoleBindings(normalUserPayload, masterUserPayload);
  
  console.log('\n✨ JWT Token验证完成！');
}

// 执行脚本
main();