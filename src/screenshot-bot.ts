import { ImageWatcher } from './image-watcher';
import { ImageLoader } from './image-loader';
import { ImagePoster } from './image-poster';

import { Observable, from, Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import * as path from 'path';

export class ScreenshotBot {
    private subscription: Subscription = null;
    constructor( private watcher: ImageWatcher,
                 private loader: ImageLoader,
                 private poster: ImagePoster ){
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
    
    start(): void {
        let post$ = this.watcher.image$.pipe(
                flatMap( src => from( this.post( src ) ) )
        );
        if( !this.subscription || this.subscription.closed ) {
            this.subscription = post$.subscribe();
        }
    }
    
    stop(): void {
        if( this.subscription && !this.subscription.closed ) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }
}
