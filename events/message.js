const Discord = require(`discord.js`);
const config = require("../config.json");

module.exports = async (client, msg) => {
  if (!msg.guild) return;
  if (msg.author.bot) return;

  if (msg.content.length === 1 && msg.content.startsWith(config.prefix)) return;

  let perms = await client.elevation(msg);
  if (!msg.content.startsWith(config.prefix)) return;

  let command = msg.content.toLowerCase().split(' ')[0].slice(config.prefix.length);
  let params = msg.content.split(' ').slice(1);
  let cmd;

  client.cmd = cmd;

  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }

  if (cmd) {
    if (perms < cmd.conf.permLevel) {

      let embedBuild = new Discord.RichEmbed()
          .setColor(config.embed.colors.error)
          .setDescription('Invalid permissions.')
          .setFooter(config.embed.footer)
          .setTimestamp();
      await msg.channel.send(embed);
      return;
    }
    cmd.run(client, msg, params, perms);
  }
};
