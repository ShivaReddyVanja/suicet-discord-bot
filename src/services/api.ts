import axios, { AxiosInstance } from 'axios';
import { FaucetRequest, FaucetResponse, AnalyticsResponse, ConfigResponse } from '../types';
import logger from '../utils/logger';
import authService from './auth';

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'http://localhost:5001/api';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        logger.info(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Request SUI tokens
  async requestTokens(walletAddress: string, discordUserId: string): Promise<FaucetResponse> {
    try {
      const response = await this.client.post<FaucetResponse>('/faucet', {
        walletAddress,
        discordUserId, // Additional context for tracking
      });

      return response.data;
    } catch (error: any) {
      logger.error('Failed to request tokens:', error);
      throw error;
    }
  }

  // Get faucet analytics (no authentication required for role-based access)
  async getAnalytics(): Promise<AnalyticsResponse> {
    try {
      const botSecret = process.env.DISCORD_BOT_SECRET;
      if (!botSecret) {
        throw new Error('DISCORD_BOT_SECRET not found in environment variables');
      }

      const response = await this.client.get<AnalyticsResponse>('/admin/analytics', {
        headers: {
          'User-Agent': 'Discord-Bot/1.0',
          'X-Discord-Bot-Secret': botSecret,
        },
      });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to get analytics:', error);
      throw error;
    }
  }

  // Get faucet configuration (no authentication required for role-based access)
  async getConfig(): Promise<ConfigResponse> {
    try {
      const botSecret = process.env.DISCORD_BOT_SECRET;
      if (!botSecret) {
        throw new Error('DISCORD_BOT_SECRET not found in environment variables');
      }

      const response = await this.client.get<ConfigResponse>('/admin/config', {
        headers: {
          'User-Agent': 'Discord-Bot/1.0',
          'X-Discord-Bot-Secret': botSecret,
        },
      });
      return response.data;
    } catch (error: any) {
      logger.error('Failed to get config:', error);
      throw error;
    }
  }

  // Update faucet configuration (no authentication required for role-based access)
  async updateConfig(configData: {
    cooldownSeconds?: number;
    faucetAmount?: number;
    maxRequestsPerIp?: number;
    maxRequestsPerWallet?: number;
    enabled?: boolean;
  }): Promise<{ success: boolean; config?: any; error?: string }> {
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
    } catch (error: any) {
      logger.error('Failed to update config:', error);
      throw error;
    }
  }

  // Check if API is available
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/');
      return response.status === 200;
    } catch (error) {
      logger.error('Health check failed:', error);
      return false;
    }
  }
}

export default new ApiService(); 