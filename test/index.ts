import { DiscordPoster, PostService } from './post-service';
import { ConvertService, createJpgHandler, createPngHandler } from './convert-service';
import { TOKEN, CHANNEL } from './secret';

let client = new DiscordPoster();
let converter = new ConvertService();

converter.setInput( createPngHandler() );
converter.setOutput( createJpgHandler() );

client.setToken( TOKEN );

console.log( client.connected );

client.connect()
.then( () => {
    client.setChannel( CHANNEL );
    console.log( client.connected );
    return converter.convert( './tmp/screenshot_20180709-23-19-43.png' ).then( img => client.postImage( img ) );
} ).then( () => {
    client.disconnect();
} );
