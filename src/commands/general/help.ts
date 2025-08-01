import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, PermissionLevel } from '../../types';
import { EmbedService } from '../../services/embeds';
import logger from '../../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show help information about the Sui Faucet bot');

export const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  try {
    // Defer the reply to give us time to process
    await interaction.deferReply({ ephemeral: true });

    // Create help embed
    const embed = EmbedService.createHelpEmbed();

    // Send the response
    await interaction.editReply({ embeds: [embed] });

    logger.info(`Help command executed by ${interaction.user.username} (${interaction.user.id})`);
  } catch (error) {
    logger.error('Error executing help command:', error);
    
    // Try to send error message
    try {
      const errorEmbed = EmbedService.createErrorEmbed('Failed to show help information. Please try again.');
      await interaction.editReply({ embeds: [errorEmbed] });
    } catch (replyError) {
      logger.error('Failed to send error message:', replyError);
    }
  }
};

export const command: Command = {
  data,
  execute,
  permissionLevel: PermissionLevel.USER,
}; 