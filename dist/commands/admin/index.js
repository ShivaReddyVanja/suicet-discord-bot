"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
const types_1 = require("../../types");
const embeds_1 = require("../../services/embeds");
const api_1 = __importDefault(require("../../services/api"));
const logger_1 = __importDefault(require("../../utils/logger"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('admin')
    .setDescription('Admin commands for faucet management')
    .addSubcommand(subcommand => subcommand
    .setName('analytics')
    .setDescription('View faucet statistics and analytics'))
    .addSubcommand(subcommand => subcommand
    .setName('config')
    .setDescription('View faucet configuration settings'))
    .addSubcommand(subcommand => subcommand
    .setName('update-config')
    .setDescription('Update faucet configuration settings')
    .addIntegerOption(option => option
    .setName('cooldown_seconds')
    .setDescription('Cooldown period in seconds (optional)')
    .setRequired(false))
    .addNumberOption(option => option
    .setName('faucet_amount')
    .setDescription('Amount of SUI per request (optional)')
    .setRequired(false))
    .addIntegerOption(option => option
    .setName('max_requests_per_ip')
    .setDescription('Maximum requests per IP (optional)')
    .setRequired(false))
    .addIntegerOption(option => option
    .setName('max_requests_per_wallet')
    .setDescription('Maximum requests per wallet (optional)')
    .setRequired(false))
    .addBooleanOption(option => option
    .setName('enabled')
    .setDescription('Enable/disable faucet (optional)')
    .setRequired(false)));
const execute = async (interaction) => {
    try {
        // Defer reply to give us time to process
        await interaction.deferReply({ ephemeral: true });
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case 'analytics':
                try {
                    const analytics = await api_1.default.getAnalytics();
                    const analyticsEmbed = embeds_1.EmbedService.createAnalyticsEmbed(analytics);
                    await interaction.editReply({ embeds: [analyticsEmbed] });
                }
                catch (error) {
                    logger_1.default.error('Error fetching analytics:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Unable to retrieve faucet analytics. Please try again later.';
                    const errorEmbed = embeds_1.EmbedService.createErrorEmbed('Failed to fetch analytics', errorMessage);
                    await interaction.editReply({ embeds: [errorEmbed] });
                }
                break;
            case 'config':
                try {
                    const config = await api_1.default.getConfig();
                    const configEmbed = embeds_1.EmbedService.createConfigEmbed(config.config);
                    await interaction.editReply({ embeds: [configEmbed] });
                }
                catch (error) {
                    logger_1.default.error('Error fetching config:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Unable to retrieve faucet configuration. Please try again later.';
                    const errorEmbed = embeds_1.EmbedService.createErrorEmbed('Failed to fetch configuration', errorMessage);
                    await interaction.editReply({ embeds: [errorEmbed] });
                }
                break;
            case 'update-config':
                try {
                    // Collect all provided options
                    const configData = {};
                    const cooldownSeconds = interaction.options.getInteger('cooldown_seconds');
                    if (cooldownSeconds !== null)
                        configData.cooldownSeconds = cooldownSeconds;
                    const faucetAmount = interaction.options.getNumber('faucet_amount');
                    if (faucetAmount !== null)
                        configData.faucetAmount = faucetAmount;
                    const maxRequestsPerIp = interaction.options.getInteger('max_requests_per_ip');
                    if (maxRequestsPerIp !== null)
                        configData.maxRequestsPerIp = maxRequestsPerIp;
                    const maxRequestsPerWallet = interaction.options.getInteger('max_requests_per_wallet');
                    if (maxRequestsPerWallet !== null)
                        configData.maxRequestsPerWallet = maxRequestsPerWallet;
                    const enabled = interaction.options.getBoolean('enabled');
                    if (enabled !== null)
                        configData.enabled = enabled;
                    // Check if any config data was provided
                    if (Object.keys(configData).length === 0) {
                        const errorEmbed = embeds_1.EmbedService.createErrorEmbed('No Configuration Provided', 'Please provide at least one configuration option to update.');
                        await interaction.editReply({ embeds: [errorEmbed] });
                        return;
                    }
                    // Update configuration
                    const result = await api_1.default.updateConfig(configData);
                    if (result.success) {
                        const successEmbed = new discord_js_1.EmbedBuilder()
                            .setColor(0x00ff00)
                            .setTitle('✅ Configuration Updated')
                            .setDescription('Faucet configuration has been updated successfully.')
                            .addFields({ name: 'Updated Fields', value: Object.keys(configData).join(', '), inline: false })
                            .setTimestamp()
                            .setFooter({ text: 'Sui Testnet Faucet' });
                        await interaction.editReply({ embeds: [successEmbed] });
                    }
                    else {
                        const errorEmbed = embeds_1.EmbedService.createErrorEmbed('Update Failed', result.error || 'Failed to update configuration.');
                        await interaction.editReply({ embeds: [errorEmbed] });
                    }
                }
                catch (error) {
                    logger_1.default.error('Error updating config:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Unable to update faucet configuration. Please try again later.';
                    const errorEmbed = embeds_1.EmbedService.createErrorEmbed('Failed to update configuration', errorMessage);
                    await interaction.editReply({ embeds: [errorEmbed] });
                }
                break;
            default:
                const errorEmbed = embeds_1.EmbedService.createErrorEmbed('Unknown Subcommand', `Unknown subcommand: ${subcommand}`);
                await interaction.editReply({ embeds: [errorEmbed] });
                break;
        }
    }
    catch (error) {
        logger_1.default.error('Error executing admin command:', error);
        const errorEmbed = embeds_1.EmbedService.createErrorEmbed('Command Error', 'An unexpected error occurred while processing your request.');
        if (interaction.deferred) {
            await interaction.editReply({ embeds: [errorEmbed] });
        }
        else {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
exports.execute = execute;
exports.command = {
    data: exports.data,
    execute: exports.execute,
    permissionLevel: types_1.PermissionLevel.ADMIN, // Only admins can access these commands
};
//# sourceMappingURL=index.js.map