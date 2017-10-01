import { Client } from '../client';
import { ChannelObservable, GuildObservable, OAuth2AppObservable, ImagePoster, JpegOutputOption, Channel, Guild, OAuth2App } from '.';
import { Observable, BehaviorSubject } from 'rxjs';

export class ScreenshotBotState {
    constructor( 
        public readonly started: boolean,
        public readonly channelId: string,
        public readonly option: ScreenshotBotOption ) {}
}

export class ScreenshotBotOption {
    constructor( public readonly filter: string,
                 public readonly workDir: string,
                 public readonly jpegOption?: JpegOutputOption ) {}
}

export class ScreenshotBot extends Client {
    private channelObservable: ChannelObservable;
    private guildObservable: GuildObservable;
    private appObservable: OAuth2AppObservable;
    private imagePoster: ImagePoster;
    private stateSubject: BehaviorSubject<ScreenshotBotState>;

    get channel$() { return this.channelObservable.channel$; }
    get guild$() { return this.guildObservable.guild$; } 
    get app$() { return this.appObservable.app$; }
    get image$() { return this.imagePoster.image$ }
    get screenBotState$() { return this.stateSubject.asObservable() }

    private started: boolean;
    private channelId: string;
    private option: ScreenshotBotOption;
    
    private update() { 
        this.stateSubject.next( new ScreenshotBotState ( this.started, this.channelId, this.option ) );
    }
    
    constructor(){
        super();
        this.channelObservable = new ChannelObservable( this );
        this.guildObservable = new GuildObservable( this );
        this.appObservable = new OAuth2AppObservable( this );
        this.imagePoster = new ImagePoster( this );

        this.addComponent( this.channelObservable );
        this.addComponent( this.guildObservable );
        this.addComponent( this.appObservable );
        this.addComponent( this.imagePoster );
        this.init();
        
        // state
        this.started = false;
        this.channelId = '';
        this.option = null;
        this.stateSubject = new BehaviorSubject( new ScreenshotBotState ( this.started, this.channelId, this.option ) );
        this.update();
    }

    configure( option: ScreenshotBotOption ) {
        this.imagePoster.configureWatcher( option.filter, option.workDir, option.jpegOption );
        
        // state
        this.option = option;
        this.update();
    }
    
    startPostingTo( channelId: string ) {
        this.imagePoster.startPostingTo( channelId );
        
        // state
        this.started = true;
        this.channelId = channelId;
        this.update();
    }
    
    stopPostiong() {
        this.imagePoster.stopPosting();

        // state
        this.started = false;
        this.update();
    }
}
