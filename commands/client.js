const config = require(`../config.json`);
const Discord = require(`discord.js`);
const whmcsGet = require('../functions/whmcsGet.js');
const sql = require('sqlite');
sql.open('./bot.sqlite');

exports.run = async (client, msg, args) => {
    let member = args;
     // if (!member) return Embed(msg.channel, `You must enter the email you wish to get the information of.`, 'error', 'Error');
    //   let row = await sql.get(`SELECT * FROM whmcs WHERE discordId = "${member.id}"`);
//    if (!row) return Embed(msg.channel, `${member} does not have a linked WHMCS account.`, 'error', 'Error');
    let clientUser = await whmcsGet.get({ email: member }, 'GetClientsDetails');
    if (clientUser['result'] !== 'error') {
        Embed(msg.channel, `URL: [Click](/clientssummary.php?userid=${clientUser['id']})\nClient ID: ${clientUser['id']}\nEmail: ${clientUser['email']}\nFull Name: ${clientUser['firstname']} ${clientUser['lastname']}\nAddress Line: ${clientUser['address1']} ${clientUser['city']}, ${clientUser['state']}, ${clientUser['countryname']}`, 'main', `▫️${args} | WHMCS Client Lookup`)
    } else {
        return Embed(msg.channel, `That user does not not exist!`, 'error', 'Error');
    }
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
};

exports.help = {
    name: `client`,
    description: `Show some information about a client.`,
    usage: `client [@user]`
};
