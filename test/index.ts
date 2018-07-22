import {
    SimpleWatcher, 
    ImageConverter, PngHandler, JpgHandler, 
    DiscordPoster, DiscordClientProvider, DiscordChannelProvider,
    ScreenshotBot
} from '../dist';

import { CHANNEL, TOKEN } from './secret';

// components
let watcher = new SimpleWatcher( {
    filter: './test/*.png',
    interval: 200,
    threshold: 2000
} );

let converter = new ImageConverter();
converter.setInput( new PngHandler() );
converter.setOutput( new JpgHandler( { quality: 100 } ) );

let clientProvider = new DiscordClientProvider();
let channelProvider = new DiscordChannelProvider( clientProvider );
let poster = new DiscordPoster( channelProvider );

//core
let bot = new ScreenshotBot( watcher, converter, poster );

console.log( 'token ' + TOKEN );

clientProvider.connect( TOKEN )
.catch( err => {
    console.error( 'Cannot connect Discord Server.' );
} )
.then( () => {
    channelProvider.selectById( CHANNEL );
    bot.start().then( () => {
        console.log( 'test' );
    } );
} );

process.on('SIGINT', () => {
    bot.stop().then( () => {
        return clientProvider.disconnect();
   } ).then( () => {
       console.log( 'closed' );
   } );
} );