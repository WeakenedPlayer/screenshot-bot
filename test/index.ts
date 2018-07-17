//import { ImageWatcherFactory, ImageWatcher, ImageWatcherOption, ImageSourceFactory } from './source';
//import { Subject } from 'rxjs';
//
//let inquirer = require( 'inquirer' );
//
//import { SourcePrompt, dummyPrompt } from './prompt';
//
//let p = new SourcePrompt();
//
//p.open( p );

import { DiscordClientService } from './discord-service';
import { PngHandler } from './png';
import { JpgHandler } from './jpg';
import { TOKEN, CHANNEL } from './secret';

let client = new DiscordClientService();
let png = new PngHandler();
let jpg = new JpgHandler();

client.login( TOKEN )
.then( () => {
    return png.read( './tmp/screenshot_20180709-23-19-43.png' )
    .then( raw => {
        return jpg.convert( raw );
    } ).then( img => {
        return client.postImage( CHANNEL, img );
    } ).catch( ( err ) => console.log( err ) )
} ).then( () => {
    client.logout();
} );
