const Discord = require('discord.js');
const client = new Discord.Client();
const sRoleChannelId = '741760525045727243';
const roleChannelId = '707375163171143701';
const botChannelId = '741678960383099000';
const botCommandsChannelId = '746539386480492586';
var guild;
var botChannel;
var sRoleChannel;
var roleChannel;
var timeStamp;
var emojiname;
var eChannel;
var rolename;
var botCommandsChannel;
var botCommands = new Map();

client.on('ready', () => {
    console.log('I am ready!');
     // in leftToEight() milliseconds run this:
        timeStamp = Date.now()/1000;
    
    guild = client.guilds.get('692591742570201118');
    botChannel = guild.channels.get(botChannelId);
    sRoleChannel = guild.channels.get(sRoleChannelId);
    roleChannel = guild.channels.get(roleChannelId);
    
    emojiname = ["ohioflag", "pennsylvaniaflag", "indianaflag", "kentuckyflag", "questionmark", "grassblock"];
    eChannel = [sRoleChannel, sRoleChannel, sRoleChannel, sRoleChannel, sRoleChannel, roleChannel];
    rolename = ["Ohio", "Pennsylvania", "Indiana", "Kentucky", "Not in OHPAINKY", "build events"];
    
    //sendMessage(); // send the message once
    
    botCommandsChannel = client.guilds.get('727285430499672115').channels.get(botCommandsChannelId);
    console.log(botCommandsChannel.type);
    
    botCommandsChannel.messages.fetchMessages().then(messages => {
        console.log(`Received ${messages.size} messages`);
        //Iterate through the messages here with the variable "messages".
        messages.forEach(message => importBotCommand(message.content));
    });

});

client.on('message', message => {
    var messageString = message.content;
    if (messageString === 'ping') {
    	message.reply('pong');
  	}
    if(messageString.toLowerCase() === 'michigan' || messageString.toLowerCase() === 'michigay') {
        message.reply('Boo Michigan!');
    }
    if(messageString.toLowerCase().includes('irwin')) {
        message.guild.members.find(m => m.id === "520732521277685765").send("You've been mentioned!\n"+ message.member.user.tag + " said: " + "\"" + message.content + "\"\nhttp://discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + message.id);
    }
    
    if(messageString.charAt(0) == '=') {
        messageString = messageString.substring(1);
        var temp = messageString.split(" ");
        if(botCommands.has(temp[0].substring(1))) {
            message.channel.sendMessage(botCommands.get(temp[0]));
        }
    }
});

function importBotCommand(message) {
    try {
        var temp = message.split(" ");
        var input;
        var output;
        if(temp.length > 1) {
            input = temp[0];
            for(var i=1; i<temp.length; i++) {
                output += temp[i] + " ";
            }
            output.substring(0, output.length()-1);
        } else {
            console.log("incorrect array length");
            return;
        }
        botCommands.set(input, output);
    } catch (error) {
        console.error(error);
    }
}

function sendMessage(){
    roleChannel.send("React with <:grassblock:743579727809478706> to get build event announcements");
    console.log("sent");
    //roleChannel.send("-------------------------------------");
    //roleChannel.send("Ohio");
    //roleChannel.send("Pennsylvania");
    //roleChannel.send("Indiana");
    //roleChannel.send("Kentucky");
    //roleChannel.send("Not in OHPAINKY");
    //roleChannel.send(" ");
    //roleChannel.send(" ");
}






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
    if (user && !user.bot) {
    //if (user && !user.bot && reaction.message.channel.guild)
        //console.log(reaction.message.channel.id);
        for (let o in emojiname) {
            if (reaction.emoji.name == emojiname[o] && reaction.message.channel == eChannel[o]) {
                console.log(rolename[o]);
                let i = reaction.message.guild.roles.find(reaction => reaction.name == rolename[o]);
                try {
                    reaction.message.guild.member(user).addRole(i);
                    console.log("added role");
                    reaction.message.guild.member(user).send("**OHPAINKY:** Gave you the " + rolename[o] + " role.");
                    console.log("sent DM");
                }
                catch(error) {
                    console.error(error);
                }
            }
        }
    }
});

client.on("messageReactionRemove", async (reaction, user) => {
    if (user && !user.bot) {
        for (let o in emojiname) {
            if (reaction.emoji.name == emojiname[o] && reaction.message.channel == eChannel[o]) {
                console.log(rolename[o]);
                let i = reaction.message.guild.roles.find(reaction => reaction.name == rolename[o]);
                try {
                    reaction.message.guild.member(user).removeRole(i);
                    console.log("removed role");
                    reaction.message.guild.member(user).send("**OHPAINKY:** Removed your " + rolename[o] + " role.");
                    console.log("sent DM");
                }
                catch(error) {
                    console.error(error);
                }
            }
        }
    }
});


// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);//where BOT_TOKEN is the token of our bot 
