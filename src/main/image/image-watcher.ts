import { Observable } from 'rxjs';
import { Watcher } from '../watcher';
import { ImageProvider } from './image';

export class ImageWatcher implements ImageProvider {
    private watcher: Watcher = null;
    constructor( private filter: string ) {
        this.watcher = new Watcher( filter );
    }

    get image$(): Observable<string> {
        return this.watcher.add$;
    }
}
