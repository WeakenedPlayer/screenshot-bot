import {
    SimpleWatcher, 
    ImageConverter, PngHandler, JpgHandler, 
    DiscordPoster, DiscordClientService, DiscordChannelProvider,
    ScreenshotBot
} from '../dist';

import { TextChannel } from 'discord.js';
import { CHANNEL, TOKEN } from './secret';

class DiscordChannel implements DiscordChannelProvider {
    private channel: TextChannel = null;
    constructor( private clientService: DiscordClientService ) {}
    
    setChannelId( id: string ): void {
        this.channel = this.clientService.getChannelById( id ); 
    }
    
    getChannel(): TextChannel {
        return this.channel;
    }
}

// components
let watcher = new SimpleWatcher( {
    filter: './test/*.png',
    interval: 200,
    threshold: 2000
} );

let converter = new ImageConverter();
converter.setInput( new PngHandler() );
converter.setOutput( new JpgHandler( { quality: 100 } ) );

let clientService = new DiscordClientService();
let channel = new DiscordChannel( clientService );
let poster = new DiscordPoster( channel );

//core
let bot = new ScreenshotBot( watcher, converter, poster );

console.log( 'Token: ' + TOKEN );


clientService.connect( TOKEN )
.catch( err => {
    console.error( 'Cannot connect to Discord Server.' );
} )
.then( () => {
    channel.setChannelId( CHANNEL );
    bot.start().then( () => {
        console.log( 'Start' );
    } );
} );

process.on('SIGINT', () => {
    bot.stop().then( () => {
        return clientService.disconnect();
   } ).then( () => {
       console.log( 'Stop' );
   } );
} );