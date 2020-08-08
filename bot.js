const Discord = require('discord.js');
const client = new Discord.Client();
const guild = client.guilds.get('692591742570201118');
const channel = guild.channels.get('741678960383099000');
var timeStamp;

client.on('ready', () => {
    console.log('I am ready!');
     // in leftToEight() milliseconds run this:
        timeStamp = Date.now()/1000;
        
    
        //sendMessage(); // send the message once
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
    channel.send("ready");
    
}



var emojiname = ["ohiored", "ohiopurple"],
    rolename = ["Dumbass", "FurFag"];


//client.on("message", e => {
//    if (e.content.startsWith(prefix + "reaction")) {
//        if (!e.channel.guild) return;
//        for (let o in emojiname) {
//            var n = [e.guild.emojis.find(e => e.name == emojiname[o])];
//            for (let o in n) e.react(n[o])
//        }
//    }
//});

client.on("messageReactionAdd", (reaction, user) => {
    if (user && !user.bot && reaction.message.channel == channel && reaction.message.channel.guild)
    //if (user && !user.bot && reaction.message.channel.guild)
        console.log(reaction.emoji.name);
        for (let o in emojiname)
            if (reaction.emoji.name == emojiname[o]) {
                let i = reaction.message.guild.roles.find(reaction => reaction.name == rolename[o]);
                console.log(i);
                reaction.message.guild.member(user).addRole(i).catch(console.error)
            }
});

client.on("messageReactionRemove", (reaction, user) => {
    if (user && !user.bot && reaction.message.channel.guild)
        for (let o in emojiname)
            if (reaction.emoji.name == emojiname[o]) {
                let i = reaction.message.guild.roles.find(reaction => reaction.name == rolename[o]);
                reaction.message.guild.member(user).removeRole(i).catch(console.error)
            }
});


// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);//where BOT_TOKEN is the token of our bot 
