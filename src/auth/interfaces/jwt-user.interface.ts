/**
 * JWT用户接口
 * 定义JWT认证后的用户信息结构
 */
export interface JwtUser {
  /** 用户ID */
  id: string;
  
  /** 手机号 */
  phone: string;
  
  /** 用户名 */
  username: string;
  
  /** 邮箱 */
  email?: string;
  
  /** 昵称 */
  nickname?: string;
  
  /** 用户角色列表 */
  roles: string[];
  
  /** 用户权限列表 */
  permissions: string[];
}