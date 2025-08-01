"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
const types_1 = require("../../types");
const embeds_1 = require("../../services/embeds");
const logger_1 = __importDefault(require("../../utils/logger"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('help')
    .setDescription('Show help information about the Sui Faucet bot');
const execute = async (interaction) => {
    try {
        // Defer the reply to give us time to process
        await interaction.deferReply({ ephemeral: true });
        // Create help embed
        const embed = embeds_1.EmbedService.createHelpEmbed();
        // Send the response
        await interaction.editReply({ embeds: [embed] });
        logger_1.default.info(`Help command executed by ${interaction.user.username} (${interaction.user.id})`);
    }
    catch (error) {
        logger_1.default.error('Error executing help command:', error);
        // Try to send error message
        try {
            const errorEmbed = embeds_1.EmbedService.createErrorEmbed('Failed to show help information. Please try again.');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
        catch (replyError) {
            logger_1.default.error('Failed to send error message:', replyError);
        }
    }
};
exports.execute = execute;
exports.command = {
    data: exports.data,
    execute: exports.execute,
    permissionLevel: types_1.PermissionLevel.USER,
};
//# sourceMappingURL=help.js.map