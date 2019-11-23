const config = require(`../config.json`);
const Discord = require(`discord.js`);
const whmcsGet = require('../functions/whmcsGet.js');
const sql = require('sqlite');
sql.open('./bot.sqlite');

exports.run = async (client, msg, args) => {
    let member = msg.mentions.members.first();
     let row = await sql.get(`SELECT * FROM whmcs WHERE discordId = "${member.id}"`);
    if (!row) return;
    let clientUser = await whmcsGet.get({ clientid: row.clientId }, 'getclientsProducts');
    if (!clientUser) return Embed(msg.channel, `${member} does not have a WHMCS account or did not link it.`, 'error', 'Error');
    Embed(msg.channel, `${clientUser.products.product.map(i => `${i.name} - ${i.recurringamount}$`).join('\n')}`, 'main', `${member.user.username}#${member.user.discriminator}'s Products`)
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
    name: `products`,
    description: `Show the products of a user.`,
    usage: `products [@user]`
};
