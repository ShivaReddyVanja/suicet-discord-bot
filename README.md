

# Lets write a markdown documentation for my discord bot

First we will tell its setup and custom deployment

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and create a bot
4. Copy the bot token
5)Go to installation section,

then set the permissions and scopes
user install:
scopes:application.commands
guild install:
scopes: application.commands, bot
permissions:attach files, read message history,send messages,use slash commands,embed links

then u will have install link, take that link and go to it, you can add it to you account or guild

env setup

# Discord Bot Configuration

DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here

DISCORD_BOT_SECRET="This secret is a 64 bit hex string which is used on server to validate requests from the bot"

# Backend API Configuration

API_BASE_URL=http://localhost:5001/api \#replace wth actual api endpoint

# Bot Configuration

BOT_PREFIX=!
LOG_LEVEL=info

# Role IDs for permissions (Method 1: Discord Server Roles)

# Get these IDs using /debug roles command or Developer Mode

MODERATOR_ROLE_ID=""
ADMIN_ROLE_ID=""

# User IDs for permissions (Method 2: Direct User Assignment)

# Get user IDs by right-clicking users with Developer Mode enabled

# Separate multiple IDs with commas: ADMIN_USER_IDS=123456789,987654321

MODERATOR_USER_IDS="optional"
ADMIN_USER_IDS="optional"

# Bot Secret for secure server communication

# Generate with: openssl rand -hex 32

# This secret must match the server's DISCORD_BOT_SECRET



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
- `/faucet request <wallet_address>` - Request SUI tokens
- `/faucet status <wallet_address>` - Check request status (coming soon)


### Admin Commands

- `/admin analytics` - View faucet analytics (coming soon)
- `/admin config` - View faucet configuration (coming soon)
-/admin config update -Update config values


## 🔐 Permission Levels

- **User**: Can request tokens and view basic information
- **Admin**: Full access to all commands and configuration

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



Here's the complete **production-grade Markdown documentation** for your SUI Faucet Discord Bot, structured using industry-standard documentation practices:

# 🎯 SUI Faucet Discord Bot

A **production-ready Discord bot** for distributing SUI testnet tokens with enterprise-grade rate limiting, role-based access control, and comprehensive error handling.

