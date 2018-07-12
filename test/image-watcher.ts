import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { Watcher, WatcherOption } from '@weakenedplayer/watcher';
import { ImageSource } from './common';
import * as path from 'path';

export class ImageWatcher implements ImageSource {
    private watcher: Watcher;
    constructor() {
        this.watcher = new Watcher();
    }
    start( filter: string ): Promise<void> {
        let posix = filter.split( path.sep ).join( '/' );
        return this.watcher.watch( posix );
    }
    stop(): Promise<void> {
        this.watcher.unwatch();
        return Promise.resolve();
    }
    get image$(): Observable<string> {
        return this.watcher.add$.pipe( share() );
    }
}
