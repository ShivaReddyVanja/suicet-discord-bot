"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedService = void 0;
const discord_js_1 = require("discord.js");
class EmbedService {
    // Success embed for successful token requests
    static createSuccessEmbed(response, walletAddress) {
        return new discord_js_1.EmbedBuilder()
            .setColor(0x00ff00) // Green
            .setTitle('✅ SUI Tokens Sent Successfully!')
            .setDescription('Your testnet SUI tokens have been sent to your wallet.')
            .addFields({ name: '💰 Amount', value: '0.01 SUI', inline: true }, { name: '🔗 Transaction', value: `[View on Explorer](https://suiexplorer.com/txblock/${response.tx})`, inline: true }, { name: '👛 Wallet Address', value: `\`${walletAddress}\``, inline: false })
            .setTimestamp()
            .setFooter({ text: 'Sui Testnet Faucet' });
    }
    // Error embed for failed requests
    static createErrorEmbed(error, walletAddress) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xff0000) // Red
            .setTitle('❌ Request Failed')
            .setDescription(error)
            .setTimestamp()
            .setFooter({ text: 'Sui Testnet Faucet' });
        if (walletAddress) {
            embed.addFields({ name: '👛 Wallet Address', value: `\`${walletAddress}\``, inline: false });
        }
        return embed;
    }
    // Rate limit embed
    static createRateLimitEmbed(remainingTime) {
        return new discord_js_1.EmbedBuilder()
            .setColor(0xffa500) // Orange
            .setTitle('⏰ Rate Limited')
            .setDescription(`You've reached the rate limit. Please wait ${Math.ceil(remainingTime / 60)} minutes before trying again.`)
            .setTimestamp()
            .setFooter({ text: 'Sui Testnet Faucet' });
    }
    // Analytics embed for admin commands
    static createAnalyticsEmbed(analytics) {
        const successRate = analytics.totals.requests > 0
            ? ((analytics.totals.success / analytics.totals.requests) * 100).toFixed(1)
            : '0';
        return new discord_js_1.EmbedBuilder()
            .setColor(0x9b59b6) // Purple
            .setTitle('📊 Faucet Analytics')
            .setDescription('Current statistics for the Sui testnet faucet.')
            .addFields({ name: '📈 Total Requests', value: analytics.totals.requests.toString(), inline: true }, { name: '✅ Successful', value: analytics.totals.success.toString(), inline: true }, { name: '❌ Failed', value: analytics.totals.failed.toString(), inline: true }, { name: '💰 Tokens Dispensed', value: `${(analytics.totals.tokensDispensed / 1e9).toFixed(2)} SUI`, inline: true }, { name: '📊 Success Rate', value: `${successRate}%`, inline: true }, { name: '⏰ Last Updated', value: new Date().toLocaleString(), inline: true })
            .setTimestamp()
            .setFooter({ text: 'Sui Testnet Faucet' });
    }
    // Config embed for admin commands
    static createConfigEmbed(config) {
        return new discord_js_1.EmbedBuilder()
            .setColor(0x3498db) // Blue
            .setTitle('⚙️ Faucet Configuration')
            .setDescription('Current faucet settings and status.')
            .addFields({ name: '💰 Available Balance', value: `${config.availableBalance.toFixed(2)} SUI`, inline: true }, { name: '🎁 Amount per Request', value: `${config.faucetAmount} SUI`, inline: true }, { name: '⏱️ Cooldown Period', value: `${config.cooldownSeconds} seconds`, inline: true }, { name: '🔄 Max Requests per Wallet', value: config.maxRequestsPerWallet.toString(), inline: true }, { name: '🌐 Max Requests per IP', value: config.maxRequestsPerIp.toString(), inline: true }, { name: '🟢 Status', value: config.enabled ? '🟢 Enabled' : '🔴 Disabled', inline: true })
            .setTimestamp()
            .setFooter({ text: 'Sui Testnet Faucet' });
    }
    // Help embed
    static createHelpEmbed() {
        return new discord_js_1.EmbedBuilder()
            .setColor(0x3498db) // Blue
            .setTitle('🤖 Sui Faucet Bot Help')
            .setDescription('Here are the available commands:')
            .addFields({
            name: '🎁 Request Tokens',
            value: '`/faucet request <wallet_address>` - Request 0.01 SUI testnet tokens',
            inline: false
        }, {
            name: '📊 Check Status',
            value: '`/faucet status <wallet_address>` - Check your request status',
            inline: false
        }, {
            name: '❓ Get Help',
            value: '`/help` - Show this help message',
            inline: false
        })
            .addFields({
            name: '🔧 Admin Commands',
            value: 'Available to moderators and admins only',
            inline: false
        }, {
            name: '📈 Analytics',
            value: '`/admin analytics` - View faucet statistics',
            inline: false
        }, {
            name: '⚙️ Configuration',
            value: '`/admin config` - View faucet settings',
            inline: false
        })
            .setTimestamp()
            .setFooter({ text: 'Sui Testnet Faucet' });
    }
    // Info embed for general information
    static createInfoEmbed() {
        return new discord_js_1.EmbedBuilder()
            .setColor(0x3498db) // Blue
            .setTitle('ℹ️ About Sui Testnet Faucet')
            .setDescription('Get free SUI tokens for testing on the Sui testnet.')
            .addFields({ name: '🎁 What you get', value: '0.01 SUI testnet tokens per request', inline: true }, { name: '⏱️ Cooldown', value: '15 minutes between requests', inline: true }, { name: '🌐 Network', value: 'Sui Testnet', inline: true }, { name: '🔗 Explorer', value: '[Sui Explorer](https://suiexplorer.com)', inline: true }, { name: '📚 Documentation', value: '[Sui Docs](https://docs.sui.io)', inline: true }, { name: '💬 Support', value: 'Join our Discord for help!', inline: true })
            .setTimestamp()
            .setFooter({ text: 'Sui Testnet Faucet' });
    }
}
exports.EmbedService = EmbedService;
//# sourceMappingURL=embeds.js.map