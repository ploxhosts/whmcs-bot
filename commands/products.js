const config = require(`../config.json`);
const Discord = require(`discord.js`);
const whmcsGet = require('../functions/whmcsGet.js');

exports.run = async (client, msg, args) => {
    let member = msg.mentions.members.first();
    if (!member) return Embed(msg.channel, `You must mention the member you wish to check the products of.`, 'error', 'Error');
    let value = await whmcsGet.get({}, 'GetClientsProducts', member);
    if (value === undefined) return Embed(msg.channel, `There was an error performing this command.`, 'error', 'Error');
    console.log(value.products.product);
    if (value.products === '' || !value.products.product.length || value.products.product.length === 0) return Embed(msg.channel, `${member} does not have any products.`, 'error', 'Error');
    Embed(msg.channel, `${value.products.product.map(i => `${i.name} - ${i.recurringamount}$`).join('\n')}`, 'main', `${member.user.username}#${member.user.discriminator}'s Products`)
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
