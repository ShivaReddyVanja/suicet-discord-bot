"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../utils/logger"));
class ApiService {
    constructor() {
        this.baseURL = process.env.API_BASE_URL || 'http://localhost:5001/api';
        this.client = axios_1.default.create({
            baseURL: this.baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Add request interceptor for logging
        this.client.interceptors.request.use((config) => {
            logger_1.default.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }, (error) => {
            logger_1.default.error('API Request Error:', error);
            return Promise.reject(error);
        });
        // Add response interceptor for logging
        this.client.interceptors.response.use((response) => {
            logger_1.default.info(`API Response: ${response.status} ${response.config.url}`);
            return response;
        }, (error) => {
            logger_1.default.error('API Response Error:', error.response?.data || error.message);
            return Promise.reject(error);
        });
    }
    // Request SUI tokens
    async requestTokens(walletAddress, discordUserId) {
        try {
            const response = await this.client.post('/faucet', {
                walletAddress,
                discordUserId, // Additional context for tracking
            });
            return response.data;
        }
        catch (error) {
            logger_1.default.error('Failed to request tokens:', error);
            throw error;
        }
    }
    // Get faucet analytics (no authentication required for role-based access)
    async getAnalytics() {
        try {
            const botSecret = process.env.DISCORD_BOT_SECRET;
            if (!botSecret) {
                throw new Error('DISCORD_BOT_SECRET not found in environment variables');
            }
            const response = await this.client.get('/admin/analytics', {
                headers: {
                    'User-Agent': 'Discord-Bot/1.0',
                    'X-Discord-Bot-Secret': botSecret,
                },
            });
            return response.data;
        }
        catch (error) {
            logger_1.default.error('Failed to get analytics:', error);
            throw error;
        }
    }
    // Get faucet configuration (no authentication required for role-based access)
    async getConfig() {
        try {
            const botSecret = process.env.DISCORD_BOT_SECRET;
            if (!botSecret) {
                throw new Error('DISCORD_BOT_SECRET not found in environment variables');
            }
            const response = await this.client.get('/admin/config', {
                headers: {
                    'User-Agent': 'Discord-Bot/1.0',
                    'X-Discord-Bot-Secret': botSecret,
                },
            });
            return response.data;
        }
        catch (error) {
            logger_1.default.error('Failed to get config:', error);
            throw error;
        }
    }
    // Update faucet configuration (no authentication required for role-based access)
    async updateConfig(configData) {
        try {
            const botSecret = process.env.DISCORD_BOT_SECRET;
            if (!botSecret) {
                throw new Error('DISCORD_BOT_SECRET not found in environment variables');
            }
            const response = await this.client.post('/admin/config/update', configData, {
                headers: {
                    'User-Agent': 'Discord-Bot/1.0',
                    'X-Discord-Bot-Secret': botSecret,
                },
            });
            return response.data;
        }
        catch (error) {
            logger_1.default.error('Failed to update config:', error);
            throw error;
        }
    }
    // Check if API is available
    async healthCheck() {
        try {
            const response = await this.client.get('/');
            return response.status === 200;
        }
        catch (error) {
            logger_1.default.error('Health check failed:', error);
            return false;
        }
    }
}
exports.default = new ApiService();
//# sourceMappingURL=api.js.map