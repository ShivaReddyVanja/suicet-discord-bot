"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
const types_1 = require("../types");
const logger_1 = __importDefault(require("../utils/logger"));
class PermissionService {
    // Get user's permission level based on their roles
    static getUserPermissionLevel(member) {
        try {
            // Check if user has admin role
            if (this.ROLE_IDS.ADMIN && member.roles.cache.has(this.ROLE_IDS.ADMIN)) {
                return types_1.PermissionLevel.ADMIN;
            }
            // Check if user has moderator role
            if (this.ROLE_IDS.MODERATOR && member.roles.cache.has(this.ROLE_IDS.MODERATOR)) {
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
        const hasModeratorRole = !!this.ROLE_IDS.MODERATOR;
        const hasAdminRole = !!this.ROLE_IDS.ADMIN;
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
// Role IDs (will be set from environment variables)
PermissionService.ROLE_IDS = {
    MODERATOR: process.env.MODERATOR_ROLE_ID,
    ADMIN: process.env.ADMIN_ROLE_ID,
};
//# sourceMappingURL=permissions.js.map