"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
const types_1 = require("../../types");
const logger_1 = __importDefault(require("../../utils/logger"));
const zod_1 = require("zod");
const axios_1 = __importStar(require("axios"));
const WalletAddressSchema = zod_1.z.string().regex(/^0x[a-fA-F0-9]{64}$/, {
    message: 'Invalid Sui wallet address format. Must be a 64-character hex string starting with 0x'
});
// Embed Service Class
class EmbedService {
    static createRateLimitEmbed(error, nextClaimDate, timeRemaining) {
        const remainingSeconds = Math.max(0, Math.floor(timeRemaining / 1000));
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        const timeString = hours > 0
            ? `${hours}h ${minutes}m ${seconds}s`
            : minutes > 0
                ? `${minutes}m ${seconds}s`
                : `${seconds}s`;
        return new discord_js_1.EmbedBuilder()
            .setColor('#FF6B6B')
            .setTitle('⏰ Rate Limited')
            .setDescription(error)
            .addFields([
            {
                name: 'Next Claim Available',
                value: `<t:${Math.floor(nextClaimDate.getTime() / 1000)}:F>`,
                inline: true
            },
            {
                name: 'Time Remaining',
                value: timeString,
                inline: true
            }
        ])
            .setTimestamp();
    }
    static createSuccessEmbed(response, walletAddress) {
        return new discord_js_1.EmbedBuilder()
            .setColor('#4ECDC4')
            .setTitle('✅ Tokens Requested Successfully')
            .setDescription(response.message || 'Your testnet tokens have been sent!')
            .addFields([
            {
                name: 'Wallet Address',
                value: `\`${walletAddress}\``,
                inline: false
            },
            ...(response.tx ? [{
                    name: 'Transaction Hash',
                    value: `\`${response.tx}\``,
                    inline: false
                }] : [])
        ])
            .setTimestamp();
    }
    static createErrorEmbed(title, description) {
        return new discord_js_1.EmbedBuilder()
            .setColor('#FF6B6B')
            .setTitle(`❌ ${title}`)
            .setDescription(description)
            .setTimestamp();
    }
}
// Enhanced API Service with Proper Error Handling
const faucetApiService = {
    async requestTokens(walletAddress, userId) {
        const api = axios_1.default.create({
            baseURL: process.env.API_BASE_URL,
            timeout: 10000,
        });
        try {
            logger_1.default.info(`Requesting tokens for wallet: ${walletAddress}, user: ${userId}`);
            const response = await api.post('/faucet', {
                walletAddress,
                userId
            });
            logger_1.default.info('Faucet request successful:', response.data);
            return {
                status: "success",
                message: response.data.message,
                tx: response.data.tx,
            };
        }
        catch (error) {
            // Type-safe error handling
            if (error instanceof axios_1.AxiosError) {
                logger_1.default.error('Axios error:', error.response?.data || error.message);
                // Handle rate limiting (429)
                if (error.response?.status === 429) {
                    const { retryAfter, retryAt, error: errorMsg } = error.response.data;
                    const nextClaimTimestamp = retryAt
                        ? new Date(retryAt).getTime()
                        : Date.now() + (parseInt(retryAfter) * 1000);
                    return {
                        status: "error",
                        error: errorMsg || 'Rate limit exceeded. Please try again later.',
                        nextClaimTimestamp,
                    };
                }
                // Handle other HTTP errors
                if (error.response) {
                    return {
                        status: "error",
                        error: error.response.data?.error || `Request failed with status ${error.response.status}`,
                    };
                }
                // Handle network/timeout errors
                if (error.code === 'ECONNABORTED') {
                    return {
                        status: "error",
                        error: 'Request timeout. Please try again later.',
                    };
                }
                if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
                    return {
                        status: "error",
                        error: 'Server is under maintenance. Please try again later.',
                    };
                }
            }
            // Log the actual error for debugging
            logger_1.default.error('Unexpected error in faucet service:', error);
            return {
                status: "error",
                error: 'An unexpected error occurred. Please try again later.',
            };
        }
    }
};
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('faucet')
    .setDescription('Request SUI testnet tokens')
    .addSubcommand(subcommand => subcommand
    .setName('request')
    .setDescription('Request 0.01 SUI testnet tokens')
    .addStringOption(option => option
    .setName('wallet_address')
    .setDescription('Your Sui wallet address (0x...)')
    .setRequired(true)));
const execute = async (interaction) => {
    try {
        // Fix deprecation warning - use flags instead of ephemeral
        await interaction.deferReply({
            flags: ['Ephemeral']
        });
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'request') {
            const walletAddress = interaction.options.getString('wallet_address', true);
            // Validate wallet address format
            try {
                WalletAddressSchema.parse(walletAddress);
            }
            catch (error) {
                const errorEmbed = EmbedService.createErrorEmbed('Invalid Wallet Address', 'Please provide a valid Sui wallet address in the format: `0x` followed by 64 hexadecimal characters.\n\nExample: `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`');
                await interaction.editReply({ embeds: [errorEmbed] });
                return;
            }
            // Enhanced logging for debugging
            logger_1.default.info(`Processing faucet request for user ${interaction.user.id} with wallet ${walletAddress}`);
            // Request tokens with proper error handling
            const response = await faucetApiService.requestTokens(walletAddress, interaction.user.id);
            logger_1.default.info('Faucet service response:', response);
            if (response.status === 'success') {
                const successEmbed = EmbedService.createSuccessEmbed(response, walletAddress);
                await interaction.editReply({ embeds: [successEmbed] });
            }
            else {
                // Handle rate limiting with timestamp formatting
                if (response.nextClaimTimestamp) {
                    const nextClaimDate = new Date(response.nextClaimTimestamp);
                    const timeRemaining = response.nextClaimTimestamp - Date.now();
                    const errorEmbed = EmbedService.createRateLimitEmbed(response.error || 'Rate limit exceeded. Please try again later.', nextClaimDate, timeRemaining);
                    await interaction.editReply({ embeds: [errorEmbed] });
                }
                else {
                    // Handle other API errors
                    const errorEmbed = EmbedService.createErrorEmbed('Request Failed', response.error || 'Failed to request tokens. Please try again later.');
                    await interaction.editReply({ embeds: [errorEmbed] });
                }
            }
        }
    }
    catch (error) {
        logger_1.default.error('Error executing faucet request command:', error);
        const errorEmbed = EmbedService.createErrorEmbed('Unexpected Error', 'An unexpected error occurred while processing your request. Please try again later.');
        // Fix deprecation warning for error responses too
        const replyOptions = {
            embeds: [errorEmbed],
            flags: ['Ephemeral']
        };
        if (interaction.deferred) {
            await interaction.editReply({ embeds: [errorEmbed] });
        }
        else {
            await interaction.reply(replyOptions);
        }
    }
};
exports.execute = execute;
exports.command = {
    data: exports.data,
    execute: exports.execute,
    permissionLevel: types_1.PermissionLevel.USER,
};
//# sourceMappingURL=request.js.map