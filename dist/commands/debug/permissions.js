"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
const types_1 = require("../../types");
const discord_js_2 = require("discord.js");
const permissions_1 = require("../../services/permissions");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('debug')
    .setDescription('Debug commands')
    .addSubcommand(subcommand => subcommand
    .setName('permissions')
    .setDescription('Show your current permissions and role info'))
    .addSubcommand(subcommand => subcommand
    .setName('roles')
    .setDescription('List all roles with their IDs'));
const execute = async (interaction) => {
    try {
        await interaction.deferReply({ ephemeral: true });
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'permissions') {
            const member = interaction.member;
            if (!member || !('roles' in member)) {
                await interaction.editReply('This command can only be used in a server.');
                return;
            }
            const roleInfo = permissions_1.PermissionService.getRoleInfo(member);
            const embed = new discord_js_2.EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('🔐 Your Permission Information')
                .addFields({ name: '👤 User', value: `${roleInfo.username} (${roleInfo.userId})`, inline: false }, { name: '🎭 Roles', value: roleInfo.roles.join(', ') || 'No roles', inline: false }, { name: '🔑 Permission Level', value: roleInfo.permissionName, inline: true }, { name: '📊 Level Number', value: roleInfo.permissionLevel.toString(), inline: true })
                .addFields({ name: '📋 Available Commands', value: getAvailableCommands(roleInfo.permissionLevel), inline: false })
                .setTimestamp()
                .setFooter({ text: 'Bot Permission System' });
            await interaction.editReply({ embeds: [embed] });
        }
        else if (subcommand === 'roles') {
            const guild = interaction.guild;
            if (!guild) {
                await interaction.editReply('This command can only be used in a server.');
                return;
            }
            const roles = guild.roles.cache
                .sort((a, b) => b.position - a.position)
                .map(role => `**${role.name}**: \`${role.id}\``)
                .join('\n');
            const embed = new discord_js_2.EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('📋 Server Roles')
                .setDescription(roles || 'No roles found')
                .setTimestamp()
                .setFooter({ text: 'Copy these IDs to your .env file' });
            await interaction.editReply({ embeds: [embed] });
        }
    }
    catch (error) {
        console.error('Error in debug permissions command:', error);
        await interaction.editReply('An error occurred while checking permissions.');
    }
};
exports.execute = execute;
function getAvailableCommands(level) {
    const commands = [];
    // All users can use these
    commands.push('`/help` - Show help');
    commands.push('`/faucet request` - Request tokens');
    if (level >= types_1.PermissionLevel.MODERATOR) {
        commands.push('`/admin analytics` - View statistics');
    }
    if (level >= types_1.PermissionLevel.ADMIN) {
        commands.push('`/admin config` - View configuration');
    }
    return commands.join('\n');
}
exports.command = {
    data: exports.data,
    execute: exports.execute,
    permissionLevel: types_1.PermissionLevel.USER,
};
//# sourceMappingURL=permissions.js.map