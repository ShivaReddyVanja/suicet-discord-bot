import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, InteractionReplyOptions } from 'discord.js';
import { Command, PermissionLevel } from '../../types';
import logger from '../../utils/logger';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';

const WalletAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/, {
  message: 'Invalid Sui wallet address format. Must be a 64-character hex string starting with 0x'
});

// Types
interface FaucetResponse {
  tx?: string;
  nextClaimTimestamp?: number;
  message?: string;
  error?: string;
  status: string;
}

interface FaucetRequest {
  walletAddress: string;
  userId: string;
}

// Embed Service Class
class EmbedService {
  static createRateLimitEmbed(error: string, nextClaimDate: Date, timeRemaining: number): EmbedBuilder {
    const remainingSeconds = Math.max(0, Math.floor(timeRemaining / 1000));
    
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    
    const timeString = hours > 0 
      ? `${hours}h ${minutes}m ${seconds}s`
      : minutes > 0 
        ? `${minutes}m ${seconds}s`
        : `${seconds}s`;

    return new EmbedBuilder()
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

  static createSuccessEmbed(response: FaucetResponse, walletAddress: string): EmbedBuilder {
    return new EmbedBuilder()
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

  static createErrorEmbed(title: string, description: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor('#FF6B6B')
      .setTitle(`❌ ${title}`)
      .setDescription(description)
      .setTimestamp();
  }
}

// Enhanced API Service with Proper Error Handling
const faucetApiService = {
  async requestTokens(walletAddress: string, userId: string): Promise<FaucetResponse> {
    const api = axios.create({
      baseURL: process.env.API_BASE_URL,
      timeout: 10000,
    });

    try {
      logger.info(`Requesting tokens for wallet: ${walletAddress}, user: ${userId}`);
      
      const response = await api.post('/faucet', { 
        walletAddress,
        userId 
      } as FaucetRequest);

      logger.info('Faucet request successful:', response.data);

      return {
        status: "success",
        message: response.data.message,
        tx: response.data.tx,
      };
    } catch (error) {
      // Type-safe error handling
      if (error instanceof AxiosError) {
        logger.error('Axios error:', error.response?.data || error.message);
        
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
      logger.error('Unexpected error in faucet service:', error);
      
      return {
        status: "error",
        error: 'An unexpected error occurred. Please try again later.',
      };
    }
  }
};

export const data = new SlashCommandBuilder()
  .setName('faucet')
  .setDescription('Request SUI testnet tokens')
  .addSubcommand(subcommand =>
    subcommand
      .setName('request')
      .setDescription('Request 0.01 SUI testnet tokens')
      .addStringOption(option =>
        option
          .setName('wallet_address')
          .setDescription('Your Sui wallet address (0x...)')
          .setRequired(true)
      )
  ) as SlashCommandBuilder;

export const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
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
      } catch (error) {
        const errorEmbed = EmbedService.createErrorEmbed(
          'Invalid Wallet Address',
          'Please provide a valid Sui wallet address in the format: `0x` followed by 64 hexadecimal characters.\n\nExample: `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`'
        );
        await interaction.editReply({ embeds: [errorEmbed] });
        return;
      }

      // Enhanced logging for debugging
      logger.info(`Processing faucet request for user ${interaction.user.id} with wallet ${walletAddress}`);

      // Request tokens with proper error handling
      const response = await faucetApiService.requestTokens(walletAddress, interaction.user.id);
      
      logger.info('Faucet service response:', response);

      if (response.status === 'success') {
        const successEmbed = EmbedService.createSuccessEmbed(response, walletAddress);
        await interaction.editReply({ embeds: [successEmbed] });
      } else {
        // Handle rate limiting with timestamp formatting
        if (response.nextClaimTimestamp) {
          const nextClaimDate = new Date(response.nextClaimTimestamp);
          const timeRemaining = response.nextClaimTimestamp - Date.now();
          
          const errorEmbed = EmbedService.createRateLimitEmbed(
            response.error || 'Rate limit exceeded. Please try again later.',
            nextClaimDate,
            timeRemaining
          );
          await interaction.editReply({ embeds: [errorEmbed] });
        } else {
          // Handle other API errors
          const errorEmbed = EmbedService.createErrorEmbed(
            'Request Failed',
            response.error || 'Failed to request tokens. Please try again later.'
          );
          await interaction.editReply({ embeds: [errorEmbed] });
        }
      }
    }
  } catch (error) {
    logger.error('Error executing faucet request command:', error);
    
    const errorEmbed = EmbedService.createErrorEmbed(
      'Unexpected Error',
      'An unexpected error occurred while processing your request. Please try again later.'
    );
    
    // Fix deprecation warning for error responses too
    const replyOptions: InteractionReplyOptions = { 
      embeds: [errorEmbed], 
      flags: ['Ephemeral'] 
    };
    
    if (interaction.deferred) {
      await interaction.editReply({ embeds: [errorEmbed] });
    } else {
      await interaction.reply(replyOptions);
    }
  }
};

export const command: Command = {
  data,
  execute,
  permissionLevel: PermissionLevel.USER,
};
