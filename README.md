# 🤖 Sui Faucet Discord Bot

A Discord bot that provides access to the Sui testnet faucet through slash commands with role-based access control.

## 🚀 Features

- **Slash Commands**: Easy-to-use Discord slash commands
- **Rich Embeds**: Beautiful, informative responses
- **Role-Based Access**: Different permission levels for users, moderators, and admins
- **Rate Limiting**: Built-in protection against spam
- **Analytics**: Admin tools for monitoring faucet usage
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **Discord Bot Token** (from Discord Developer Portal)
3. **Discord Server** (Guild) where the bot will be deployed
4. **Sui Faucet Backend** (running on port 5001)

## 🛠️ Setup

### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and create a bot
4. Copy the bot token
5. Go to "OAuth2" → "URL Generator"
6. Select scopes: `bot`, `applications.commands`
7. Select bot permissions: `Send Messages`, `Use Slash Commands`, `Embed Links`
8. Use the generated URL to invite the bot to your server

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_GUILD_ID=your_discord_guild_id_here

# Backend API Configuration
API_BASE_URL=http://localhost:5001/api

# Bot Configuration
BOT_PREFIX=!
LOG_LEVEL=info

# Role IDs for permissions (optional - will be set up later)
MODERATOR_ROLE_ID=
ADMIN_ROLE_ID=
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Build the Project

```bash
npm run build
```

### 5. Deploy Commands

```bash
npm run deploy-commands
```

### 6. Start the Bot

```bash
npm start
```

## 🎮 Commands

### User Commands

- `/help` - Show help information
- `/faucet request <wallet_address>` - Request SUI tokens (coming soon)
- `/faucet status <wallet_address>` - Check request status (coming soon)

### Admin Commands

- `/admin analytics` - View faucet analytics (coming soon)
- `/admin config` - View faucet configuration (coming soon)

## 🔐 Permission Levels

- **User**: Can request tokens and view basic information
- **Moderator**: Can view analytics and manage users
- **Admin**: Full access to all commands and configuration

## 🏗️ Project Structure

```
discord-bot/
├── src/
│   ├── commands/
│   │   ├── faucet/     # Faucet-related commands
│   │   ├── admin/      # Admin commands
│   │   └── general/    # General commands
│   ├── services/
│   │   ├── api.ts      # Backend API communication
│   │   ├── embeds.ts   # Rich embed creation
│   │   └── permissions.ts # Role-based access control
│   ├── types/
│   │   └── index.ts    # TypeScript type definitions
│   ├── utils/
│   │   └── logger.ts   # Logging utility
│   ├── index.ts        # Main bot file
│   └── deploy-commands.ts # Command deployment script
├── logs/               # Log files
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

## 📊 Logging

The bot uses Winston for logging. Logs are stored in the `logs/` directory:

- `combined.log` - All logs
- `error.log` - Error logs only

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_TOKEN` | Discord bot token | Yes |
| `DISCORD_CLIENT_ID` | Discord application client ID | Yes |
| `DISCORD_GUILD_ID` | Discord server (guild) ID | Yes |
| `API_BASE_URL` | Backend API URL | Yes |
| `LOG_LEVEL` | Logging level (debug, info, warn, error) | No |
| `MODERATOR_ROLE_ID` | Discord role ID for moderators | No |
| `ADMIN_ROLE_ID` | Discord role ID for admins | No |

## 🐛 Troubleshooting

### Common Issues

1. **Bot not responding**: Check if the bot token is correct and the bot has proper permissions
2. **Commands not showing**: Run the deploy-commands script and ensure the bot has the `applications.commands` scope
3. **API errors**: Verify the backend is running and the API_BASE_URL is correct
4. **Permission errors**: Check role IDs and ensure the bot has proper permissions in the server

### Debug Mode

Set `LOG_LEVEL=debug` in your `.env` file for detailed logging.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details. # suicet-discord-bot
