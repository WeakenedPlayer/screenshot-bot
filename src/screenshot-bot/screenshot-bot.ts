import * as Discord from 'discord.js'
import { Observable, BehaviorSubject } from 'rxjs';
import { ImagePoster, ImageSource } from '.';
import { JpegConverterOption } from '../image';
import { Bot } from '../bot';

export { JpegConverterOption };

// 投稿開始のたびに最後の画像が投稿されてしまう問題修正

export class ScreenshotBot extends Bot {
    private soruce: ImageSource;
    private poster: ImagePoster;

    // input observables
    private filter$: BehaviorSubject<string>;
    private gate$: BehaviorSubject<boolean>;
    private option$: BehaviorSubject<JpegConverterOption>;
    private channel$: BehaviorSubject<Discord.Channel>;

    // output observables
    get image$() { return this.soruce.image$ }
    get post$() { return this.poster.post$ }
    
    constructor(){
        super();
        // input observables
        this.filter$  = new BehaviorSubject( '' );
        this.option$  = new BehaviorSubject( new JpegConverterOption( '' ) );
        this.channel$ = new BehaviorSubject( null );
        this.gate$ = new BehaviorSubject( false );
        
        // image posting
        this.soruce   = new ImageSource( this.filter$, this.option$, this.gate$ );
        this.poster   = new ImagePoster( this.soruce, this.channel$ );

        // initialize sub modules
        this.init();
    }

    set filter( value: string ) {
        this.filter$.next( value );
    }

    set option( value: JpegConverterOption ) {
        this.option$.next( value );
    }
    
    set channelId( value: string ) {
        let channel = this.client.channels.find( 'id', value );
        if( channel ) {
            this.channel$.next( channel );
        }
    }
    
    set isActive( value: boolean ) {
        this.gate$.next( value );
    }
    
    startPosting() {
        this.isActive = true;
    }
    
    stopPostiong() {
        this.isActive = false;
    }
}
