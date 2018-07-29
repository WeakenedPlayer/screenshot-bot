import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { share, flatMap } from 'rxjs/operators';
import { Watcher, WatcherOption } from '@weakenedplayer/watcher';
import { ImageWatcher } from './image-watcher';
import * as path from 'path';

export interface ImageWatcherParameter {
    interval: number;
    threshold: number;
}

const defaultParam: ImageWatcherParameter = {
    interval: 200,
    threshold: 2000
}

export class SimpleWatcher implements ImageWatcher {
    private watcher: Watcher = null;
    private imageSubject: BehaviorSubject<Observable<string>>;
    private imageObservable: Observable<string>;
    constructor() {
        this.imageSubject = new BehaviorSubject( new Subject() );
        this.imageObservable = this.imageSubject.pipe( flatMap( subject => subject ), share() );
    }
    
    watch( filter: string, option: ImageWatcherParameter = defaultParam ): Promise<void> {
        if( this.watcher ) {
            this.watcher.unwatch();
        }
        this.watcher = new Watcher();
        
        let normalizedFilter = filter.split( path.sep ).join( '/' );
        return this.watcher.watch( normalizedFilter, { pollInterval: option.interval, stabilityThreshold: option.threshold } ).then( () => {
            this.imageSubject.next( this.watcher.add$ );
        } );
    }
    
    unwatch(): Promise<void> {
        if( this.watcher ) {
            this.watcher.unwatch();
            this.watcher = null;
        }
        return Promise.resolve();
    }

    get image$(): Observable<string> {
        return this.imageObservable;
    }
}
