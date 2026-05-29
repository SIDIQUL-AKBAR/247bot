const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

const TOKEN = process.env.TOKEN;
const PREFIX = "&";

client.once('ready', async () => {
  console.log(`${client.user.tag} is online!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // JOIN COMMAND
  if (command === 'join') {
    if (!message.member.voice.channel) {
      return message.reply('Join a VC first.');
    }

    const channel = message.member.voice.channel;

    try {
      await channel.join();
      message.reply('Joined the VC.');
    } catch (err) {
      console.error(err);
      message.reply('Failed to join VC.');
    }
  }

  // LEAVE COMMAND
  if (command === 'leave') {
    const connection = message.guild.members.me.voice.channel;

    if (!connection) {
      return message.reply('I am not in VC.');
    }

    try {
      connection.leave();
      message.reply('Left the VC.');
    } catch (err) {
      console.error(err);
      message.reply('Failed to leave VC.');
    }
  }
});

client.login(TOKEN);
