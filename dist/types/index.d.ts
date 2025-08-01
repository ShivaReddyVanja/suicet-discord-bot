import { SlashCommandBuilder } from 'discord.js';
export declare enum PermissionLevel {
    USER = 0,// Can request tokens
    MODERATOR = 1,// Can view analytics, ban users
    ADMIN = 2
}
export interface FaucetRequest {
    walletAddress: string;
}
export interface FaucetResponse {
    status: 'success' | 'error';
    message?: string;
    tx?: string;
    error?: string;
}
export interface AnalyticsResponse {
    totals: {
        requests: number;
        success: number;
        failed: number;
        tokensDispensed: number;
    };
    recent: Array<{
        id: string;
        walletAddress: string;
        status: string;
        createdAt: string;
    }>;
}
export interface ConfigResponse {
    success: boolean;
    config: {
        availableBalance: number;
        faucetAmount: number;
        cooldownSeconds: number;
        maxRequestsPerWallet: number;
        enabled: boolean;
        maxRequestsPerIp: number;
    };
}
export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: any) => Promise<void>;
    permissionLevel: PermissionLevel;
}
export interface DiscordUser {
    id: string;
    username: string;
    roles: string[];
}
export interface RateLimitInfo {
    remaining: number;
    resetTime: number;
    limit: number;
}
//# sourceMappingURL=index.d.ts.map