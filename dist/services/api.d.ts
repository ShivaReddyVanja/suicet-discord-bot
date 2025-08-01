import { FaucetResponse, AnalyticsResponse, ConfigResponse } from '../types';
declare class ApiService {
    private client;
    private baseURL;
    constructor();
    requestTokens(walletAddress: string, discordUserId: string): Promise<FaucetResponse>;
    getAnalytics(): Promise<AnalyticsResponse>;
    getConfig(): Promise<ConfigResponse>;
    updateConfig(configData: {
        cooldownSeconds?: number;
        faucetAmount?: number;
        maxRequestsPerIp?: number;
        maxRequestsPerWallet?: number;
        enabled?: boolean;
    }): Promise<{
        success: boolean;
        config?: any;
        error?: string;
    }>;
    healthCheck(): Promise<boolean>;
}
declare const _default: ApiService;
export default _default;
//# sourceMappingURL=api.d.ts.map