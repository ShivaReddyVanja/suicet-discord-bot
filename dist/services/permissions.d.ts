import { GuildMember, PermissionResolvable } from 'discord.js';
import { PermissionLevel } from '../types';
export declare class PermissionService {
    private static getRoleIds;
    static getUserPermissionLevel(member: GuildMember): PermissionLevel;
    static hasPermission(member: GuildMember, requiredLevel: PermissionLevel): boolean;
    static hasDiscordPermission(member: GuildMember, permission: PermissionResolvable): boolean;
    static getPermissionLevelName(level: PermissionLevel): string;
    static validateRoleIds(): boolean;
    static getRoleInfo(member: GuildMember): {
        userId: string;
        username: string;
        roles: string[];
        permissionLevel: PermissionLevel;
        permissionName: string;
    };
}
//# sourceMappingURL=permissions.d.ts.map