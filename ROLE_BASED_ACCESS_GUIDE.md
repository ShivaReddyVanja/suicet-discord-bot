# 🔐 Role-Based Access Control Guide

## 🎯 **Simplified Admin Access**

The Discord bot now uses **role-based access control** instead of requiring login! This makes it much easier for admins to manage the faucet.

### **✅ What Changed:**

- ❌ **Removed**: `/admin login` command
- ❌ **Removed**: API key authentication requirement
- ✅ **Added**: Direct role-based access
- ✅ **Simplified**: No more token management

### **🔧 How It Works:**

1. **Discord Role Check**: Bot checks if user has admin role
2. **Direct Access**: If admin role → can use all admin commands
3. **No Login Required**: Just need the right Discord role

### **📋 Available Commands:**

| Command | Description | Access Level |
|---------|-------------|--------------|
| `/help` | Show help | Everyone |
| `/faucet request` | Request tokens | Everyone |
| `/admin analytics` | View statistics | **Admin Role** |
| `/admin config` | View settings | **Admin Role** |
| `/admin update-config` | Update settings | **Admin Role** |

### **🎯 Environment Setup:**

#### **Discord Bot (.env):**
```env
# Discord Bot Token
DISCORD_TOKEN=your_bot_token

# Discord Application ID
DISCORD_CLIENT_ID=your_client_id

# API Base URL
API_BASE_URL=http://localhost:3001/api

# Admin Role ID (get from Discord server)
ADMIN_ROLE_ID=1234567890123456789

# Optional: Direct user IDs (alternative method)
ADMIN_USER_IDS=123456789,987654321
```

#### **Server (.env):**
```env
# Discord API Keys (for backend authentication)
DISCORD_API_KEYS=your_api_key_here
```

### **🔍 How to Get Role IDs:**

1. **Enable Developer Mode** in Discord:
   - User Settings → Advanced → Developer Mode

2. **Right-click on role** → Copy ID

3. **Add to .env file**:
   ```env
   ADMIN_ROLE_ID=1234567890123456789
   ```

### **🚀 Usage Examples:**

#### **View Analytics:**
```
/admin analytics
```
*Shows faucet statistics (admin role required)*

#### **View Configuration:**
```
/admin config
```
*Shows current faucet settings (admin role required)*

#### **Update Configuration:**
```
/admin update-config cooldown_seconds:900
```
*Updates cooldown to 15 minutes (admin role required)*

#### **Emergency Disable:**
```
/admin update-config enabled:false
```
*Disables faucet immediately (admin role required)*

### **🔒 Security Features:**

- ✅ **Role-Based**: Only users with admin role can access
- ✅ **Server-Side**: Backend validates Discord roles
- ✅ **No Tokens**: No need to manage authentication tokens
- ✅ **Ephemeral**: All responses are private
- ✅ **Audit Trail**: All changes are logged

### **🎯 Benefits:**

1. **Simpler**: No login required
2. **Faster**: Direct access with Discord roles
3. **Secure**: Uses Discord's built-in role system
4. **Flexible**: Easy to add/remove admins via Discord
5. **Reliable**: No token expiration issues

### **⚠️ Important Notes:**

- **Admin Role Required**: Users must have the admin role in Discord
- **Server Permissions**: Bot needs to read member roles
- **Role ID Required**: Must set `ADMIN_ROLE_ID` in environment
- **Backend Access**: Server still needs `DISCORD_API_KEYS`

### **🔧 Troubleshooting:**

#### **"Permission Denied" Error:**
- Check if user has admin role in Discord
- Verify `ADMIN_ROLE_ID` is set correctly
- Ensure bot has permission to read roles

#### **"Role ID Not Found" Error:**
- Enable Developer Mode in Discord
- Right-click role → Copy ID
- Update `.env` file with correct ID

#### **"Bot Can't Read Roles" Error:**
- Check bot permissions in Discord
- Ensure bot has "Manage Roles" permission
- Verify bot is in the correct server

### **🎉 That's It!**

Discord admins can now manage the faucet directly through Discord roles - no login required! 🚀 