import { Observable, BehaviorSubject  } from 'rxjs';
import { Client, ClientComponent } from '../client';
import * as Discord from 'discord.js';

export class OAuth2ApplicationObservable implements ClientComponent {
    private discordClient: Discord.Client = null;
    private subject: BehaviorSubject<Discord.OAuth2Application>;
    private app: Discord.OAuth2Application = null;
    
    get app$() { return this.subject.asObservable() }

    constructor( private client: Client ) {
        this.subject = new BehaviorSubject( this.app );
    }
    
    private update() {
        this.subject.next( this.app );
    }
    
    private onReady() {
        this.discordClient.fetchApplication()
        .then( ( app: Discord.OAuth2Application ) => {
            this.app = app;
            this.update();
        } );
    }
    
    // called by Client
    onClientInit( discordClient: Discord.Client ) {
        this.discordClient = discordClient;
        this.client.registerListener( 'ready', () => { this.onReady() } );
    }
    
    onClientDestroy() {
        this.app = null;
        this.update();
        this.discordClient = null;
    }
}
