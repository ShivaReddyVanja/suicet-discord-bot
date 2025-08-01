"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const permissions_1 = require("./services/permissions");
const logger_1 = __importDefault(require("./utils/logger"));
// Load environment variables
(0, dotenv_1.config)();
// Create Discord client
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
// Command collection
const commands = new discord_js_1.Collection();
// Load commands
async function loadCommands() {
    const commandsPath = path_1.default.join(__dirname, 'commands');
    const commandFolders = fs_1.default.readdirSync(commandsPath);
    for (const folder of commandFolders) {
        const folderPath = path_1.default.join(commandsPath, folder);
        const commandFiles = fs_1.default.readdirSync(folderPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path_1.default.join(folderPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.set(command.data.name, command);
                logger_1.default.info(`Loaded command: ${command.data.name}`);
            }
            else {
                logger_1.default.warn(`Command at ${filePath} is missing required "data" or "execute" property.`);
            }
        }
    }
}
// Bot ready event
client.once(discord_js_1.Events.ClientReady, () => {
    logger_1.default.info(`Bot is ready! Logged in as ${client.user?.tag}`);
    // Validate role IDs
    permissions_1.PermissionService.validateRoleIds();
});
// Interaction create event (for slash commands)
client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    const command = commands.get(interaction.commandName);
    if (!command) {
        logger_1.default.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        // Check permissions - only for admin commands
        if (command.permissionLevel > 0 && interaction.member && 'roles' in interaction.member) {
            const member = interaction.member;
            const hasPermission = permissions_1.PermissionService.hasPermission(member, command.permissionLevel);
            if (!hasPermission) {
                const errorEmbed = {
                    color: 0xff0000,
                    title: '❌ Permission Denied',
                    description: `You need ${permissions_1.PermissionService.getPermissionLevelName(command.permissionLevel)} permissions to use this command.`,
                    timestamp: new Date().toISOString(),
                };
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                return;
            }
        }
        // Execute command
        await command.execute(interaction);
    }
    catch (error) {
        logger_1.default.error(`Error executing command ${interaction.commandName}:`, error);
        const errorMessage = 'There was an error while executing this command!';
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        }
        else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
});
// Error handling
client.on('error', (error) => {
    logger_1.default.error('Discord client error:', error);
});
process.on('unhandledRejection', (error) => {
    logger_1.default.error('Unhandled promise rejection:', error);
});
process.on('uncaughtException', (error) => {
    logger_1.default.error('Uncaught exception:', error);
    process.exit(1);
});
// Login to Discord
async function startBot() {
    try {
        await loadCommands();
        await client.login(process.env.DISCORD_TOKEN);
    }
    catch (error) {
        logger_1.default.error('Failed to start bot:', error);
        process.exit(1);
    }
}
// Start the bot
startBot();
//# sourceMappingURL=index.js.map