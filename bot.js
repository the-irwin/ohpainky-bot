'use strict';
const Discord = require('discord.js');
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD'] });
const roleChannelId = '741760525045727243';
const botChannelId = '741678960383099000';
const botCommandsChannelId = '746580589020315738';
const generalChannelId = '692591742570201124';
const showcaseChannelId = '696773761239875615';
const joinNotifChannelId = '701204683758370946';
const inputChannelId = '795782951790313524';
const pongRoleId = '771362128522772520';
const ohpainkyGuildId = '692591742570201118';
var ohpainkyGuild;
var pongRole;
var guild;
var timeStamp;
var emojiname;
var eChannel;
var rolename;
var generalChannel;
var botCommands = new Map();

client.on('ready', () => {
    console.log('I am ready!');
    timeStamp = Date.now()/1000;
    
    emojiname = ["ohioflag", "pennsylvaniaflag", "indianaflag", "kentuckyflag", "questionmark", "grassblock", "twitch", "instagram", "youtube", "E_"];
    eChannel = [roleChannelId, roleChannelId, roleChannelId, roleChannelId, roleChannelId, roleChannelId, roleChannelId, roleChannelId, roleChannelId, roleChannelId];
    rolename = ["Ohio", "Pennsylvania", "Indiana", "Kentucky", "Not in OHPAINKY", "build events", "Twitch", "Instagram", "Youtube", "events"];
    
    sendMessage(); // send the message once
    
    client.channels.fetch(botCommandsChannelId).then(botCommandsChannel => {    //import bot commands from bot commands channel
        botCommandsChannel.messages.fetch().then(messages => {
            console.log(`Received ${messages.size} messages`);
            //Iterate through the messages here with the variable "messages".
            messages.forEach(message => importBotCommand(message, true));
        }).catch (error => console.error(error) );
    }).catch (error => console.error(error) );
    
    client.channels.fetch(generalChannelId).then(channel => {    //import bot commands from bot commands channel
        channel.messages.fetch().then(messages => {
            //console.log(`Received ${messages.size} messages`);
            //Iterate through the messages here with the variable "messages".
            generalChannel = channel;
        }).catch (error => console.error(error) );
    }).catch (error => console.error(error) );
    
    client.guilds.fetch(ohpainkyGuildId).then(guild => {
        //ohpainkyGuild = guild;
        console.log("ohpainkyGuildId: " + guild.id);
        guild.roles.fetch(pongRoleId).then(role => {
            pongRole = role;
            console.log("pong role id: " + pongRole.id);
        }).catch(console.error);
    }).catch(console.error);
});

client.on('message', message => {
    var messageString = message.content.toLowerCase();
    //console.log("message found in channel: " + message.channel.id);
    if(messageString.charAt(0) == '=' && message.channel.id != botCommandsChannelId) {    //check if the string is a bot command and is not in the bot commands channel (would cause infinite loop)
        try {
            message.channel.send(botCommands.get(messageString.substring(1))[0]);
        } catch (error) {
            console.error(error);
        }
    }

    if (messageString === 'ping') {
    	message.reply('pong');
  	}
    
    //console.log("Found message in " + message.channel.id);
    if(message.channel.id == inputChannelId) {
        console.log("found message in input channel");
        if (messageString.indexOf(' ') == -1) {
            console.log('input doesnt have a whitespace');
        } else {
            var channelId = messageString.substr(0,messageString.indexOf(' '));  //split by first space
            var channel;
            client.channels.fetch(channelId).then(c => {    //import bot commands from bot commands channel
                channel = c;
            }).catch (error => console.error(error) );
            
            var content = messageString.substr(messageString.indexOf(' ')+1);
            try {
                channel.send(content);
                console.log("Sent \"" + content + "\" in channel: " + channel.id); 
            } catch (error) {
                console.error(error);
            }
        }
    }

    messageString = messageString.replace(/<\/?[^>]+>/g, '') //ignores all mentions

    if (messageString.includes('69') && !messageString.includes('www.' || 'http' || '.com' || '.net') && !message.author.bot) { // Disregard messages that contain links or are sent by bots
        message.reply('nice');
    }
    if(!message.author.bot && (messageString.includes('michigan')) ) {
        message.reply('Boo Michigan!');
    }
    if(message.channel.id == showcaseChannelId && message.attachments.size > 0)  {    //react with pog on every image posted in the showcase channel
        message.react(client.emojis.get('705130675627491540'));
    }
    if(message.channel.id == botCommandsChannelId) {    //import new bot command
        importBotCommand(message, false);
    }
});

