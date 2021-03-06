import {
    SimpleWatcher, PngHandler, JpgHandler, 
    DiscordPoster, DiscordClientService, DiscordChannelProvider,
    ScreenshotBot
} from '../dist';

import { ImageConverter } from './image-converter'; 
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

const option = {
    interval: 200,
    threshold: 2000
};

const FILTER = 'e:/ps2/Screenshots/*.png';

// components
let watcher = new SimpleWatcher();

let converter = new ImageConverter();
converter.setInput( new PngHandler() );
converter.setOutput( new JpgHandler() );

let clientService = new DiscordClientService();
let channel = new DiscordChannel( clientService );
let poster = new DiscordPoster( channel );


let jpgOption = { quality: 100 };
//core
let bot = new ScreenshotBot( watcher, converter, poster );

console.log( 'Token: ' + TOKEN );

clientService.connect( TOKEN )
.catch( err => {
    console.error( 'Cannot connect to Discord Server.' );
} )
.then( () => {
    channel.setChannelId( CHANNEL );
    bot.start();
    watcher.watch( FILTER, option );
} );

process.on('SIGINT', () => {
    watcher.unwatch();
    bot.stop();
    return clientService.disconnect().then( () => {
       console.log( 'Stop' );
   } );
} );