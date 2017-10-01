import { Observable, BehaviorSubject  } from 'rxjs';
import { Client, ClientComponent } from '../client';
import * as Discord from 'discord.js';

export class OAuth2App {
    constructor( 
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly iconUrl: string,
        public readonly isPublic: boolean
    ){}
}

export class OAuth2AppObservable implements ClientComponent {
    private discordClient: Discord.Client = null;
    private subject: BehaviorSubject<OAuth2App>;
    private app: OAuth2App = null;
    
    get app$() { return this.subject.asObservable() }
    
    fromApp( app: Discord.OAuth2Application ): OAuth2App {
        return new OAuth2App( app.id, app.name, app.description, app.iconURL, app.botPublic );
    }

    constructor( private client: Client ) {
        this.subject = new BehaviorSubject( this.app );
    }
    
    private update() {
        this.subject.next( this.app );
    }
    
    private onReady() {
        this.discordClient.fetchApplication()
        .then( ( app ) => {
            this.app = this.fromApp( app ); 
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
