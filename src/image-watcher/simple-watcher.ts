import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { Watcher, WatcherOption } from '@weakenedplayer/watcher';
import { ImageWatcher } from './image-watcher';
import * as path from 'path';

export interface ImageWatcherOption {
    filter: string;
    interval: number;
    threshold: number;
}

export class SimpleWatcher implements ImageWatcher {
    private watcher: Watcher;
    private filter: string;
    constructor( private readonly option: ImageWatcherOption ) {
        this.filter = this.option.filter.split( path.sep ).join( '/' );
        this.watcher = new Watcher( { pollInterval: this.option.interval, stabilityThreshold: this.option.threshold } );
    }
    
    start(): Promise<void> {
        return this.watcher.watch( this.filter );
    }
    
    stop(): Promise<void> {
        this.watcher.unwatch();
        return Promise.resolve();
    }
    
    get image$(): Observable<string> {
        return this.watcher.add$.pipe( share() );
    }
}
