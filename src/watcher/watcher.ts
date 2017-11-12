import { FSWatcher, watch } from 'chokidar';
import { Observable, BehaviorSubject } from 'rxjs';

export class Watcher {
    private watcher: FSWatcher = null;

    private addObservable: Observable<string>;
    private changeObservable: Observable<string>;
    private unlinkObservable: Observable<string>;
    private addDirObservable: Observable<string>;
    private unlinkDirObservable: Observable<string>;

   
    get add$(): Observable<string> { return this.addObservable }
    get change$(): Observable<string> { return this.changeObservable }
    get unlink$(): Observable<string> { return this.unlinkObservable }
    get addDir$(): Observable<string> { return this.addDirObservable }
    get unlinkDir$(): Observable<string> { return this.unlinkDirObservable }

    private toObservable( event: string ): Observable<string> {
        return Observable.create( ( observer ) => {
            let listener = ( ( src: string ) => {
                observer.next( src );
            } );

            // add listener
            this.watcher.on( event, listener );

            // remove listener when unsubscribe
            return ( () => {
                console.log( 'Watcher: Event removed.' );
                this.watcher.removeListener( event, listener );
            } );
        } ).publish().refCount();
    }
    
    constructor( private path: string ) {
        /* TENATIVE: この時点で監視を開始している。
         * 一つのWatcherで1つの対象しか監視しない前提で作成する。(外部のFSWatcherを使うDIに変更すべきかも)
         * */
        this.watcher = watch( this.path, {
            ignoreInitial: true,
            followSymlinks: false,
            persistent: true, // 継続的にモニタする
            awaitWriteFinish: {
                stabilityThreshold: 1000,
                pollInterval: 200
              },
        } );
        
        this.addObservable = this.toObservable( 'add' );
        this.changeObservable = this.toObservable( 'change' );
        this.unlinkObservable = this.toObservable( 'unlink' );
        this.addDirObservable = this.toObservable( 'addDir' );
        this.unlinkDirObservable = this.toObservable( 'unlinkDir' );
    }
    
    unwatch( path: string ) {
        this.watcher.unwatch( path );      
    }

    watch( path: string ) {
        this.watcher.add( path );
    }
}
