import { ImagePoster } from '../image-poster';
import { DiscordChannelProvider } from './discord-channel-provider';
import { TextChannel, Attachment } from 'discord.js';

export class DiscordPoster implements ImagePoster {
    constructor( private provider: DiscordChannelProvider ) {}
    
    post( message: string ): Promise<void> {
        let channel = this.provider.getChannel();
        if( !channel ) {
            throw new Error( 'Channel is not specified.' );
        }
        return channel.send( message )
        .then( () => {} );
    }
    
    postImage( image: Buffer, message: string = '', filename?: string ): Promise<void> {
        let channel = this.provider.getChannel();
        if( !channel ) {
            throw new Error( 'Channel is not specified.' );
        }
        return channel.send( message, new Attachment( image, filename )  )
        .then( () => {} );
    }
}
