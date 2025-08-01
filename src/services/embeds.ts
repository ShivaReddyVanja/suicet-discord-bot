import { EmbedBuilder, ColorResolvable } from 'discord.js';
import { FaucetResponse, AnalyticsResponse, ConfigResponse } from '../types';

export class EmbedService {
  // Success embed for successful token requests
  static createSuccessEmbed(response: FaucetResponse, walletAddress: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(0x00ff00 as ColorResolvable) // Green
      .setTitle('✅ SUI Tokens Sent Successfully!')
      .setDescription('Your testnet SUI tokens have been sent to your wallet.')
      .addFields(
        { name: '💰 Amount', value: '0.01 SUI', inline: true },
        { name: '🔗 Transaction', value: `[View on Explorer](https://suiexplorer.com/txblock/${response.tx})`, inline: true },
        { name: '👛 Wallet Address', value: `\`${walletAddress}\``, inline: false }
      )
      .setTimestamp()
      .setFooter({ text: 'Sui Testnet Faucet' });
  }

  // Error embed for failed requests
  static createErrorEmbed(error: string, walletAddress?: string): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor(0xff0000 as ColorResolvable) // Red
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
  static createRateLimitEmbed(remainingTime: number): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(0xffa500 as ColorResolvable) // Orange
      .setTitle('⏰ Rate Limited')
      .setDescription(`You've reached the rate limit. Please wait ${Math.ceil(remainingTime / 60)} minutes before trying again.`)
      .setTimestamp()
      .setFooter({ text: 'Sui Testnet Faucet' });
  }

  // Analytics embed for admin commands
  static createAnalyticsEmbed(analytics: AnalyticsResponse): EmbedBuilder {
    const successRate = analytics.totals.requests > 0 
      ? ((analytics.totals.success / analytics.totals.requests) * 100).toFixed(1)
      : '0';

    return new EmbedBuilder()
      .setColor(0x9b59b6 as ColorResolvable) // Purple
      .setTitle('📊 Faucet Analytics')
      .setDescription('Current statistics for the Sui testnet faucet.')
      .addFields(
        { name: '📈 Total Requests', value: analytics.totals.requests.toString(), inline: true },
        { name: '✅ Successful', value: analytics.totals.success.toString(), inline: true },
        { name: '❌ Failed', value: analytics.totals.failed.toString(), inline: true },
        { name: '💰 Tokens Dispensed', value: `${(analytics.totals.tokensDispensed / 1e9).toFixed(2)} SUI`, inline: true },
        { name: '📊 Success Rate', value: `${successRate}%`, inline: true },
        { name: '⏰ Last Updated', value: new Date().toLocaleString(), inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Sui Testnet Faucet' });
  }

  // Config embed for admin commands
  static createConfigEmbed(config: ConfigResponse['config']): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(0x3498db as ColorResolvable) // Blue
      .setTitle('⚙️ Faucet Configuration')
      .setDescription('Current faucet settings and status.')
      .addFields(
        { name: '💰 Available Balance', value: `${config.availableBalance.toFixed(2)} SUI`, inline: true },
        { name: '🎁 Amount per Request', value: `${config.faucetAmount} SUI`, inline: true },
        { name: '⏱️ Cooldown Period', value: `${config.cooldownSeconds} seconds`, inline: true },
        { name: '🔄 Max Requests per Wallet', value: config.maxRequestsPerWallet.toString(), inline: true },
        { name: '🌐 Max Requests per IP', value: config.maxRequestsPerIp.toString(), inline: true },
        { name: '🟢 Status', value: config.enabled ? '🟢 Enabled' : '🔴 Disabled', inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Sui Testnet Faucet' });
  }

  // Help embed
  static createHelpEmbed(): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(0x3498db as ColorResolvable) // Blue
      .setTitle('🤖 Sui Faucet Bot Help')
      .setDescription('Here are the available commands:')
      .addFields(
        { 
          name: '🎁 Request Tokens', 
          value: '`/faucet request <wallet_address>` - Request 0.01 SUI testnet tokens\nExample: `/faucet request 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`', 
          inline: false 
        },
        { 
          name: '📊 Check Status', 
          value: '`/faucet status <wallet_address>` - Check your request status (coming soon)', 
          inline: false 
        },
        { 
          name: '❓ Get Help', 
          value: '`/help` - Show this help message', 
          inline: false 
        }
      )
      .addFields(
        { 
          name: '🔧 Admin Commands', 
          value: 'Available to moderators and admins only (role-based access)', 
          inline: false 
        },
        { 
          name: '📈 Analytics', 
          value: '`/admin analytics` - View faucet statistics', 
          inline: false 
        },
        { 
          name: '⚙️ Configuration', 
          value: '`/admin config` - View faucet settings', 
          inline: false 
        },
        { 
          name: '🔧 Update Configuration', 
          value: '`/admin update-config` - Update faucet settings', 
          inline: false 
        }
      )
      .setTimestamp()
      .setFooter({ text: 'Sui Testnet Faucet' });
  }

  // Info embed for general information
  static createInfoEmbed(): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(0x3498db as ColorResolvable) // Blue
      .setTitle('ℹ️ About Sui Testnet Faucet')
      .setDescription('Get free SUI tokens for testing on the Sui testnet.')
      .addFields(
        { name: '🎁 What you get', value: '0.01 SUI testnet tokens per request', inline: true },
        { name: '⏱️ Cooldown', value: '15 minutes between requests', inline: true },
        { name: '🌐 Network', value: 'Sui Testnet', inline: true },
        { name: '🔗 Explorer', value: '[Sui Explorer](https://suiexplorer.com)', inline: true },
        { name: '📚 Documentation', value: '[Sui Docs](https://docs.sui.io)', inline: true },
        { name: '💬 Support', value: 'Join our Discord for help!', inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Sui Testnet Faucet' });
  }
} 