client.on('messageDelete', message => {
    
    if(message.channel.id == botCommandsChannelId) {
        deleteBotCommand(message);
    }
});

client.on('guildMemberAdd', member => {
    if (member.guild.id !== ohpainkyGuildId) {
        return;
    }
    
    client.channels.fetch(joinNotifChannelId).then(joinNotifChannel => {
        joinNotifChannel.send(`Yo, ${pongRole}, ${member} just joined! Go to ${generalChannel} and welcome them!`);
    });
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    
    if(newMessage.channel.id == botCommandsChannelId) {
        deleteBotCommand(oldMessage);
        importBotCommand(newMessage, false);
    }
});

function importBotCommand(message, isImport) {
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
        /*
        if(botCommands.has(input) && !isImport) {
            botCommandsChannel.messages.fetch(botCommands.get(input)[1]).then(m => {
                m.delete();
                console.log("deleting message with id: " + botCommands.get(input)[1] + " and content " + botCommands.get(input)[0])
            }).catch (error => {
                console.log("error while deleting message with id: " + botCommands.get(input)[1] + " and content " + m.content);
                console.error(error);
            });
        }
        */
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

function sendMessage(){ //Used for sending a predefined message
    client.channels.fetch(roleChannelId).then(roleChannel => {    //import bot commands from bot commands channel
        //roleChannel.send("React below for social media notifications");
        //console.log("sent");
        //roleChannel.send("-------------------------------------");
        //roleChannel.send("Instagram");
        //roleChannel.send("Twitch");
        //roleChannel.send("YouTube");
        
        //roleChannel.send("React below for event notifications");
        //console.log("sent");
        //roleChannel.send("-------------------------------------");
        //roleChannel.send("Build Events");
        //roleChannel.send("Other Events");
    }).catch (error => console.error(error) );
}


client.on("messageReactionAdd", async (reaction, user) => {    //add reaction roles
    if (reaction.message.partial) await reaction.message.fetch();
    if (user && !user.bot) {
        //console.log(reaction.emoji.name);
        //console.log(reaction.message.channel.name);
    //if (user && !user.bot && reaction.message.channel.guild)
        //console.log(reaction.message.channel.id);
        for (let o in emojiname) {
            if (reaction.emoji.name == emojiname[o] && reaction.message.channel.id == eChannel[o]) {
                console.log(rolename[o]);
                let i = reaction.message.guild.roles.fetch()
                    .then(roles => {
                        let i = roles.cache.find(reaction => reaction.name == rolename[o]);
                        reaction.message.guild.member(user).roles.add(i);
                        console.log("added role");
                        reaction.message.guild.member(user).send("**OHPAINKY:** Gave you the " + rolename[o] + " role.");
                        console.log("sent DM");
                    }).catch(console.error);
            }
        }
    }
});

client.on("messageReactionRemove", async (reaction, user) => {    //remove reaction roles
    if (reaction.message.partial) await reaction.message.fetch();
    if (user && !user.bot) {
        //console.log(reaction.emoji.name);
        //console.log(reaction.message.channel.name);
        for (let o in emojiname) {
            if (reaction.emoji.name == emojiname[o] && reaction.message.channel.id == eChannel[o]) {
                console.log(rolename[o]);
                reaction.message.guild.roles.fetch()
                    .then(roles => {
                        let i = roles.cache.find(reaction => reaction.name == rolename[o]);
                        reaction.message.guild.member(user).roles.remove(i);
                        console.log("removed role");
                        reaction.message.guild.member(user).send("**OHPAINKY:** Removed your " + rolename[o] + " role.");
                        console.log("sent DM");
                    }).catch(console.error);
            }
        }
    }
});


// DO NOT CHANGE
client.login(process.env.BOT_TOKEN);//where BOT_TOKEN is the token of our bot 
