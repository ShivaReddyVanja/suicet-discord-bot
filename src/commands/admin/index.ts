import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command, PermissionLevel } from '../../types';
import { EmbedService } from '../../services/embeds';
import apiService from '../../services/api';
import authService from '../../services/auth';
import logger from '../../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('admin')
  .setDescription('Admin commands for faucet management')
  .addSubcommand(subcommand =>
    subcommand
      .setName('analytics')
      .setDescription('View faucet statistics and analytics')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('config')
      .setDescription('View faucet configuration settings')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('update-config')
      .setDescription('Update faucet configuration settings')
      .addIntegerOption(option =>
        option
          .setName('cooldown_seconds')
          .setDescription('Cooldown period in seconds (optional)')
          .setRequired(false)
      )
      .addNumberOption(option =>
        option
          .setName('faucet_amount')
          .setDescription('Amount of SUI per request (optional)')
          .setRequired(false)
      )
      .addIntegerOption(option =>
        option
          .setName('max_requests_per_ip')
          .setDescription('Maximum requests per IP (optional)')
          .setRequired(false)
      )
      .addIntegerOption(option =>
        option
          .setName('max_requests_per_wallet')
          .setDescription('Maximum requests per wallet (optional)')
          .setRequired(false)
      )
      .addBooleanOption(option =>
        option
          .setName('enabled')
          .setDescription('Enable/disable faucet (optional)')
          .setRequired(false)
      )
  ) as SlashCommandBuilder;

export const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  try {
    // Defer reply to give us time to process
    await interaction.deferReply({ ephemeral: true });

    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {


      case 'analytics':
        try {
          const analytics = await apiService.getAnalytics();
          const analyticsEmbed = EmbedService.createAnalyticsEmbed(analytics);
          await interaction.editReply({ embeds: [analyticsEmbed] });
        } catch (error) {
          logger.error('Error fetching analytics:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unable to retrieve faucet analytics. Please try again later.';
          const errorEmbed = EmbedService.createErrorEmbed(
            'Failed to fetch analytics',
            errorMessage
          );
          await interaction.editReply({ embeds: [errorEmbed] });
        }
        break;

      case 'config':
        try {
          const config = await apiService.getConfig();
          const configEmbed = EmbedService.createConfigEmbed(config.config);
          await interaction.editReply({ embeds: [configEmbed] });
        } catch (error) {
          logger.error('Error fetching config:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unable to retrieve faucet configuration. Please try again later.';
          const errorEmbed = EmbedService.createErrorEmbed(
            'Failed to fetch configuration',
            errorMessage
          );
          await interaction.editReply({ embeds: [errorEmbed] });
        }
        break;

      case 'update-config':
        try {
          // Collect all provided options
          const configData: any = {};
          
          const cooldownSeconds = interaction.options.getInteger('cooldown_seconds');
          if (cooldownSeconds !== null) configData.cooldownSeconds = cooldownSeconds;
          
          const faucetAmount = interaction.options.getNumber('faucet_amount');
          if (faucetAmount !== null) configData.faucetAmount = faucetAmount;
          
          const maxRequestsPerIp = interaction.options.getInteger('max_requests_per_ip');
          if (maxRequestsPerIp !== null) configData.maxRequestsPerIp = maxRequestsPerIp;
          
          const maxRequestsPerWallet = interaction.options.getInteger('max_requests_per_wallet');
          if (maxRequestsPerWallet !== null) configData.maxRequestsPerWallet = maxRequestsPerWallet;
          
          const enabled = interaction.options.getBoolean('enabled');
          if (enabled !== null) configData.enabled = enabled;

          // Check if any config data was provided
          if (Object.keys(configData).length === 0) {
            const errorEmbed = EmbedService.createErrorEmbed(
              'No Configuration Provided',
              'Please provide at least one configuration option to update.'
            );
            await interaction.editReply({ embeds: [errorEmbed] });
            return;
          }

          // Update configuration
          const result = await apiService.updateConfig(configData);
          
          if (result.success) {
            const successEmbed = new EmbedBuilder()
              .setColor(0x00ff00)
              .setTitle('✅ Configuration Updated')
              .setDescription('Faucet configuration has been updated successfully.')
              .addFields(
                { name: 'Updated Fields', value: Object.keys(configData).join(', '), inline: false }
              )
              .setTimestamp()
              .setFooter({ text: 'Sui Testnet Faucet' });
            
            await interaction.editReply({ embeds: [successEmbed] });
          } else {
            const errorEmbed = EmbedService.createErrorEmbed(
              'Update Failed',
              result.error || 'Failed to update configuration.'
            );
            await interaction.editReply({ embeds: [errorEmbed] });
          }
        } catch (error) {
          logger.error('Error updating config:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unable to update faucet configuration. Please try again later.';
          const errorEmbed = EmbedService.createErrorEmbed(
            'Failed to update configuration',
            errorMessage
          );
          await interaction.editReply({ embeds: [errorEmbed] });
        }
        break;

      default:
        const errorEmbed = EmbedService.createErrorEmbed(
          'Unknown Subcommand',
          `Unknown subcommand: ${subcommand}`
        );
        await interaction.editReply({ embeds: [errorEmbed] });
        break;
    }
  } catch (error) {
    logger.error('Error executing admin command:', error);
    
    const errorEmbed = EmbedService.createErrorEmbed(
      'Command Error',
      'An unexpected error occurred while processing your request.'
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
  permissionLevel: PermissionLevel.ADMIN, // Only admins can access these commands
}; 