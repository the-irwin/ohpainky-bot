const Discord = require('discord.js');
const client = new Discord.Client();
var timeStamp;

client.on('ready', () => {
    console.log('I am ready!');
     // in leftToEight() milliseconds run this:
        timeStamp = Date.now()/1000;
        
    
        sendMessage(); // send the message once
});

client.on('message', message => {
    if (message.content === 'ping') {
    	message.reply('pong');
  	}
    if(message.content.toLowerCase() === 'michigan' || message.content.toLowerCase() === 'michigay') {
        message.reply('Boo Michigan!');
    }
});

function sendMessage(){
    var guild = client.guilds.get('692591742570201118');
    var channel = guild.channels.get('741678960383099000');
    channel.send("ready");
    
}

var emojiname = ["ohiored", "ohiopurple"],
    rolename = ["Dumbass", "FurFag"];

client.on("message", e => {
    if (e.content.startsWith(prefix + "reaction")) {
        if (!e.channel.guild) return;
        for (let o in emojiname) {
            var n = [e.guild.emojis.find(e => e.name == emojiname[o])];
            for (let o in n) e.react(n[o])
        }
    }
});

client.on("messageReactionAdd", (e, n) => {
    if (n && !n.bot && e.message.channel.guild)
        for (let o in emojiname)
            if (e.emoji.name == emojiname[o]) {
                let i = e.message.guild.roles.find(e => e.name == rolename[o]);
                e.message.guild.member(n).addRole(i).catch(console.error)
            }
});

client.on("messageReactionRemove", (e, n) => {
    if (n && !n.bot && e.message.channel.guild)
        for (let o in emojiname)
            if (e.emoji.name == emojiname[o]) {
                let i = e.message.guild.roles.find(e => e.name == rolename[o]);
                e.message.guild.member(n).removeRole(i).catch(console.error)
            }
});


// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);//where BOT_TOKEN is the token of our bot 
