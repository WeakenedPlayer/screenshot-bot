import { JpegGenerator } from '../src';
import { Subject, Subscription, Observable } from 'rxjs';

import { srcDir, tmpDir } from './constants';

console.log( 'Monitoring: ' + srcDir );

let toggle = false;
let condition = new Subject<boolean>();
let watcher = new JpegGenerator( srcDir, tmpDir, condition );

watcher.image$.map( image => { console.log( image ) } ).subscribe();

setInterval( ()=>{
    if( toggle ) {
        toggle = false;
    } else {
        toggle = true;
    }
    condition.next( toggle );
    console.log( toggle );
}, 5000 );

/*
//Import the discord.js module
const Discord = require('discord.js');

//Create an instance of a Discord client
const client = new Discord.Client();

//The token of your bot - https://discordapp.com/developers/applications/me

//The ready event is vital, it means that your bot will only start reacting to information
//from Discord _after_ ready is emitted
client.on('ready', () => {
console.log('I am ready!');
});

//Create an event listener for messages
client.on('message', message => {
 // If the message is "what is my avatar"
    if (message.content === 'what is my avatar') {
      // Send the user's avatar URL
      message.reply(message.author.avatarURL);
    }
 // If the message is "what is my avatar"
    if (message.content === 'quit') {
        client.destroy();
        process.exit();
    }
});

//Log our bot in
client.login(token);
*/

