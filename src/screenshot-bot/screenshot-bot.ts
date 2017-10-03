import { Observable, BehaviorSubject } from 'rxjs';
import { ImagePoster } from '.';
import { ScreenshotBotOption } from './screenshot-bot-option';
import { Bot } from '../bot';

export class ScreenshotBot extends Bot {
    private imagePoster: ImagePoster;
    get image$() { return this.imagePoster.image$ }

    private active: boolean;
    private channelId: string;
    private option: ScreenshotBotOption;
    
    private activeSubject = new BehaviorSubject<boolean>( false );
    private channelIdSubject = new BehaviorSubject<string>( '' );
    private optionSubject = new BehaviorSubject<ScreenshotBotOption>( new ScreenshotBotOption() ); 
    
    constructor(){
        super();
        this.imagePoster = new ImagePoster( this );
        this.init();
    }

    configure( option: ScreenshotBotOption ) {
        this.imagePoster.configureWatcher( option.filter, option.workDir, option.jpegOption );
        
        this.optionSubject.next( option );
    }
    
    startPostingTo( channelId: string ) {
        this.imagePoster.startPostingTo( channelId );
        
        // state
        this.activeSubject.next( true );
        this.channelIdSubject.next( channelId );
    }
    
    stopPostiong() {
        this.imagePoster.stopPosting();
        this.activeSubject.next( false );
    }
}
