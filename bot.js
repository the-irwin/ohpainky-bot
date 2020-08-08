const Discord = require('discord.js');
const client = new Discord.Client();
var guild;
var botChannel;
var roleChannel;
var timeStamp;

client.on('ready', () => {
    console.log('I am ready!');
     // in leftToEight() milliseconds run this:
        timeStamp = Date.now()/1000;
    
    guild = client.guilds.get('692591742570201118');
    botChannel = guild.channels.get('741678960383099000');
    roleChannel = guild.channels.get('741760525045727243');
    
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
    roleChannel.send("React to the flag of your state below");
    roleChannel.send("-------------------------------------");
    roleChannel.send("Ohio");
    roleChannel.send("Pennsylvania");
    roleChannel.send("Indiana");
    roleChannel.send("Kentucky");
    roleChannel.send("Not in OHPAINKY");
    roleChannel.send(" ");
    roleChannel.send(" ");
}



var emojiname = ["ohioflag", "pennsylvaniaflag", "indianaflag", "kentuckyflag"],
    rolename = ["Ohio", "Pennsylvania", "Indiana", "Kentucky"];


//client.on("message", e => {
//    if (e.content.startsWith(prefix + "reaction")) {
//        if (!e.channel.guild) return;
//        for (let o in emojiname) {
//            var n = [e.guild.emojis.find(e => e.name == emojiname[o])];
//            for (let o in n) e.react(n[o])
//        }
//    }
//});

client.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = client.channels.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.fetchMessage(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.get(emoji);
        // Adds the currently reacting user to the reaction's users collection.
        if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
        }
    });
});

client.on("messageReactionAdd", async (reaction, user) => {
    if (user && !user.bot && reaction.message.channel == roleChannel)
    //if (user && !user.bot && reaction.message.channel.guild)
        console.log(reaction.emoji.name);
        for (let o in emojiname)
            if (reaction.emoji.name == emojiname[o]) {
                let i = reaction.message.guild.roles.find(reaction => reaction.name == rolename[o]);
                reaction.message.guild.member(user).addRole(i).catch(console.error)
            }
});

client.on("messageReactionRemove", async (reaction, user) => {
    if (user && !user.bot && reaction.message.channel == roleChannel)
        for (let o in emojiname)
            if (reaction.emoji.name == emojiname[o]) {
                let i = reaction.message.guild.roles.find(reaction => reaction.name == rolename[o]);
                reaction.message.guild.member(user).removeRole(i).catch(console.error)
            }
});


// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);//where BOT_TOKEN is the token of our bot 
