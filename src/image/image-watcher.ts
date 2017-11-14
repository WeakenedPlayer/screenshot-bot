import { Observable } from 'rxjs';
import { Watcher } from '../watcher';
import { ImageProvider } from './image';

import { logger } from '../log';

export class ImageWatcher implements ImageProvider {
    private watcher: Watcher = new Watcher('');
    private watcher$: Observable<string>;
    private lastFilter: string = '';
    private filter$: Observable<string>;
    constructor( filter$: Observable<string> ) {
        // Hot Observableに変換
        this.filter$ = filter$.share();

        this.watcher$ = this.filter$.flatMap( filter => {
            logger.log( '[image-watcher] Watching ' + filter );
            
            this.watcher.unwatch( this.lastFilter );
            this.watcher.watch( filter );
            this.lastFilter = filter;
            // Memo: Observable は 完了条件が成立しない限り購読が止まらないので、
            //       繰り返すと同じ購読が増えてしまう。
            //       ここでは、takeUntil で完了させるようにしている。
            //       なお、 filter$ は Hot Observable でないと、購読した瞬間に止まってしまう。
            return this.watcher.add$.takeUntil( this.filter$ );
        } );
    }

    get image$(): Observable<string> {
        // console.log( '[image-watcher] image$' );
        return this.watcher$;
    }
}
