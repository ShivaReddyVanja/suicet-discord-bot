import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, PermissionLevel } from '../../types';
import { EmbedBuilder } from 'discord.js';
import { PermissionService } from '../../services/permissions';

export const data = new SlashCommandBuilder()
  .setName('debug')
  .setDescription('Debug commands')
  .addSubcommand(subcommand =>
    subcommand
      .setName('permissions')
      .setDescription('Show your current permissions and role info')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('roles')
      .setDescription('List all roles with their IDs')
  ) as SlashCommandBuilder;

export const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  try {
    await interaction.deferReply({ ephemeral: true });

    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'permissions') {
      const member = interaction.member;
      if (!member || !('roles' in member)) {
        await interaction.editReply('This command can only be used in a server.');
        return;
      }

      const roleInfo = PermissionService.getRoleInfo(member as any);
      
      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle('🔐 Your Permission Information')
        .addFields(
          { name: '👤 User', value: `${roleInfo.username} (${roleInfo.userId})`, inline: false },
          { name: '🎭 Roles', value: roleInfo.roles.join(', ') || 'No roles', inline: false },
          { name: '🔑 Permission Level', value: roleInfo.permissionName, inline: true },
          { name: '📊 Level Number', value: roleInfo.permissionLevel.toString(), inline: true }
        )
        .addFields(
          { name: '📋 Available Commands', value: getAvailableCommands(roleInfo.permissionLevel), inline: false }
        )
        .setTimestamp()
        .setFooter({ text: 'Bot Permission System' });

      await interaction.editReply({ embeds: [embed] });
    } else if (subcommand === 'roles') {
      const guild = interaction.guild;
      if (!guild) {
        await interaction.editReply('This command can only be used in a server.');
        return;
      }

      const roles = guild.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => `**${role.name}**: \`${role.id}\``)
        .join('\n');

      const embed = new EmbedBuilder()
        .setColor(0x3498db)
        .setTitle('📋 Server Roles')
        .setDescription(roles || 'No roles found')
        .setTimestamp()
        .setFooter({ text: 'Copy these IDs to your .env file' });

      await interaction.editReply({ embeds: [embed] });
    }
  } catch (error) {
    console.error('Error in debug permissions command:', error);
    await interaction.editReply('An error occurred while checking permissions.');
  }
};

function getAvailableCommands(level: PermissionLevel): string {
  const commands = [];
  
  // All users can use these
  commands.push('`/help` - Show help');
  commands.push('`/faucet request` - Request tokens');
  
  if (level >= PermissionLevel.MODERATOR) {
    commands.push('`/admin analytics` - View statistics');
  }
  
  if (level >= PermissionLevel.ADMIN) {
    commands.push('`/admin config` - View configuration');
  }
  
  return commands.join('\n');
}

export const command: Command = {
  data,
  execute,
  permissionLevel: PermissionLevel.USER,
}; 