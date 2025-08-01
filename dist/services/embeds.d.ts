import { EmbedBuilder } from 'discord.js';
import { FaucetResponse, AnalyticsResponse, ConfigResponse } from '../types';
export declare class EmbedService {
    static createSuccessEmbed(response: FaucetResponse, walletAddress: string): EmbedBuilder;
    static createErrorEmbed(error: string, walletAddress?: string): EmbedBuilder;
    static createRateLimitEmbed(remainingTime: number): EmbedBuilder;
    static createAnalyticsEmbed(analytics: AnalyticsResponse): EmbedBuilder;
    static createConfigEmbed(config: ConfigResponse['config']): EmbedBuilder;
    static createHelpEmbed(): EmbedBuilder;
    static createInfoEmbed(): EmbedBuilder;
}
//# sourceMappingURL=embeds.d.ts.map