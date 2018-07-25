import { Client, TextChannel, Guild } from 'discord.js';

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

export class DiscordClientService {
    private _connected: boolean = false;
    private _client: Client = null;
    constructor() {}

    connect( token: string ): Promise<void> {
        if( this._client !== null ) {
            return this.disconnect()
            .then( () => this.connect( token ) );
        }

        this._client = new Client();
        this._client.on( 'disconnect', () => this._connected = false );
        this._client.on( 'reconnecting', () => this._connected = false );
        this._client.on( 'ready', () => this._connected = true );
        this._client.on( 'resume', () => this._connected = true );
        
        return this._client.login( token )
        .then( token => {} );
    }
    
    disconnect(): Promise<void> {
        if( this._client !== null ) {
            return this._client.destroy()
            .then( () => {
                this._client = null;
            } );
        } else {
            return Promise.resolve();
        }
    }
    
    get connected(): boolean {
        return this._connected;
    }
    
    get client(): Client {
        return this._client;
    }
    
    get token(): string {
        let token = '';
        if( this._client ) {
            token = this._client.token;
        }
        return token;
    }
    
    getChannelById( id: string ): TextChannel {
        let channel: TextChannel = null;

        if( this.client !== null && this.client.channels ) {
            channel = this.client.channels.find( ch => ( ch.id === id && ch.type === TEXTCHANNEL_TYPE ) ) as TextChannel;
        }
        return channel;
    }

    getGuildInfo(): GuildInfo[] {
        let result: GuildInfo[] = [];

        if( this.client !== null && this.client.guilds ) {
            result = this.client.guilds.map( guild => {
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
        return result;
    }
}
