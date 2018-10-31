const config = require(`../config.json`);
const Discord = require(`discord.js`);

exports.run = async (client, msg, args) => {
    embed = new Discord.RichEmbed()
        .setColor(config.embed.colors.main)
        .setDescription(`Ping: **${Math.floor(client.ping)}ms**`)
        .setTimestamp()
        .setFooter(config.embed.footer);
    msg.channel.send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  helpSection: 'normal'
};

exports.help = {
  name: `ping`,
  description: `Show the bot ping between me and discord.`,
  usage: `ping`
};
