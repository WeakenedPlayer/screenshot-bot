import { Observable, BehaviorSubject  } from 'rxjs';
import { Client, ClientComponent } from '../client';
import * as Discord from 'discord.js';

export class GuildObservable implements ClientComponent {
    private discordClient: Discord.Client = null;
    private subject: BehaviorSubject<{ [id:string]: Discord.Guild }>;
    private guilds: { [id:string]: Discord.Guild } = {};
    
    get guild$() { return this.subject.asObservable() }
    

    constructor( private client: Client ) {
        this.subject = new BehaviorSubject( this.guilds );
    }
    
    private update() {
        this.subject.next( this.guilds );
    }
    
    private onReady() {
        this.discordClient.guilds.map( ( guild ) => {
            this.guilds[ guild.id ] = guild;
        } );
        this.update();
    }
    
    private onGuildCreate( guild: Discord.Guild ) {
        console.log('create');
        this.guilds[ guild.id ] = guild;
        this.update();
    }

    private onGuildDelete( guild: Discord.Guild ) {
        console.log('delete');
        this.guilds[ guild.id ] = null;
        this.update();
    }
    
    private onGuildUpdate( oldGuild: Discord.Guild, newGuild: Discord.Guild ) {
        console.log('update');
        this.guilds[ newGuild.id ] = newGuild;
        this.update();
    }
    
    // called by Client
    onClientInit( discordClient: Discord.Client ) {
        this.discordClient = discordClient;
        this.client.registerListener( 'ready', () => { this.onReady() } );
        this.client.registerListener( 'guildCreate', ( guild: Discord.Guild ) => { this.onGuildCreate( guild ) } );
        this.client.registerListener( 'guildDelete', ( guild: Discord.Guild ) => { this.onGuildDelete( guild ) } );
        this.client.registerListener( 'guildUpdate', ( oldGuild: Discord.Guild, newGuild: Discord.Guild ) => { this.onGuildUpdate( oldGuild, newGuild ) } );
    }
    
    onClientDestroy() {
        this.guilds = {};
        this.update();
        this.discordClient = null;
    }
}
