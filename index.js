const {
  Client,
  GatewayIntentBits
} = require('discord.js');

const {
  joinVoiceChannel,
  getVoiceConnection
} = require('@discordjs/voice');

const http = require('http');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const TOKEN = process.env.TOKEN;
const PORT = process.env.PORT || 4000;
const PREFIX = "&";

client.once('ready', () => {
  console.log(`${client.user.tag} is online`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // JOIN VC
  if (command === 'join') {

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply('Join a voice channel first.');
    }

    try {

      joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfDeaf: false
      });

      message.reply('Joined the voice channel.');

    } catch (err) {
      console.error(err);
      message.reply('Failed to join VC.');
    }
  }

  // LEAVE VC
  if (command === 'leave') {

    const connection = getVoiceConnection(message.guild.id);

    if (!connection) {
      return message.reply('I am not in a VC.');
    }

    connection.destroy();

    message.reply('Left the voice channel.');
  }

});

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running.');
}).listen(PORT);

client.login(TOKEN);
