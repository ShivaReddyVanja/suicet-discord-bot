# 🔧 Discord Bot Config Update Guide

## 📋 **New `/admin update-config` Command**

The Discord bot now supports updating faucet configuration directly through Discord!

### **🎯 Available Configuration Options**

| Option | Type | Description | Example |
|--------|------|-------------|---------|
| `cooldown_seconds` | Integer | Cooldown period in seconds | `900` (15 minutes) |
| `faucet_amount` | Number | Amount of SUI per request | `0.01` |
| `max_requests_per_ip` | Integer | Max requests per IP address | `10` |
| `max_requests_per_wallet` | Integer | Max requests per wallet | `5` |
| `enabled` | Boolean | Enable/disable faucet | `true` or `false` |

### **🚀 How to Use**

#### **Basic Usage:**
```
/admin update-config
```

#### **Update Single Setting:**
```
/admin update-config cooldown_seconds:900
```

#### **Update Multiple Settings:**
```
/admin update-config cooldown_seconds:900 faucet_amount:0.02 enabled:true
```

#### **Disable Faucet:**
```
/admin update-config enabled:false
```

#### **Enable Faucet:**
```
/admin update-config enabled:true
```

### **✅ Examples**

#### **Example 1: Change Cooldown Period**
```
/admin update-config cooldown_seconds:1800
```
*Sets cooldown to 30 minutes*

#### **Example 2: Update Amount and Limits**
```
/admin update-config faucet_amount:0.02 max_requests_per_wallet:3
```
*Sets amount to 0.02 SUI and max 3 requests per wallet*

#### **Example 3: Emergency Disable**
```
/admin update-config enabled:false
```
*Disables the faucet immediately*

#### **Example 4: Full Configuration Update**
```
/admin update-config cooldown_seconds:900 faucet_amount:0.01 max_requests_per_ip:5 max_requests_per_wallet:3 enabled:true
```
*Updates all settings at once*

### **🔒 Security Features**

- ✅ **Authentication Required**: Must login with API key first
- ✅ **Admin Only**: Only Discord admins can update config
- ✅ **Long Session**: Tokens valid for 3 days
- ✅ **Validation**: Server validates all input values
- ✅ **Audit Trail**: All changes are logged
- ✅ **Ephemeral Responses**: Updates are private to the user

### **📊 Response Examples**

#### **Success Response:**
```
✅ Configuration Updated
Faucet configuration has been updated successfully.

Updated Fields: cooldown_seconds, faucet_amount, enabled
```

#### **Error Response:**
```
❌ Update Failed
Invalid value for cooldown_seconds. Must be a positive integer.
```

### **🎯 Complete Workflow**

1. **Login with API key** (valid for 3 days):
   ```
   /admin login api_key:your_api_key_here
   ```

2. **View current config**:
   ```
   /admin config
   ```

3. **Update configuration**:
   ```
   /admin update-config cooldown_seconds:900
   ```

4. **Verify changes**:
   ```
   /admin config
   ```

### **⚠️ Important Notes**

- **All fields are optional** - only provided fields will be updated
- **Server validation** - invalid values will be rejected
- **Immediate effect** - changes take effect immediately
- **No confirmation** - updates happen instantly
- **3-day sessions** - admin login tokens expire after 3 days
- **Backup recommended** - consider backing up config before major changes

### **🔧 Server Requirements**

The server must have:
- ✅ **Updated middleware** (`adminAuth.ts`)
- ✅ **Discord API keys** in environment
- ✅ **Config update endpoint** (`/admin/config/update`)
- ✅ **Proper validation** (`AdminConfigSchema`)

### **📝 Environment Variables**

Make sure your server has:
```env
DISCORD_API_KEYS=your_api_key_here
```

And your Discord bot has:
```env
ADMIN_API_KEYS=your_api_key_here
```

### **🎉 That's It!**

Discord admins can now fully manage the faucet configuration through Discord without needing to access the server directly! 