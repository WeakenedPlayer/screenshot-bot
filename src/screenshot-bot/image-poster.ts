import * as Discord from 'discord.js';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Client, ClientComponent } from '../client';
import { ImageProvider } from '../image';

export class ImagePoster {
    private channel$: Observable<Discord.Channel>;
    private postObservable: Observable<void>;
    constructor( private src: ImageProvider, channel$: Observable<Discord.Channel> ) {
        this.channel$ = channel$.shareReplay( 1 );

        this.postObservable = this.src.image$
        .withLatestFrom( channel$ )
        .map( ( [ image, channel ]: [ string, any ] ) => {
            if( channel && channel.type === 'text' ) {
                // tscでエラーが出るのを防止するため、あえて "any" として扱う。
                // TextChannel 以外は無視(エラーは出さない)
                // console.log( '[image-poster] post' );
                channel.send( '', { file: { attachment: image } } );                
            } 
        } );
    }
    
    get post$(): Observable<void> {
        return this.postObservable;
    }
}
