import { Client, OAuth2Application, Guild, Channel, TextChannel, Attachment, Message } from 'discord.js';
import { DiscordClientProvider } from './discord-client-provider';

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

export class DiscordChannelProvider {
    private _channel: TextChannel = null;
    constructor( private provider: DiscordClientProvider ) {}

    selectById( id: string ): TextChannel {
        let client: Client = this.provider.client;
        let channel: TextChannel = null;

        if( client !== null && client.channels ) {
            channel = client.channels.find( ch => ( ch.id === id && ch.type === TEXTCHANNEL_TYPE ) ) as TextChannel;
        }

        this._channel = channel;
        return this._channel;
    }

    get channel(): TextChannel {
        return this._channel;
    }
    
    getGuildInfo(): GuildInfo[] {
        let client: Client = this.provider.client;
        let result: GuildInfo[] = [];

        if( client !== null && client.guilds ) {
            result = this.provider.client.guilds.map( guild => {
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
