# 🔐 Discord Bot Secret Setup Guide

## 🎯 **Secure Bot Identification**

The Discord bot now uses a **cryptographically secure secret** to identify itself to the server. This prevents unauthorized access and ensures only your legitimate bot can make admin requests.

### **🔧 How It Works:**

1. **Generate Secret**: Create a secure random secret
2. **Server Setup**: Add secret to server environment
3. **Bot Setup**: Add same secret to bot environment
4. **Secure Communication**: Bot sends secret with every request

### **🚀 Setup Steps:**

#### **Step 1: Generate Bot Secret**

```bash
# Generate a secure 32-byte hex secret
openssl rand -hex 32

# Example output: a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

#### **Step 2: Server Environment**

Add to your server's `.env` file:

```env
# Discord Bot Secret (for secure identification)
DISCORD_BOT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

#### **Step 3: Bot Environment**

Add to your Discord bot's `.env` file:

```env
# Bot Secret for secure server communication
DISCORD_BOT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

#### **Step 4: Restart Services**

```bash
# Restart server
cd server && npm run dev

# Restart Discord bot
cd discord-bot && npm run dev
```

### **🔒 Security Features:**

#### **Bot Secret Verification:**
- ✅ **Cryptographic**: 32-byte random hex string
- ✅ **Unique**: Each deployment has different secret
- ✅ **Secure**: Impossible to guess or brute force
- ✅ **Required**: Bot won't work without secret

#### **Header Verification:**
- ✅ **User-Agent**: Must contain "Discord-Bot"
- ✅ **Secret Header**: Must match server's secret
- ✅ **Both Required**: User-Agent AND secret must be correct

### **📋 Request Headers:**

The bot sends these headers with every admin request:

```http
User-Agent: Discord-Bot/1.0
X-Discord-Bot-Secret: a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

### **🛡️ Security Benefits:**

1. **No Spoofing**: Impossible to fake bot requests
2. **Secret Required**: No secret = no access
3. **Unique Per Deployment**: Each server has different secret
4. **Cryptographic**: Mathematically secure
5. **Header Validation**: Multiple layers of verification

### **⚠️ Important Notes:**

- **Keep Secret Secure**: Never commit to version control
- **Same Secret**: Bot and server must use identical secret
- **Unique Per Environment**: Use different secrets for dev/prod
- **Backup Secret**: Store securely for recovery

### **🔧 Troubleshooting:**

#### **"DISCORD_BOT_SECRET not found" Error:**
- Check both server and bot `.env` files
- Ensure secret is exactly the same in both
- Restart both services after adding secret

#### **"Access token required" Error:**
- Verify bot secret matches server secret
- Check User-Agent header contains "Discord-Bot"
- Ensure both headers are present

#### **"Authentication failed" Error:**
- Regenerate secret and update both environments
- Clear any cached configurations
- Restart both services

### **🎯 Testing:**

#### **Test Bot Secret:**
```bash
# Test with curl (replace with your secret)
curl -H "User-Agent: Discord-Bot/1.0" \
     -H "X-Discord-Bot-Secret: your_secret_here" \
     http://localhost:3001/api/admin/config
```

#### **Test Invalid Secret:**
```bash
# This should fail
curl -H "User-Agent: Discord-Bot/1.0" \
     -H "X-Discord-Bot-Secret: wrong_secret" \
     http://localhost:3001/api/admin/config
```

### **🎉 That's It!**

Your Discord bot now has **cryptographically secure identification** with the server! 🔐 