# 🤖 Discord Bot Invite Guide

## 🔗 **How to Invite Your Bot to Discord Servers**

### **📋 Prerequisites**

Before inviting your bot, make sure you have:

1. ✅ **Discord Application** created in [Discord Developer Portal](https://discord.com/developers/applications)
2. ✅ **Bot Token** copied from the Bot section
3. ✅ **Client ID** copied from the General Information section
4. ✅ **Bot permissions** configured properly

### **🎯 Method 1: Using Discord Developer Portal (Recommended)**

#### **Step 1: Go to OAuth2 URL Generator**

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your bot application
3. Click on **"OAuth2"** in the left sidebar
4. Click on **"URL Generator"**

#### **Step 2: Configure Scopes**

Select these scopes:
- ✅ **`bot`** - Allows the bot to join servers
- ✅ **`applications.commands`** - Allows slash commands to work

#### **Step 3: Configure Bot Permissions**

Select these permissions:

**Essential Permissions:**
- ✅ **Send Messages** - Bot can send messages
- ✅ **Use Slash Commands** - Bot can use slash commands
- ✅ **Embed Links** - Bot can send rich embeds
- ✅ **Attach Files** - Bot can send files if needed
- ✅ **Read Message History** - Bot can read previous messages

**Optional Permissions:**
- ✅ **Manage Messages** - Bot can delete messages (for moderation)
- ✅ **Add Reactions** - Bot can add reactions
- ✅ **Use External Emojis** - Bot can use custom emojis

#### **Step 4: Generate Invite Link**

1. Scroll down to see the generated URL
2. Copy the URL (it looks like: `https://discord.com/api/oauth2/authorize?client_id=...`)
3. Open the URL in your browser
4. Select your Discord server
5. Click "Authorize"

### **🎯 Method 2: Manual URL Construction**

If you prefer to construct the URL manually:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=PERMISSION_NUMBER&scope=bot%20applications.commands
```

**Replace:**
- `YOUR_CLIENT_ID` with your bot's client ID
- `PERMISSION_NUMBER` with the permission integer (see below)

**Common Permission Numbers:**
- **Basic**: `2048` (Send Messages, Use Slash Commands, Embed Links)
- **Moderator**: `8192` (Basic + Manage Messages)
- **Admin**: `8` (Administrator - use with caution)

### **🎯 Method 3: Using Bot Token (Alternative)**

If you have the bot token, you can also invite using:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2048&scope=bot%20applications.commands
```

### **🔧 Required Bot Permissions**

Your bot needs these permissions to function properly:

| Permission | Why Needed | Permission Bit |
|------------|------------|----------------|
| Send Messages | Send responses to commands | 2048 |
| Use Slash Commands | Execute slash commands | 2147483648 |
| Embed Links | Send rich embeds | 16384 |
| Read Message History | Read previous messages | 65536 |
| Attach Files | Send files if needed | 32768 |

**Total Permission Number: `2048 + 2147483648 + 16384 + 65536 + 32768 = 2181038592`**

### **📝 Complete Invite URL Example**

```
https://discord.com/api/oauth2/authorize?client_id=1234567890123456789&permissions=2181038592&scope=bot%20applications.commands
```

### **✅ Verification Steps**

After inviting the bot:

1. **Check Bot Status**: Bot should appear online in your server
2. **Test Slash Commands**: Try `/help` to see if commands work
3. **Check Permissions**: Ensure bot has proper permissions
4. **Deploy Commands**: Run `npm run deploy-commands` if needed

### **🔧 Troubleshooting**

#### **Bot Not Responding**
- ❌ Check if bot token is correct
- ❌ Verify bot is online
- ❌ Check bot permissions in server settings
- ❌ Ensure slash commands are deployed

#### **Commands Not Working**
- ❌ Run `npm run deploy-commands`
- ❌ Check bot has "Use Slash Commands" permission
- ❌ Verify bot is in the server

#### **Permission Errors**
- ❌ Check bot role position (should be above roles it manages)
- ❌ Verify bot has required permissions
- ❌ Check server settings for bot permissions

### **🌐 Multiple Servers**

You can invite the same bot to multiple servers using the same invite link. Each server will have its own:
- ✅ Command permissions
- ✅ Role-based access control
- ✅ Rate limiting
- ✅ Analytics

### **🔒 Security Notes**

- ✅ **Never share your bot token** publicly
- ✅ **Use minimal required permissions**
- ✅ **Regularly rotate bot tokens**
- ✅ **Monitor bot activity**

### **📞 Support**

If you encounter issues:

1. **Check bot logs** for error messages
2. **Verify environment variables** are set correctly
3. **Test in a private server** first
4. **Check Discord Developer Portal** for any warnings

---

**🎉 Your bot should now be successfully invited and ready to use!** 