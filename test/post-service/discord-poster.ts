import { Poster } from './common';
import { Client, OAuth2Application, Guild, Channel, TextChannel, Attachment, Message } from 'discord.js';

const TEXTCHANNEL_TYPE = 'text';

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

export class DiscordPoster implements Poster {
    private token: string = '';
    private channelId: string = '';
    private _connected: boolean = false;

    private client: Client = null;
    private channel: TextChannel = null;
    private app: OAuth2Application = null;
    constructor() {}

    private updateChannel() {
        let id = this.channelId;
        let channel: Channel;
        this.channel = null;
        
        if( this.client !== null && this.client.channels ) {
            channel = this.client.channels.find( ch => ( ch.id === id && ch.type === TEXTCHANNEL_TYPE ) );
        }
        
        this.channel = channel as TextChannel;
    }
    
    setChannel( id: string ): void {
        this.channelId = id;
        this.updateChannel();
    } 
    
    getGuildInfo(): GuildInfo[] {
        return this.client.guilds.map( guild => {
            return { 
                id: guild.id,
                name: guild.name,
                channels: guild.channels
                    .filter( channel => channel.type === TEXTCHANNEL_TYPE )
                    .map( channel => {
                        return {
                            id: channel.id,
                            name: channel.name,
                            type: channel.type
                        }
                    } )
            }
        } );
    }
    
    setToken( token: string ): void {
        this.token = token;
    }
    
    connect(): Promise<void> {
        if( this.client !== null ) {
            return this.disconnect()
            .then( () => this.connect() );
        }

        this.client = new Client();
        this.client.on( 'disconnect', () => this._connected = false );
        this.client.on( 'reconnecting', () => this._connected = false );
        this.client.on( 'ready', () => this._connected = true );
        this.client.on( 'resume', () => this._connected = true );
        
        return this.client.login( this.token )
        .then( token => {
            return this.client.fetchApplication();
        } ).then( app => {
            this.app = app;
            this.updateChannel();
        } );
    }
    
    disconnect(): Promise<void> {
        if( this.client !== null ) {
            return this.client.destroy()
            .then( () => {
                this.app = null;
                this.client = null;
                this.channel = null;
            } );
        } else {
            return Promise.resolve();
        }
    }
    
    get connected(): boolean {
        return this._connected;
    }
    
    post( message: string ): Promise<void> {
        if( !this.channel ) {
            throw new Error( 'Channel is not specified.' );
        }
        return this.channel.send( message )
        .then( () => {} );
    }
    
    postImage( image: Buffer, message: string = '', filename?: string ): Promise<void> {
        if( !this.channel ) {
            throw new Error( 'Channel is not specified.' );
        }
        return this.channel.send( message, new Attachment( image, filename )  )
        .then( () => {} );
    }
}
