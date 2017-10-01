import { Observable, BehaviorSubject } from 'rxjs';
import { ImagePoster, JpegOutputOption } from '.';
import { Bot } from '../bot';

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

export class ScreenshotBot extends Bot {
    private imagePoster: ImagePoster;
    private stateSubject: BehaviorSubject<ScreenshotBotState>;

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
        this.imagePoster = new ImagePoster( this );
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
