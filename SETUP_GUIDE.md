# 🚀 Discord Bot Setup Guide

## 📋 **Simple API Key Authentication**

The Discord bot now uses a **much simpler authentication system** that doesn't require complex wallet signatures!

### **🔑 How to Set Up API Keys**

#### **Step 1: Generate API Keys**
Generate secure API keys for your admins:

```bash
# Generate a secure API key
openssl rand -hex 32
# Example output: a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

#### **Step 2: Add to Environment**
Add the API keys to your `.env` file:

```env
# API Keys for simple authentication
ADMIN_API_KEYS=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456,another_key_here
```

#### **Step 3: Share with Admins**
Share the API keys with your Discord admins securely (DM, encrypted message, etc.)

### **🎯 How Users Login**

#### **Simple Login Process:**
1. **Admin gets API key** from you
2. **Uses command**: `/admin login api_key:your_api_key_here`
3. **Gets access** to analytics and config for 24 hours

#### **Example:**
```
/admin login api_key:a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

### **✅ Available Commands**

| Command | Description | Authentication |
|---------|-------------|----------------|
| `/help` | Show help | ❌ None |
| `/faucet request` | Request tokens | ❌ None |
| `/admin login` | Login with API key | ❌ None (needs admin role) |
| `/admin analytics` | View statistics | ✅ API key |
| `/admin config` | View settings | ✅ API key |
| `/debug permissions` | Check permissions | ❌ None |

### **🔒 Security Features**

- ✅ **API Key Authentication**: Simple and secure
- ✅ **24-Hour Sessions**: Tokens expire automatically
- ✅ **Role-Based Access**: Only Discord admins can login
- ✅ **Ephemeral Messages**: All responses are private
- ✅ **No Wallet Required**: No complex signature process

### **🧪 Testing**

1. **Generate an API key**:
   ```bash
   openssl rand -hex 32
   ```

2. **Add to your `.env` file**:
   ```env
   ADMIN_API_KEYS=your_generated_key_here
   ```

3. **Restart the bot**:
   ```bash
   npm run dev
   ```

4. **Test in Discord**:
   ```
   /admin login api_key:your_generated_key_here
   ```

### **📝 Example .env File**

```env
# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_GUILD_ID=your_discord_guild_id_here

# Backend API Configuration
API_BASE_URL=https://api.suicet.xyz/api

# Bot Configuration
BOT_PREFIX=!
LOG_LEVEL=info

# Role IDs for permissions
MODERATOR_ROLE_ID=1234567890123456789
ADMIN_ROLE_ID=9876543210987654321

# API Keys for simple authentication
ADMIN_API_KEYS=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

### **🎉 That's It!**

Much simpler than the complex wallet signature process. Users just need an API key to access admin features! 