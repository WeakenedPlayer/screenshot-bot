import { Observable, BehaviorSubject  } from 'rxjs';
import { Client, ClientComponent } from '../client';
import * as Discord from 'discord.js';

export class Channel {
    constructor( 
            public readonly id: string,
            public readonly name: string,
            public readonly guildId: string
    ){}
}

export class ChannelObservable implements ClientComponent {
    private discordClient: Discord.Client = null;
    private subject: BehaviorSubject<{ [id:string]: Channel }>;
    private channels: { [id:string]: Channel } = {};
    
    get channel$() { return this.subject.asObservable() }
    
    fromChannel( channel: Discord.GuildChannel ): Channel {
        return new Channel( channel.id, channel.name, channel.guild.id );
    }

    constructor( private client: Client ) {
        this.subject = new BehaviorSubject( this.channels );
    }
    
    private update() {
        this.subject.next( this.channels );
    }
    
    private onReady() {
        this.discordClient.channels.map( ( channel: Discord.Channel ) => {
            if( channel.type === 'text' ) {
                this.channels[ channel.id ] = this.fromChannel( channel as Discord.GuildChannel );
            }
        } );
        this.update();
    }
    
    private onChannelCreate( channel: Discord.GuildChannel ) {
        console.log('create');
        this.channels[ channel.id ] = this.fromChannel( channel );
        this.update();
    }

    private onChannelDelete( channel: Discord.GuildChannel ) {
        console.log('delete');
        this.channels[ channel.id ] = null;
        this.update();
    }
    
    private onChannelUpdate( oldChannel: Discord.GuildChannel, newChannel: Discord.GuildChannel ) {
        // same as create
        console.log('update');
        this.channels[ newChannel.id ] = this.fromChannel( newChannel );
        this.update();
    }
    
    // called by Client
    onClientInit( discordClient: Discord.Client ) {
        this.discordClient = discordClient;
        this.client.registerListener( 'ready', () => { this.onReady() } );
        this.client.registerListener( 'channelCreate', ( channel: Discord.GuildChannel ) => { this.onChannelCreate( channel ) } );
        this.client.registerListener( 'channelDelete', ( channel: Discord.GuildChannel ) => { this.onChannelDelete( channel ) } );
        this.client.registerListener( 'channelUpdate', ( oldChannel: Discord.GuildChannel, newChannel: Discord.GuildChannel ) => { this.onChannelUpdate( oldChannel, newChannel ) } );
    }
    
    onClientDestroy() {
        this.channels = {};
        this.update();
        this.discordClient = null;
    }
}
