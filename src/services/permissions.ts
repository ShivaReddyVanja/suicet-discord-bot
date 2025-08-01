import { GuildMember, PermissionResolvable } from 'discord.js';
import { PermissionLevel } from '../types';
import logger from '../utils/logger';

export class PermissionService {
  // Get role IDs dynamically from environment
  private static getRoleIds() {
    return {
    MODERATOR: process.env.MODERATOR_ROLE_ID,
    ADMIN: process.env.ADMIN_ROLE_ID,
  };
  }

  // Get user's permission level based on their roles
  static getUserPermissionLevel(member: GuildMember): PermissionLevel {
    try {
      const roleIds = this.getRoleIds();
      
      // Check if user has admin role
      if (roleIds.ADMIN && member.roles.cache.has(roleIds.ADMIN)) {
        return PermissionLevel.ADMIN;
      }

      // Check if user has moderator role
      if (roleIds.MODERATOR && member.roles.cache.has(roleIds.MODERATOR)) {
        return PermissionLevel.MODERATOR;
      }

      // Check for direct user ID assignments (alternative method)
      const userId = member.id;
      const adminUserIds = process.env.ADMIN_USER_IDS?.split(',') || [];
      const moderatorUserIds = process.env.MODERATOR_USER_IDS?.split(',') || [];

      if (adminUserIds.includes(userId)) {
        return PermissionLevel.ADMIN;
      }

      if (moderatorUserIds.includes(userId)) {
        return PermissionLevel.MODERATOR;
      }

      // Default to user level
      return PermissionLevel.USER;
    } catch (error) {
      logger.error('Error checking user permissions:', error);
      return PermissionLevel.USER; // Default to lowest permission
    }
  }

  // Check if user has required permission level
  static hasPermission(member: GuildMember, requiredLevel: PermissionLevel): boolean {
    const userLevel = this.getUserPermissionLevel(member);
    return userLevel >= requiredLevel;
  }

  // Check if user has specific Discord permission
  static hasDiscordPermission(member: GuildMember, permission: PermissionResolvable): boolean {
    return member.permissions.has(permission);
  }

  // Get permission level name for display
  static getPermissionLevelName(level: PermissionLevel): string {
    switch (level) {
      case PermissionLevel.ADMIN:
        return 'Admin';
      case PermissionLevel.MODERATOR:
        return 'Moderator';
      case PermissionLevel.USER:
        return 'User';
      default:
        return 'Unknown';
    }
  }

  // Validate role IDs from environment
  static validateRoleIds(): boolean {
    const roleIds = this.getRoleIds();
    const hasModeratorRole = !!roleIds.MODERATOR;
    const hasAdminRole = !!roleIds.ADMIN;

    if (!hasModeratorRole) {
      logger.warn('MODERATOR_ROLE_ID not set in environment variables');
    }

    if (!hasAdminRole) {
      logger.warn('ADMIN_ROLE_ID not set in environment variables');
    }

    return hasModeratorRole && hasAdminRole;
  }

  // Get role information for debugging
  static getRoleInfo(member: GuildMember): {
    userId: string;
    username: string;
    roles: string[];
    permissionLevel: PermissionLevel;
    permissionName: string;
  } {
    const permissionLevel = this.getUserPermissionLevel(member);
    
    return {
      userId: member.id,
      username: member.user.username,
      roles: member.roles.cache.map(role => role.name),
      permissionLevel,
      permissionName: this.getPermissionLevelName(permissionLevel),
    };
  }
} 