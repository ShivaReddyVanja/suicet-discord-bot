"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("./utils/logger"));
// Load environment variables
(0, dotenv_1.config)();
const commands = [];
const commandsPath = path_1.default.join(__dirname, 'commands');
const commandFolders = fs_1.default.readdirSync(commandsPath);
for (const folder of commandFolders) {
    const folderPath = path_1.default.join(commandsPath, folder);
    const commandFiles = fs_1.default.readdirSync(folderPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path_1.default.join(folderPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            logger_1.default.info(`Prepared command: ${command.data.name}`);
        }
        else {
            logger_1.default.warn(`Command at ${filePath} is missing required "data" or "execute" property.`);
        }
    }
}
// Construct and prepare an instance of the REST module
const rest = new discord_js_1.REST().setToken(process.env.DISCORD_TOKEN);
// Deploy commands
(async () => {
    try {
        logger_1.default.info(`Started refreshing ${commands.length} application (/) commands.`);
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), { body: commands });
        logger_1.default.info(`Successfully reloaded ${data.length} application (/) commands.`);
    }
    catch (error) {
        logger_1.default.error('Error deploying commands:', error);
    }
})();
//# sourceMappingURL=deploy-commands.js.map