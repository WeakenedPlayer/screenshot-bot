import { Observable } from 'rxjs';
import { Watcher } from '../watcher';
import { ImageProvider } from './image';

/* TENTATIVE: Watcherの制約上、フォルダ監視が常時有効なので、フィルタ機能を付ける */

export class ImageWatcher implements ImageProvider {
    private watcher: Watcher = null;
    private condition: Observable<boolean>;
    constructor( private filter: string, condition?: Observable<boolean> ) {
        this.watcher = new Watcher( filter );
        
        if( condition ) {
            this.condition = condition;
        } else {
            this.condition = Observable.of( true );
        }
    }

    get image$(): Observable<string> {
        /* condition が true だけ、ファイルの追加を通知する。 */
        return this.watcher.add$
//        .map( ( image ) => {
//            console.log( 'added: ' + image );
//            return image;
//        } )
        .withLatestFrom( this.condition )
        .filter( ( [ image, condition] )  => condition )
        .map( ( [ image, condition] ) => {
            return image;
        } );
    }
}
