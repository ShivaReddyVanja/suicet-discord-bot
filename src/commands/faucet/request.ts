import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, PermissionLevel } from '../../types';
import { EmbedService } from '../../services/embeds';
import apiService from '../../services/api';
import logger from '../../utils/logger';
import { z } from 'zod';

const WalletAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/, {
  message: 'Invalid Sui wallet address format. Must be a 64-character hex string starting with 0x'
});

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
    // Defer reply to give us time to process
    await interaction.deferReply({ ephemeral: true });

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

      // Call the API to request tokens
      const response = await apiService.requestTokens(walletAddress, interaction.user.id);
      
      if (response.status === 'success') {
        const successEmbed = EmbedService.createSuccessEmbed(response, walletAddress);
        await interaction.editReply({ embeds: [successEmbed] });
      } else {
        const errorEmbed = EmbedService.createErrorEmbed(
          response.error || 'Failed to request tokens. Please try again later.',
          walletAddress
        );
        await interaction.editReply({ embeds: [errorEmbed] });
      }
    }
  } catch (error) {
    logger.error('Error executing faucet request command:', error);
    
    const errorEmbed = EmbedService.createErrorEmbed(
      'Unexpected Error',
      'An unexpected error occurred while processing your request. Please try again later.'
    );
    
    if (interaction.deferred) {
      await interaction.editReply({ embeds: [errorEmbed] });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};

export const command: Command = {
  data,
  execute,
  permissionLevel: PermissionLevel.USER,
}; 