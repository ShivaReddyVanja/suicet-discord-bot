import axios from 'axios';
import { z } from 'zod';
import logger from '../utils/logger';

interface AuthToken {
  accessToken: string;
  walletAddress: string;
  role: string;
  expiresAt: number;
}

interface LoginRequest {
  walletAddress: string;
  message: string;
  signature: string;
  signedBytes: string;
}

class AuthService {
  private tokens: Map<string, AuthToken> = new Map();
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'http://localhost:3001/api';
  }

  // Store token for a Discord user
  setToken(discordUserId: string, token: AuthToken): void {
    this.tokens.set(discordUserId, token);
    logger.info(`Stored token for Discord user: ${discordUserId}`);
  }

  // Get token for a Discord user
  getToken(discordUserId: string): AuthToken | null {
    const token = this.tokens.get(discordUserId);
    
    if (!token) {
      return null;
    }

    // Check if token is expired
    if (Date.now() > token.expiresAt) {
      this.tokens.delete(discordUserId);
      logger.info(`Token expired for Discord user: ${discordUserId}`);
      return null;
    }

    return token;
  }

  // Remove token for a Discord user
  removeToken(discordUserId: string): void {
    this.tokens.delete(discordUserId);
    logger.info(`Removed token for Discord user: ${discordUserId}`);
  }

  // Check if user is authenticated
  isAuthenticated(discordUserId: string): boolean {
    return this.getToken(discordUserId) !== null;
  }

  // Get authorization header for API requests
  getAuthHeader(discordUserId: string): string | null {
    const token = this.getToken(discordUserId);
    return token ? `Bearer ${token.accessToken}` : null;
  }

  // Login with API key
  async login(discordUserId: string, apiKey: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseURL}/discord/login`, {
        apiKey,
        discordUserId,
      });
      
      if (response.data.success && response.data.accessToken) {
        // Calculate expiration (3 days for Discord admin tokens)
        const expiresAt = Date.now() + (3 * 24 * 60 * 60 * 1000); // 3 days
        
        const token: AuthToken = {
          accessToken: response.data.accessToken,
          walletAddress: 'discord_admin',
          role: 'admin',
          expiresAt,
        };

        this.setToken(discordUserId, token);
        logger.info(`Successfully authenticated Discord user: ${discordUserId}`);
        return true;
      }

      return false;
    } catch (error: any) {
      logger.error('Login failed:', error.response?.data || error.message);
      return false;
    }
  }

  // Refresh token if needed
  async refreshToken(discordUserId: string): Promise<boolean> {
    const token = this.getToken(discordUserId);
    if (!token) {
      return false;
    }

    // If token expires in less than 5 minutes, try to refresh
    if (token.expiresAt - Date.now() < 5 * 60 * 1000) {
      try {
        const response = await axios.post(`${this.baseURL}/admin/refresh`, {}, {
          headers: {
            'Authorization': `Bearer ${token.accessToken}`,
          },
        });

        if (response.data.success && response.data.accessToken) {
          const newToken: AuthToken = {
            accessToken: response.data.accessToken,
            walletAddress: token.walletAddress,
            role: token.role,
            expiresAt: Date.now() + (3 * 24 * 60 * 60 * 1000), // 3 days
          };

          this.setToken(discordUserId, newToken);
          logger.info(`Refreshed token for Discord user: ${discordUserId}`);
          return true;
        }
      } catch (error: any) {
        logger.error('Token refresh failed:', error.response?.data || error.message);
        this.removeToken(discordUserId);
        return false;
      }
    }

    return true; // Token is still valid
  }

  // Logout user
  logout(discordUserId: string): void {
    this.removeToken(discordUserId);
    logger.info(`Logged out Discord user: ${discordUserId}`);
  }

  // Get all authenticated users (for debugging)
  getAuthenticatedUsers(): string[] {
    return Array.from(this.tokens.keys());
  }
}

export default new AuthService(); 