const Discord = require('discord.js');
const client = new Discord.Client();
var timeStamp;

client.on('ready', () => {
    console.log('I am ready!');
     // in leftToEight() milliseconds run this:
        timeStamp = Date.now()/1000;
        
    
        sendMessage(); // send the message once
        var minMillseconds = 1000 * 60 * 6 * 60;
        setInterval(function(){ // repeat this every 24 hours
            sendMessage();
        }, minMillseconds)
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
    var request = require("request");

    var options = {
      method: 'GET',
      url: 'https://therundown-therundown-v1.p.rapidapi.com/delta',
      qs: {last_id: timeStamp, include: ['all_periods', 'scores']},
      headers: {
        'x-rapidapi-host': 'therundown-therundown-v1.p.rapidapi.com',
        'x-rapidapi-key': '30616052a7msh590c06b4e88b8f8p1e3cf0jsn2687bddb4085',
        useQueryString: true
      }
    };
    timeStamp = Date.now()/1000;

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
    
    var guild = client.guilds.get('727285430499672115');
    var channel = guild.channels.get('727285430499672119');
    channel.send("Hello");
    
}

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);//where BOT_TOKEN is the token of our bot 
