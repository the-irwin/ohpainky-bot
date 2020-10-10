const Discord = require('discord.js');
const client = new Discord.Client();
const sRoleChannelId = '741760525045727243';
const roleChannelId = '707375163171143701';
const botChannelId = '741678960383099000';
const botCommandsChannelId = '746580589020315738';
const showcaseChannelId = '696773761239875615';
var guild;
var botChannel;
var sRoleChannel;
var roleChannel;
var timeStamp;
var emojiname;
var eChannel;
var rolename;
var botCommandsChannel;
var showcaseChannel;
var botCommands = new Map();

client.on('ready', () => {
    console.log('I am ready!');
     // in leftToEight() milliseconds run this:
        timeStamp = Date.now()/1000;
    
    guild = client.guilds.fetch('692591742570201118');
    botChannel = client.channels.fetch(botChannelId);
    sRoleChannel = client.channels.fetch(sRoleChannelId);
    roleChannel = client.channels.fetch(roleChannelId);
    showcaseChannel = client.channels.fetch(showcaseChannelId);
    
    emojiname = ["ohioflag", "pennsylvaniaflag", "indianaflag", "kentuckyflag", "questionmark", "grassblock", "ohiopurple", "ohioblue", "ohiored", "ohioorange"];
    eChannel = [sRoleChannel, sRoleChannel, sRoleChannel, sRoleChannel, sRoleChannel, roleChannel, roleChannel, roleChannel, roleChannel, roleChannel];
    rolename = ["Ohio", "Pennsylvania", "Indiana", "Kentucky", "Not in OHPAINKY", "build events", "Twitch", "Instagram", "Youtube", "events"];
    
    //sendMessage(); // send the message once
    
    botCommandsChannel = client.channels.fetch(botCommandsChannelId);
    
    botCommandsChannel.fetchMessages().then(messages => {
        console.log(`Received ${messages.size} messages`);
        //Iterate through the messages here with the variable "messages".
        messages.forEach(message => importBotCommand(message));
    });

});

client.on('message', message => {
    var messageString = message.content.toLowerCase();
    if(messageString.charAt(0) == '=') {
        try {
            message.channel.send(botCommands.get(messageString.substring(1))[0]);
        } catch (error) {
            console.error(error);
        }
    }

    if (messageString === 'ping') {
    	message.reply('pong');
  	}
    //console.log(messageString);
    messageString = messageString.replace(/<\/?[^>]+>/g, '') //ignores all mentions
    //console.log(messageString);
    if (messageString.includes('eat you')) {
        message.reply('kinky');
    }
    if (messageString.includes('69') && !message.author.bot) {
        message.reply('nice');
    }
    if(!message.author.bot && (messageString.includes('michigan') || messageString.includes('michigay'))) {
        message.reply('Boo Michigan!');
    }
    if(message.channel == showcaseChannel && message.attachments.size > 0)  {
        message.react(client.emojis.get('705130675627491540'));
    }
    if(messageString.includes('irwin')) {
        //console.log(message.author.id);
        //console.log(messageString.indexOf('irwin'));
        if(message.author.id != '746818356434305075' || messageString.indexOf('irwin') > 5) { //ignore if server bot
            client.fetchUser('520732521277685765').then((user) => {
                console.log(message.guild.id);
                user.send("You've been mentioned!\n"+ message.author.tag + " said: " + "\"" + message.content + "\"\nhttp://discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + message.id);
            });
        }
    }
    
    if(message.channel == botCommandsChannel) {
        importBotCommand(message);
    }
    
});

client.on('messageDelete', message => {
    
    if(message.channel == botCommandsChannel) {
        deleteBotCommand(message);
    }
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    
    if(newMessage.channel == botCommandsChannel) {
        deleteBotCommand(oldMessage);
        importBotCommand(newMessage);
    }
});

function importBotCommand(message) {
    try {
        console.log(message.content);
        var temp = message.content.split(" ");
        var input;
        var output = "";
        if(temp.length > 1) {
            input = temp[0];
            for(var i=1; i<temp.length; i++) {
                output += temp[i] + " ";
            }
            output.substring(0, output.length-1);
        } else {
            console.log("incorrect array length");
            return;
        }
        if(botCommands.has(input)) {
            botCommandsChannel.fetchMessage(botCommands.get(input)[1]).then(m => {
                m.delete();
                console.log("deleting message with id: " + botCommands.get(input)[1] + " and content " + botCommands.get(input)[0])
            }).catch (error => {
                console.log("error while deleting message with id: " + botCommands.get(input)[1] + " and content " + m.content);
                console.error(error);
            });
        }
        var value = [output, message.id];
        botCommands.set(input, value);
        console.log("trigger " + input + " now maps to " + botCommands.get(input)[0]);
    } catch (error) {
        console.error(error);
    }
}

function deleteBotCommand(message) {
    try {
        console.log(message.content + " is being deleted");
        var temp = message.content.split(" ");
        var input;
        if(temp.length > 1) {
            input = temp[0];
        } else {
            console.log("incorrect array length");
            return;
        }
        botCommands.delete(input);
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
    const channel = client.channels.fetch(packet.d.channel_id);
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
