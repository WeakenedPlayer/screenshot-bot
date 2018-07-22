import { Client } from 'discord.js';

export class DiscordClientProvider {
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
        .then( token => {
            console.log( 'hi' )
        } );
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
}
