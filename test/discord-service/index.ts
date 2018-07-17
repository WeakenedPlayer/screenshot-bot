import { Client, OAuth2Application, Guild, Channel, TextChannel, Attachment, Message } from 'discord.js';

export interface GuildInfo {
    id: string;
    name: string;
    channels: ChannelInfo[];
}

export interface ChannelInfo {
    id: string;
    name: string;
    type: string;
}

export class DiscordClientService {
    private client: Client = null;
    private app: OAuth2Application = null;
    constructor() {}
    
    private _login( token: string ): Promise<void> {
        this.client = new Client();
        return this.client.login( token )
        .then( token => {
            return this.client.fetchApplication();
        } ).then( app => {
            this.app = app;
        } );
    }
    
    private _logout(): Promise<void> {
        return this.client.destroy()
        .then( () => {
            this.client = null;
            this.app = null;
        } );            
    }
    
    private getChannel( id: string, type: string = 'text' ): Channel {
        let channel: Channel;
        
        if( this.client === null ) {
            throw new Error( 'Client is not ready.' );
        }
    
        channel = this.client.channels.find( ch => ch.id === id );
        
        if( channel === null ) {
            throw new Error( 'No such channel. id = ' + id );
        } 
        
        if( channel.type !== type ) {
            throw new Error( 'Channel type is not met.' + channel.type + ' <-> ' + type );
        }
        
        return channel;
    }
    
    login( token: string ): Promise<void> {
        if( this.client === null ) {
            return this._login( token );
        } else {
            return this.logout()
            .then( () => this._login( token ) );
        }
    }
    
    logout(): Promise<void> {
        if( this.client !== null ) {
            return this._logout();            
        } else {
            return Promise.resolve();
        }
    }
    
    getGuildInfo(): GuildInfo[] {
        return this.client.guilds.map( guild => {
            return { 
                id: guild.id,
                name: guild.name,
                channels: guild.channels.map( channel => {
                    return {
                        id: channel.id,
                        name: channel.name,
                        type: channel.type
                    }
                } )
            }
        } );
    }
    
    post( textChannelId: string, message: string ): Promise<Message | Message[] > {
        let channel = this.getChannel( textChannelId, 'text' );
        return ( channel as TextChannel ).send( message );
    }
    
    postImage( textChannelId: string, image: Buffer, message: string = '' ): Promise<Message | Message[] > {
        let channel = this.getChannel( textChannelId, 'text' );
        return ( channel as TextChannel ).send( message, new Attachment( image ) );
    }
}
