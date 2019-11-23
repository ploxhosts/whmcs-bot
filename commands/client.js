const config = require(`../config.json`);
const Discord = require(`discord.js`);
const whmcsGet = require('../functions/whmcsGet.js');
const sql = require('sqlite');
sql.open('./bot.sqlite');

exports.run = async (client, msg, args) => {
    let member = msg.mentions.members.first();
    if (!member) return Embed(msg.channel, `You must mention the member you wish to get the information of.`, 'error', 'Error');
    let row = await sql.get(`SELECT * FROM whmcs WHERE discordId = "${member.id}"`);
    if (!row) return Embed(msg.channel, `${member} does not have a linked WHMCS account.`, 'error', 'Error');
    let clientUser = await whmcsGet.get({ clientid: row.clientId }, 'GetClientsDetails');
    if (!clientUser) return Embed(msg.channel, `${member} does not have a WHMCS account.`, 'error', 'Error');
    Embed(msg.channel, `Email: ${clientUser['email']}\nFull name: ${clientUser['firstname']} ${clientUser['lastname']}`, 'main', `${member.user.username}#${member.user.discriminator} Client Info`)
};

function Embed(channel, description, color, title) {
    let embedBuild = new Discord.RichEmbed()
        .setTitle(title)
        .setColor(config.embed.colors[color])
        .setDescription(description)
        .setTimestamp()
        .setFooter(config.embed.footer);
    channel.send(embedBuild);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 1,
    helpSection: 'whmcs'
};

exports.help = {
    name: `client`,
    description: `Show some information about a client.`,
    usage: `client [@user]`
};
