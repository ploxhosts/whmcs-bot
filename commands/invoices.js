const config = require(`../config.json`);
const Discord = require(`discord.js`);
const whmcsGet = require('../functions/whmcsGet.js');
const sql = require('sqlite');
sql.open('./bot.sqlite');

exports.run = async (client, msg, args) => {
    let member = msg.mentions.members.first();
    if (!member) return Embed(msg.channel, `You must mention the member you wish to get the invoices of.`, 'error', 'Error');
    let value = await whmcsGet.get({}, 'GetInvoices', member);
    if (value === undefined || !value.invoices || value.invoices.length === 0 || value.invoices.invoice.length === 0) return Embed(msg.channel, `There was an error performing this command.`, 'error', 'Error');
    let invoices = value.invoices.invoice;
    let descriptions = [];
    for (let i = 0; i < invoices.length; i++) {
        let description = await whmcsGet.get({invoiceid: invoices[i]['id']}, 'GetInvoice', member);
        descriptions.push(description.items.item[0].description);
    }
    Embed(msg.channel, `${invoices.map(i => `ID: ${i['id']}\nDescription: ${descriptions[invoices.indexOf(i)]}\nDue: ${i['duedate']}`).join('\n\n')}`, 'main', `${member.user.username}#${member.user.discriminator} Tickets`)
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
