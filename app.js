const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const token = require("./token.json");
const fs = require("fs");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const sql = require('sqlite');
sql.open('./bot.sqlite');
const express = require('express');
const app = express();
const port = 80;
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const url = require('url');

const WebSocket = require('ws');

function WebSocketSetup() {
    wss.on('connection', function(ws) {
        ws.on('message', async function(message) {
            let msg = JSON.stringify(message);
            const arguments = ['id', 'username', 'discriminator'];
            for (let i = 0; i < arguments.length; i++) {
                if (msg[arguments[i]] === undefined) return;
            }
            let user = await client.users.find(u => u.username === msg['username'] && u.discriminator === msg['discriminator']);
            if (!user) return;
            await sql.run(`INSERT INTO whmcs VALUES (?, ?)`, [msg['id'], user.id]);


        });
    });
}


function expressSetup(guild, data) {
    let clientId;

    app.set('view engine', 'ejs');

    app.use(express.static('public'));

    app.get('/api/discord/', (req, res) => {
        clientId = req.query.id;
        res.redirect('/link');
    });

    app.get('/link/', (req, res) => {
        res.render('link', {clientId: clientId})
    });

    
    app.get('/success', (req, res) => {
        res.render('success', {
            clientId: clientId,
            username: req.query.username,
            discriminator: req.query.discriminator
        });
    });

    app.get('/fail', (req, res) => {
        res.render('fail', {clientId: clientId});
    });

    app.get('/api/link/', async (req, res) => {
        //let isFail = true;
        let discriminator = req.query.discriminator;
        console.log(discriminator);
        let username = decodeURI(req.query.username);
        let id = req.query.id;
        console.log(id);
        let clientId = req.query.clientId;
        console.log(clientId);
        let user = client.users.find(u => u.username === username && u.discriminator === discriminator);
        let guild = '346715007469355009';
        new Discord.GuildMember(client, data, guild);
        const crole = '354348234413441027';
        await Discord.id.addRole(crole);


        //if (user) {
         //   if (!isNaN(discriminator) && discriminator.toString().length === 4) isFail = false;
        //}

        //if (isFail === false) {
          //  let isCatch = false;

            await sql.run(`INSERT INTO whmcs VALUES (?, ?)`, [clientId, id]).catch((err) => {
                work();
                isCatch = true;

            });



        if (isCatch === true) return;

            res.redirect(url.format({
                pathname: "/success",
                query: req.query
            }));
     //   } else {
       //     fail();
        //}

        function work() {
            res.redirect(url.format({
                pathname: "/success"
            }));
        }
    });

    app.listen(port, () => {});
}

client.elevation = async msg => {
  let permlvl = 0;

  config.staffRoles.map(r => {
      let role = msg.guild.roles.find(role => role.name === r);
      if (role) {
          if (msg.member.roles.has(role.id)) permlvl = 1;
      }
  });

  if (msg.author.id === msg.guild.ownerID) permlvl = 2;
  return permlvl;
};

fs.readdir('./commands', (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
      let props = require(`./commands/${f}`);
      console.log(`Loading Command: ${props.help.name}.`);
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
    });
    console.log(`Loading a total of ${files.length} commands.`);
  });

fs.readdir('./events/', (err, files) => {
    if (err) console.error(err);
    console.log(`Loading a total of ${files.length} events.`);
    files.forEach(file => {
      const eventName = file.split(".")[0];
      const event = require(`./events/${file}`);
      if (eventName === "messageUpdate") client.on(eventName, event.bind(null));
      else client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`./events/${file}`)];
    });
  });


//expressSetup(); call if you want to use the webserver anyways.

expressSetup();

client.login(token.token);

