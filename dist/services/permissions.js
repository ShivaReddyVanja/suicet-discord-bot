"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
const types_1 = require("../types");
const logger_1 = __importDefault(require("../utils/logger"));
class PermissionService {
    // Get role IDs dynamically from environment
    static getRoleIds() {
        return {
            MODERATOR: process.env.MODERATOR_ROLE_ID,
            ADMIN: process.env.ADMIN_ROLE_ID,
        };
    }
    // Get user's permission level based on their roles
    static getUserPermissionLevel(member) {
        try {
            const roleIds = this.getRoleIds();
            // Check if user has admin role
            if (roleIds.ADMIN && member.roles.cache.has(roleIds.ADMIN)) {
                return types_1.PermissionLevel.ADMIN;
            }
            // Check if user has moderator role
            if (roleIds.MODERATOR && member.roles.cache.has(roleIds.MODERATOR)) {
                return types_1.PermissionLevel.MODERATOR;
            }
            // Check for direct user ID assignments (alternative method)
            const userId = member.id;
            const adminUserIds = process.env.ADMIN_USER_IDS?.split(',') || [];
            const moderatorUserIds = process.env.MODERATOR_USER_IDS?.split(',') || [];
            if (adminUserIds.includes(userId)) {
                return types_1.PermissionLevel.ADMIN;
            }
            if (moderatorUserIds.includes(userId)) {
                return types_1.PermissionLevel.MODERATOR;
            }
            // Default to user level
            return types_1.PermissionLevel.USER;
        }
        catch (error) {
            logger_1.default.error('Error checking user permissions:', error);
            return types_1.PermissionLevel.USER; // Default to lowest permission
        }
    }
    // Check if user has required permission level
    static hasPermission(member, requiredLevel) {
        const userLevel = this.getUserPermissionLevel(member);
        return userLevel >= requiredLevel;
    }
    // Check if user has specific Discord permission
    static hasDiscordPermission(member, permission) {
        return member.permissions.has(permission);
    }
    // Get permission level name for display
    static getPermissionLevelName(level) {
        switch (level) {
            case types_1.PermissionLevel.ADMIN:
                return 'Admin';
            case types_1.PermissionLevel.MODERATOR:
                return 'Moderator';
            case types_1.PermissionLevel.USER:
                return 'User';
            default:
                return 'Unknown';
        }
    }
    // Validate role IDs from environment
    static validateRoleIds() {
        const roleIds = this.getRoleIds();
        const hasModeratorRole = !!roleIds.MODERATOR;
        const hasAdminRole = !!roleIds.ADMIN;
        if (!hasModeratorRole) {
            logger_1.default.warn('MODERATOR_ROLE_ID not set in environment variables');
        }
        if (!hasAdminRole) {
            logger_1.default.warn('ADMIN_ROLE_ID not set in environment variables');
        }
        return hasModeratorRole && hasAdminRole;
    }
    // Get role information for debugging
    static getRoleInfo(member) {
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
exports.PermissionService = PermissionService;
//# sourceMappingURL=permissions.js.map