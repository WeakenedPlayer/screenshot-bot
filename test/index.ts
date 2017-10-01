import { ScreenshotBot } from '../src';

// token -> https://discordapp.com/developers/applications/me/<client id>
const token = 'your token here';

console.log( 'Login to token <' + token + '>' );

let bot = new ScreenshotBot();

bot.app$.map( app => { 
    console.log( '----app------------------' );
    console.log( app );
    console.log( '-------------------------' );
} ).take(2).subscribe();


bot.channel$.map( channels => { 
    console.log( '----channels-------------' );
    console.log( channels );
    console.log( '-------------------------' );
} ).take(2).subscribe();

bot.guild$.map( guilds => {
    console.log( '----guilds---------------' );
    console.log( guilds );
    console.log( '-------------------------' );
} ).take(2).subscribe();

bot.registerListener( 'ready', () => {
    bot.logout();
    console.log( 'end.' );
} );

bot.login( token );

