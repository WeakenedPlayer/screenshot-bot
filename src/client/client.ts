import { Observable, BehaviorSubject  } from 'rxjs';
import { ClientState } from './client-state';
import * as Discord from 'discord.js';

export interface ClientComponent {
    onClientInit( discordClient: Discord.Client ): void;
    onClientDestroy(): void;
}

export class Client {
    private ready: boolean;
    private busy: boolean;
    private connected: boolean;
    private client: Discord.Client = null;
    private state: BehaviorSubject<ClientState> = new BehaviorSubject( new ClientState() );

    get state$(): Observable<ClientState> { return this.state.asObservable(); }

    private onReadyListener: any;
    private events: { [name:string]: boolean } = {};
    
    private components: ClientComponent[] = [];
    
    constructor() {}

    // stateの更新
    private updateState() {
        this.state.next( new ClientState( this.ready, this.busy, this.connected ) );
    }
    
    // clientの状態変化に伴うstateの変更
    private onReady() {
        // console.log( 'ready');
        this.ready = true;;
        this.busy = false;
        this.connected = true;
        return this.updateState();
    }
    
    private onDisconnect() {
        // console.log( 'disconnect' );
        this.busy = false;
        this.connected = false;
        this.updateState();
    }
    
    private onResume() {
        // console.log( 'resume');
        this.busy = false;
        this.connected = true;
        this.updateState();
    }
    
    private onReconnecting() {
        // console.log( 'reconnecting');
        this.busy = true;
        this.connected = false;
        this.updateState();
    }

    // ########################################################################
    // ClientComponentへ提供する機能
    // ########################################################################
    // ComponentがListenerを登録するのに使用する (onInitClientで使用すること)
    registerListener( event: string, callback: any ) {
        this.client.on( event, callback );
        this.events[ event ] = true;
        // console.log( 'add listener: ' + event)
    }
    
    protected addComponent( component: ClientComponent ) {
        this.components.push( component );
    }
    
    // ComponentにDiscord.Clientの初期化を伝える
    private onInitClient( client: Discord.Client ) {
        for( let component of this.components ) {
            component.onClientInit( client );
        }
    }
    
    // ComponentにDiscord.Clientの廃棄を伝える
    private onDestroyClient() {
        for( let component of this.components ) {
            component.onClientDestroy();
        }
    }
    // ########################################################################
    // call inside constructor
    protected init() {
        this.client = new Discord.Client();
        this.registerListener( 'ready', ()=>{ this.onReady() } );
        this.registerListener( 'disconnect', ()=>{ this.onDisconnect() } );
        this.registerListener( 'resume', ()=>{ this.onResume() } );
        this.registerListener( 'reconnecting', ()=>{ this.onReconnecting() } );
        this.onInitClient( this.client );
        // init state
        this.busy = false;
        this.ready = false;
        this.connected = false;
        this.updateState();
    }
    
    private destroy() {
        for( let event in this.events ) {
            // console.log( 'remove listener: ' + event );
            this.client.removeAllListeners( event );
        }
        this.onDestroyClient();
    }

    login( token: string ): Promise<string> {
        if( this.busy ) {
            return Promise.reject( 'client is busy.' );
        }
        this.busy = true;
        this.updateState();
        // console.log( 'login started...');
        return this.client.login( token );
    }

    logout(): Promise<void> {
        if( this.busy ) {
            return Promise.reject( 'client is busy.' );
        }
        // console.log( 'logout started...');
        this.busy = true;
        this.updateState();
        this.destroy();
        return this.client.destroy()
        .then( ()=>{
            this.init();
            return Promise.resolve();
        } );
    }
}
