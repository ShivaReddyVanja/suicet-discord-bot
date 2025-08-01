import { SlashCommandBuilder } from 'discord.js';

// Permission levels for role-based access control
export enum PermissionLevel {
  USER = 0,        // Can request tokens
  MODERATOR = 1,   // Can view analytics, ban users
  ADMIN = 2        // Full access, config changes
}

// API response types
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

// Command structure
export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: any) => Promise<void>;
  permissionLevel: PermissionLevel;
}

// Discord user context
export interface DiscordUser {
  id: string;
  username: string;
  roles: string[];
}

// Rate limiting
export interface RateLimitInfo {
  remaining: number;
  resetTime: number;
  limit: number;
} 