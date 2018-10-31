const config = require(`../config.json`);
const Discord = require(`discord.js`);
const whmcsGet = require('../functions/whmcsGet.js');
const sql = require('sqlite');
sql.open('./bot.sqlite');

exports.run = async (client, msg, args) => {
    let member = msg.mentions.members.first();
    if (!member) return Embed(msg.channel, `You must mention the member you wish to get the active tickets of.`, 'error', 'Error');
    let value = await whmcsGet.get({}, 'GetTickets', member);
    if (value === undefined || !value.tickets || value.tickets.ticket.length === 0) return Embed(msg.channel, `There was an error performing this command.`, 'error', 'Error');
    let tickets = value.tickets.ticket;
    let lastTickets = [];
    for (let i = 0; i < 2; i++) {
        lastTickets.push(tickets[i]);
    }
    Embed(msg.channel, `${lastTickets.map(i => `ID: ${i['id']}\nStatus: ${i['status']}`).join('\n\n')}`, 'main', `${member.user.username}#${member.user.discriminator} Tickets`)
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
    name: `tickets`,
    description: `Show the active tickets of a user.`,
    usage: `tickets [@user]`
};
