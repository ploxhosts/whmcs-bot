const config = require(`../config.json`);
const Discord = require(`discord.js`);
const whmcsGet = require('../functions/whmcsGet.js');
const sql = require('sqlite');
sql.open('./bot.sqlite');

exports.run = async (client, msg, args) => {
    let member = msg.mentions.members.first();
    if (!member) return Embed(msg.channel, `You must mention the member you wish to get the information of.`, 'error', 'Error');
    let value = await whmcsGet.get({}, 'GetClients', member);
    let row = await sql.get(`SELECT * FROM whmcs WHERE discordId = "${member.id}"`);
    if (value === undefined || value.clients.client.length === 0) return Embed(msg.channel, `There was an error performing this command.`, 'error', 'Error');
    let clientUser = value.clients.client.map(i => {
        if (i['id'] === row.clientId) return i;
        else return false;
    }).filter(i => i !== false);
    if (!row || clientUser.length === 0) return Embed(msg.channel, `${member} does not have a WHMCS account or did not link it.`, 'error', 'Error');
    clientUser = clientUser[0];
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