[
[
[

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🔧 Environment Configuration](#-environment-configuration)
- [📁 Project Structure](#-project-structure)
- [🎮 Commands](#-commands)
- [🔐 Permission System](#-permission-system)
- [📊 API Integration](#-api-integration)
- [🚀 Deployment](#-deployment)
- [📞 Support](#-support)


## ✨ Features

- **🪙 SUI Token Distribution**: Automated testnet token faucet with configurable amounts
- **⏱️ Smart Rate Limiting**: Per-server and per-user cooldown management
- **🛡️ Role-Based Access Control**: Flexible permission system with admin and user roles
- **📊 Rich Embeds**: Professional Discord embed messages with proper error handling
- **🔒 Secure API Communication**: Encrypted communication with backend services
- **📝 Comprehensive Logging**: Winston-powered logging with multiple log levels
- **🔄 Auto-Recovery**: PM2-ready with automatic restart capabilities
- **📊 Real-time Analytics**: Command usage and error tracking


## 🚀 Quick Start

### 1. Discord Application Setup

**Create Your Discord Application:**

1. Visit the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"** and provide a meaningful name
3. Navigate to the **"Bot"** section and click **"Create Bot"**
4. **Copy the Bot Token** (you'll need this for your environment variables)
5. Navigate to the **"Installation"** section

**Configure Installation Settings:**

**For User Install:**

- **Scopes**: `application.commands`

**For Guild Install:**

- **Scopes**: `application.commands`, `bot`
- **Bot Permissions**:
    - ✅ Attach Files
    - ✅ Read Message History
    - ✅ Send Messages
    - ✅ Use Slash Commands
    - ✅ Embed Links

**Generate Install Link:**
After configuring permissions, copy the generated installation link and use it to add the bot to your Discord account or server.

### 2. Clone and Install

```bash
git clone <your-repository-url>
cd discord-bot
npm install
```


### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```


### 4. Build and Deploy

```bash
# Build the TypeScript project
npm run build

# Deploy slash commands to Discord
npm run deploy-commands

# Start the bot
npm start
```


## 🔧 Environment Configuration

### Discord Bot Configuration

```bash
# Discord Bot Authentication
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_BOT_SECRET="64-bit hex string for server request validation"
```

**How to get these values:**

- **DISCORD_TOKEN**: Bot section → Token → Copy
- **DISCORD_CLIENT_ID**: General Information → Application ID
- **DISCORD_BOT_SECRET**: Generate with `openssl rand -hex 32`


### Backend API Configuration

```bash
# API Endpoint Configuration
API_BASE_URL=http://localhost:5001/api
# For production: API_BASE_URL=https://your-api-domain.com/api
```

**Environment-Specific URLs:**

- **Development**: `http://localhost:5001/api`
- **Staging**: `https://staging-api.yourproject.com/api`
- **Production**: `https://api.yourproject.com/api`


### Bot Operational Settings

```bash
# Bot Behavior Configuration
BOT_PREFIX=!
LOG_LEVEL=info
```

**Log Levels Available:**

- `error` - Only error messages
- `warn` - Warnings and errors
- `info` - General information (recommended for production)
- `debug` - Detailed debugging information


### Permission System Configuration

**Method 1: Discord Server Roles (Recommended)**

```bash
# Role-based permissions using Discord role IDs
MODERATOR_ROLE_ID="123456789012345678"
ADMIN_ROLE_ID="987654321098765432"
```

**How to get Role IDs:**

1. Enable **Developer Mode** in Discord (User Settings → Advanced → Developer Mode)
2. Right-click on the role → **Copy ID**
3. Use `/debug roles` command (once bot is running) to list all server roles

**Method 2: Direct User Assignment**

```bash
# User-based permissions using Discord user IDs
MODERATOR_USER_IDS="123456789012345678,234567890123456789"
ADMIN_USER_IDS="345678901234567890,456789012345678901"
```

**How to get User IDs:**

1. Enable **Developer Mode** in Discord
2. Right-click on user → **Copy ID**
3. Separate multiple IDs with commas (no spaces)

### Security Configuration

```bash
# Server Communication Security
DISCORD_BOT_SECRET="a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
```

**Generate secure secret:**

```bash
openssl rand -hex 32
```

**Important**: This secret must match your backend server's `DISCORD_BOT_SECRET` configuration.

## 📁 Project Structure

```
discord-bot/
├── src/
│   ├── commands/
│   │   ├── faucet/              # Token distribution commands
│   │   │   └── request.ts       # Main faucet request command
│   │   ├── admin/               # Administrative commands
│   │   │   ├── analytics.ts     # Usage analytics
│   │   │   └── config.ts        # Configuration management
│   │   └── general/             # General utility commands
│   │       └── help.ts          # Help information
│   ├── services/
│   │   ├── api.ts              # Backend API communication layer
│   │   ├── embeds.ts           # Rich embed creation service
│   │   └── permissions.ts      # Role-based access control
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/
│   │   └── logger.ts           # Winston logging utility
│   ├── index.ts                # Main bot application
│   └── deploy-commands.ts      # Slash command deployment
├── logs/                       # Application log files
│   ├── error.log              # Error logs only
│   ├── combined.log           # All log levels
│   └── info.log               # Info and above
├── dist/                      # Compiled JavaScript output
├── package.json              # Node.js dependencies
├── tsconfig.json            # TypeScript configuration
├── .env                     # Environment variables (gitignored)
├── .env.example            # Environment template
└── README.md              # This documentation
```


## 🎮 Commands

### 👤 User Commands

| Command | Description | Usage | Permissions |
| :-- | :-- | :-- | :-- |
| `/help` | Display comprehensive help information and command list | `/help` | All Users |
| `/faucet request` | Request SUI testnet tokens for specified wallet | `/faucet request <wallet_address>` | All Users |
| `/faucet status` | Check request status and cooldown information | `/faucet status <wallet_address>` | All Users |

**Example Usage:**

```
/faucet request 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```


### 🔧 Admin Commands

| Command | Description | Usage | Permissions |
| :-- | :-- | :-- | :-- |
| `/admin analytics` | View detailed faucet usage analytics and statistics | `/admin analytics` | Admin Only |
| `/admin config` | View current faucet configuration settings | `/admin config` | Admin Only |
| `/admin config update` | Update faucet configuration values | `/admin config update <setting> <value>` | Admin Only |
| `/debug roles` | List all server roles with IDs (for setup) | `/debug roles` | Admin Only |

**Configuration Settings Available:**

- `token_amount` - Amount of SUI tokens per request
- `cooldown_hours` - Hours between requests per user
- `max_daily_requests` - Maximum requests per user per day


## 🔐 Permission System

### Permission Levels

**🟢 User Level**

- Access to faucet commands
- View help information
- Check request status
- Rate-limited token requests

**🔴 Admin Level**

- Full access to all user commands
- Configuration management
- Analytics and monitoring
- Debug utilities
- Override rate limits (if configured)


### Implementation Methods

**Method 1: Role-Based (Recommended for servers)**

- Configure `MODERATOR_ROLE_ID` and `ADMIN_ROLE_ID` in environment
- Automatically grants permissions to users with specified roles
- Dynamic - permissions update automatically when roles change

**Method 2: User-Based (Recommended for small teams)**

- Configure `MODERATOR_USER_IDS` and `ADMIN_USER_IDS` in environment
- Grants permissions to specific user IDs
- Static - requires environment update to change permissions

**Priority Order:**

1. User ID permissions (highest priority)
2. Role-based permissions
3. Default user permissions (lowest priority)

## 📊 API Integration

### Backend Communication

The bot communicates with your SUI faucet backend through a **RESTful API** with the following endpoints:

**Token Request Endpoint:**

```typescript
POST /faucet
Content-Type: application/json

{
  "walletAddress": "0x...",
  "userId": "discord_user_id"
}
```

**Response Formats:**

**Success Response:**

```json
{
  "status": "success",
  "message": "Tokens sent successfully",
  "tx": "transaction_hash_here"
}
```

**Rate Limited Response:**

```json
{
  "status": "error",
  "error": "Rate limit exceeded. Please try again later.",
  "retryAfter": 86400,
  "retryAt": "2025-08-02T16:31:46.104Z"
}
```


### Error Handling

The bot implements **enterprise-grade error handling** with:

- **Network timeout protection** (10-second timeout)
- **Retry logic** for temporary failures
- **Rate limit respect** with user-friendly countdown displays
- **Graceful degradation** for API unavailability
- **Structured logging** for debugging production issues


## 🚀 Deployment

### Development Mode

```bash
# Run with hot reload using tsx
npm run dev
```


### Production Deployment

**Option 1: Direct Node.js**

```bash
npm run build
npm start
```

**Option 2: PM2 Process Manager (Recommended)**

```bash
# Install PM2 globally
npm install -g pm2

# Start bot with PM2
pm2 start ts-node --name "sui-faucet-bot" --max-memory-restart 500M --time -- --transpile-only src/index.ts

# View logs
pm2 logs sui-faucet-bot

# Monitor status
pm2 status
```

**PM2 Management Commands:**

```bash
pm2 restart sui-faucet-bot    # Restart bot
pm2 stop sui-faucet-bot       # Stop bot  
pm2 delete sui-faucet-bot     # Remove from PM2
pm2 save                      # Save current processes
pm2 startup                   # Auto-start on system boot
```


### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```


## 📞 Support

### 🐛 Issues \& Bug Reports

**For deployment issues or bug reports:**

- **Email**: [shivareddyvanja@gmail.com](mailto:shivareddyvanja@gmail.com)
- **X (Twitter)**: [@shivareddyvanja](https://x.com/shivareddyvanja)


### 📋 Before Reporting Issues

Please include the following information:

1. **Environment**: Development/Staging/Production
2. **Node.js Version**: `node --version`
3. **Error Logs**: Relevant log entries from `/logs/` directory
4. **Steps to Reproduce**: Detailed reproduction steps
5. **Expected vs Actual Behavior**: Clear description of the issue

### 🔧 Common Issues

**Bot not responding to commands:**

1. Verify `DISCORD_TOKEN` is correct
2. Check bot has required permissions in the server
3. Ensure slash commands are deployed: `npm run deploy-commands`

**API connection errors:**

1. Verify `API_BASE_URL` is accessible
2. Check network connectivity
3. Validate API endpoint is running

**Permission errors:**

1. Verify role IDs are correct
2. Check user has required roles
3. Test with admin user IDs as fallback

### 📈 Monitoring \& Analytics

For production deployments, monitor:

- **Error Rate**: Check `/logs/error.log` for issues
- **Memory Usage**: PM2 restarts at 500MB by default
- **Response Times**: API call latencies
- **User Activity**: Command usage patterns

**Built with ❤️ using Node.js, TypeScript, and Discord.js**

*This documentation follows industry standards for enterprise Discord bot deployment and maintenance.*





## 📞 Support \& Contact

### 🐛 Issues \& Bug Reports

**For deployment issues, bug reports, or technical support:**

- **📧 Email**: [shivareddyvanja@gmail.com](mailto:shivareddyvanja@gmail.com)
- **🐦 X (Twitter)**: [@shivareddyvanja](https://x.com/shivareddyvanja)


### 📋 Before Reporting Issues

Please include the following information when contacting support:

1. **Environment**: Development/Staging/Production
2. **Node.js Version**: `node --version`
3. **Error Logs**: Relevant log entries from `/logs/` directory
4. **Steps to Reproduce**: Detailed reproduction steps
5. **Expected vs Actual Behavior**: Clear description of the issue

### 🔧 Response Time

- **Email**: Typically within 24-48 hours
- **X/Twitter**: For quick questions or updates


### 🤝 Community Support

Feel free to reach out for:

- ✅ Deployment assistance
- ✅ Configuration help
- ✅ Feature requests
- ✅ Bug reports
- ✅ Performance optimization
- ✅ Integration guidance

**We're here to help make your SUI Faucet Discord Bot deployment successful!**

*For urgent production issues, please use email with "URGENT" in the subject line.*
