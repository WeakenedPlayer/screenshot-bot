import { DiscordClientService } from './discord-service';
import { ConvertService } from './convert-service';
import { TOKEN, CHANNEL } from './secret';

let client = new DiscordClientService();
let converter = new ConvertService();

client.login( TOKEN )
.then( () => {
    return converter.convert( './tmp/screenshot_20180709-23-19-43.png' ).then( img => client.postImage( CHANNEL, img ) );
} ).then( () => {
    client.logout();
} );
