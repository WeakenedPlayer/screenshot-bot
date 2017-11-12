import { Observable } from 'rxjs';
import { Watcher } from '../watcher';
import { ImageProvider } from './image';

export class ImageWatcher implements ImageProvider {
    private watcher: Watcher = new Watcher('');
    private watcher$: Observable<string>;
    private lastFilter: string = '';
    constructor( private filter$: Observable<string> ) {
        // Memo: 最後のObservable を共有できるよう shareReplay にしている。
        this.watcher$ = this.filter$.flatMap( filter => {
            console.log( 'Unwatch: ' + this.lastFilter );
            this.watcher.unwatch( this.lastFilter );
            this.watcher.watch( filter );
            this.lastFilter = filter;
            // Memo: Observable は 完了条件が成立しない限り購読が止まらないので、
            //       繰り返すと同じ購読が増えてしまう。
            //       ここでは、takeUntil で完了させるようにしている。
            return this.watcher.add$.takeUntil( this.filter$ );
        } ).shareReplay( 1 );
    }

    get image$(): Observable<string> {
        return this.watcher$;
    }
}
