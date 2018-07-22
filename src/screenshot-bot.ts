import { ImageWatcher } from './image-watcher';
import { ImageLoader } from './image-loader';
import { ImagePoster } from './image-poster';

import { Observable, from, Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import * as path from 'path';

export class ScreenshotBot {
    private post$: Observable<void>;
    private subscription: Subscription = null;
    constructor( private watcher: ImageWatcher,
                 private loader: ImageLoader,
                 private poster: ImagePoster ){
        this.post$ = this.watcher.image$.pipe(
                flatMap( src => from( this.post( src ) ) )
        );
    }
    
    private post( src: string ): Promise<void> {
        return this.loader.load( src )
        .then( img => {
            let message = this.message( src );
            let filename = this.filename( src );
            this.poster.postImage( img, message, filename );
        } );
    }
    
    protected message( src: string ): string {
        return '';
    }
    
    protected filename( src: string ): string {
        let basename = path.basename( src );
        return basename;
    }
    
    start(): Promise<void> {
        return this.watcher.start().then( () => {
            if( !this.subscription || this.subscription.closed ) {
                this.subscription = this.post$.subscribe();
            }
        } );
    }
    
    stop(): Promise<void> {
        return this.watcher.stop().then( () => {
            if( this.subscription && !this.subscription.closed ) {
                this.subscription.unsubscribe();
                this.subscription = null;
            }
        } )
    }
}
