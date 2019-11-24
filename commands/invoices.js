const config = require(`../config.json`);
const Discord = require(`discord.js`);
const whmcsGet = require('../functions/whmcsGet.js');
const sql = require('sqlite');
sql.open('./bot.sqlite');

exports.run = async (client, msg, args) => {
    let member = msg.mentions.members.first();
    let row = await sql.get(`SELECT * FROM whmcs WHERE discordId = "${member.id}"`);
    if (!row) return;
    let clientUser = await whmcsGet.get({ clientid: row.clientId }, 'getInvoices');
    let invoices = clientUser.invoices.invoice;
        let descriptions = [];
    if (!clientUser) return Embed(msg.channel, `${member} does not have a WHMCS account or did not link it.`, 'error', 'Error');
    Embed(msg.channel, `${invoices.map(i => `ID: ${i['id']}\nDue: ${i['duedate']}`).join('\n\n')}`, 'main', `${member.user.username}#${member.user.discriminator} Tickets`)
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
    name: `invoices`,
    description: `Show the invoices of a user.`,
    usage: `invoices [@user]`
};
