import { Observable, BehaviorSubject  } from 'rxjs';
import { Client, ClientComponent } from '../client';
import * as Discord from 'discord.js';

class ChannelSubject<CHANNEL extends Discord.DMChannel | Discord.Channel | Discord.TextChannel | Discord.VoiceChannel | Discord.GroupDMChannel> {
    private subject = new BehaviorSubject<{ [id:string]: CHANNEL }>( null );
    private channels: { [id:string]: CHANNEL } = {};
    get channel$() { return this.subject.asObservable(); }
    
    constructor( private readonly type: string ){}
    
    add( channel:  Discord.Channel ) {
        if( channel.type === this.type ) {
            this.channels[ channel.id ] = channel as CHANNEL;
            this.next();
        }
    }
    
    delete( channel:  Discord.Channel ) {
        if( channel.type === this.type ) {
            this.channels[ channel.id ] = null;
            this.next();
        }
    }
    
    update( channel:  Discord.Channel ) {
        if( channel.type === this.type ) {
            this.channels[ channel.id ] = channel as CHANNEL;
            this.next();
        }
    }
    
    clear() {
        this.channels = {};
        this.next();
    }
    
    private next() {
        this.subject.next( this.channels );
    }
}

export class ChannelObservable implements ClientComponent {
    private discordClient: Discord.Client = null;
    private dmChannel = new ChannelSubject<Discord.DMChannel>( 'dm' );
    private groupDmChannel = new ChannelSubject<Discord.GroupDMChannel>( 'group' );
    private textChannel = new ChannelSubject<Discord.TextChannel>( 'text' );
    private voiceChannel = new ChannelSubject<Discord.VoiceChannel>( 'voice' );

    get dmChannel$() { return this.dmChannel.channel$; }
    get groupDmChannel$() { return this.groupDmChannel.channel$; }
    get textChannel$() { return this.textChannel.channel$; }
    get voiceChannel$() { return this.voiceChannel.channel$; }
    
    constructor( private client: Client ) {}
    
    private onReady() {
        this.discordClient.channels.map( ( channel: Discord.Channel ) => {
            this.dmChannel.add( channel );
            this.groupDmChannel.add( channel );
            this.textChannel.add( channel );
            this.voiceChannel.add( channel );
        } );
    }
    
    private onChannelCreate( channel: Discord.Channel ) {
        this.dmChannel.add( channel );
        this.groupDmChannel.add( channel );
        this.textChannel.add( channel );
        this.voiceChannel.add( channel );
    }

    private onChannelDelete( channel: Discord.GuildChannel ) {
        this.dmChannel.delete( channel );
        this.groupDmChannel.delete( channel );
        this.textChannel.delete( channel );
        this.voiceChannel.delete( channel );
    }
    
    private onChannelUpdate( oldChannel: Discord.Channel, newChannel: Discord.Channel ) {
        this.dmChannel.add( newChannel );
        this.groupDmChannel.add( newChannel );
        this.textChannel.add( newChannel );
        this.voiceChannel.add( newChannel );
    }
    // --------------------------------------------------------------------------------------------
    // called by client
    // --------------------------------------------------------------------------------------------
    onClientInit( discordClient: Discord.Client ) {
        this.discordClient = discordClient;
        this.client.registerListener( 'ready', () => { this.onReady() } );
        this.client.registerListener( 'channelCreate', ( channel: Discord.GuildChannel ) => { this.onChannelCreate( channel ) } );
        this.client.registerListener( 'channelDelete', ( channel: Discord.GuildChannel ) => { this.onChannelDelete( channel ) } );
        this.client.registerListener( 'channelUpdate', ( oldChannel: Discord.GuildChannel, newChannel: Discord.GuildChannel ) => { this.onChannelUpdate( oldChannel, newChannel ) } );
    }

    onClientDestroy() {
        this.dmChannel.clear();
        this.groupDmChannel.clear();
        this.textChannel.clear();
        this.voiceChannel.clear();
        this.discordClient = null;
    }
}
