import { ScreenshotBot } from '../src/screenshot-bot';

const token = require('./token');
console.log( 'Login to token <' + token + '>' );

let bot = new ScreenshotBot();

bot.app$.map( app => { 
    console.log( '----app------------------' );
    console.log( app );
    console.log( '-------------------------' );
} ).take(2).subscribe();


bot.textChannel$.map( channels => { 
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

bot.login( token ).catch( err => { 
    console.log( '-------------------------' );
    console.log( 'login failed: check your tokne is valid.');
    console.log( '-------------------------' );
    console.log( err );
} );

