import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Command } from './types';
import { PermissionService } from './services/permissions';
import logger from './utils/logger';

// Load environment variables
config();

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// Command collection
const commands = new Collection<string, Command>();

// Load commands
async function loadCommands() {
  const commandsPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);

      if ('data' in command && 'execute' in command) {
        commands.set(command.data.name, command);
        logger.info(`Loaded command: ${command.data.name}`);
      } else {
        logger.warn(`Command at ${filePath} is missing required "data" or "execute" property.`);
      }
    }
  }
}

// Bot ready event
client.once(Events.ClientReady, () => {
  logger.info(`Bot is ready! Logged in as ${client.user?.tag}`);
  
  // Validate role IDs
  PermissionService.validateRoleIds();
});

// Interaction create event (for slash commands)
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) {
    logger.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    // Check permissions - only for admin commands
    if (command.permissionLevel > 0 && interaction.member && 'roles' in interaction.member) {
      const member = interaction.member as any;
      const hasPermission = PermissionService.hasPermission(member, command.permissionLevel);
      
      if (!hasPermission) {
        const errorEmbed = {
          color: 0xff0000,
          title: '❌ Permission Denied',
          description: `You need ${PermissionService.getPermissionLevelName(command.permissionLevel)} permissions to use this command.`,
          timestamp: new Date().toISOString(),
        };
        
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        return;
      }
    }

    // Execute command
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Error executing command ${interaction.commandName}:`, error);
    
    const errorMessage = 'There was an error while executing this command!';
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

// Error handling
client.on('error', (error) => {
  logger.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

// Login to Discord
async function startBot() {
  try {
    await loadCommands();
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

// Start the bot
startBot(); 