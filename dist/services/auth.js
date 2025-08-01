"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../utils/logger"));
class AuthService {
    constructor() {
        this.tokens = new Map();
        this.baseURL = process.env.API_BASE_URL || 'http://localhost:3001/api';
    }
    // Store token for a Discord user
    setToken(discordUserId, token) {
        this.tokens.set(discordUserId, token);
        logger_1.default.info(`Stored token for Discord user: ${discordUserId}`);
    }
    // Get token for a Discord user
    getToken(discordUserId) {
        const token = this.tokens.get(discordUserId);
        if (!token) {
            return null;
        }
        // Check if token is expired
        if (Date.now() > token.expiresAt) {
            this.tokens.delete(discordUserId);
            logger_1.default.info(`Token expired for Discord user: ${discordUserId}`);
            return null;
        }
        return token;
    }
    // Remove token for a Discord user
    removeToken(discordUserId) {
        this.tokens.delete(discordUserId);
        logger_1.default.info(`Removed token for Discord user: ${discordUserId}`);
    }
    // Check if user is authenticated
    isAuthenticated(discordUserId) {
        return this.getToken(discordUserId) !== null;
    }
    // Get authorization header for API requests
    getAuthHeader(discordUserId) {
        const token = this.getToken(discordUserId);
        return token ? `Bearer ${token.accessToken}` : null;
    }
    // Login with API key
    async login(discordUserId, apiKey) {
        try {
            const response = await axios_1.default.post(`${this.baseURL}/discord/login`, {
                apiKey,
                discordUserId,
            });
            if (response.data.success && response.data.accessToken) {
                // Calculate expiration (3 days for Discord admin tokens)
                const expiresAt = Date.now() + (3 * 24 * 60 * 60 * 1000); // 3 days
                const token = {
                    accessToken: response.data.accessToken,
                    walletAddress: 'discord_admin',
                    role: 'admin',
                    expiresAt,
                };
                this.setToken(discordUserId, token);
                logger_1.default.info(`Successfully authenticated Discord user: ${discordUserId}`);
                return true;
            }
            return false;
        }
        catch (error) {
            logger_1.default.error('Login failed:', error.response?.data || error.message);
            return false;
        }
    }
    // Refresh token if needed
    async refreshToken(discordUserId) {
        const token = this.getToken(discordUserId);
        if (!token) {
            return false;
        }
        // If token expires in less than 5 minutes, try to refresh
        if (token.expiresAt - Date.now() < 5 * 60 * 1000) {
            try {
                const response = await axios_1.default.post(`${this.baseURL}/admin/refresh`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token.accessToken}`,
                    },
                });
                if (response.data.success && response.data.accessToken) {
                    const newToken = {
                        accessToken: response.data.accessToken,
                        walletAddress: token.walletAddress,
                        role: token.role,
                        expiresAt: Date.now() + (3 * 24 * 60 * 60 * 1000), // 3 days
                    };
                    this.setToken(discordUserId, newToken);
                    logger_1.default.info(`Refreshed token for Discord user: ${discordUserId}`);
                    return true;
                }
            }
            catch (error) {
                logger_1.default.error('Token refresh failed:', error.response?.data || error.message);
                this.removeToken(discordUserId);
                return false;
            }
        }
        return true; // Token is still valid
    }
    // Logout user
    logout(discordUserId) {
        this.removeToken(discordUserId);
        logger_1.default.info(`Logged out Discord user: ${discordUserId}`);
    }
    // Get all authenticated users (for debugging)
    getAuthenticatedUsers() {
        return Array.from(this.tokens.keys());
    }
}
exports.default = new AuthService();
//# sourceMappingURL=auth.js.map