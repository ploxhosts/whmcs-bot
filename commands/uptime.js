const config = require(`../config.json`);
const Discord = require(`discord.js`);

exports.run = async (client, msg, args) => {
    let uptime = client.uptime;

    let embedBuild = new Discord.RichEmbed()
        .setColor(config.embed.colors.main)
        .setDescription(`My uptime is:\n${timeConversion(uptime)}`)
        .setTimestamp()
        .setFooter(config.embed.footer);
    await msg.channel.send(embedBuild)
};

function timeConversion(millisec) {
    let seconds = (millisec / 1000).toFixed(0);
    let minutes = Math.floor(seconds / 60);
    let hours = "";
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = (hours >= 10) ? hours : "0" + hours;
        minutes = minutes - (hours * 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    if (hours !== "") {
        return `**${hours}** Hours, **${minutes}** Minutes and **${seconds}** Seconds`
    }
    return `**${minutes}** Minutes and **${seconds}** Seconds`
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  helpSection: "normal"
};

exports.help = {
  name: `uptime`,
  description: `Show the bot uptime.`,
  usage: `uptime`
};
