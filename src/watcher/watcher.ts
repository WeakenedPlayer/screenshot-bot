import { FSWatcher, watch } from 'chokidar';
import { Observable, BehaviorSubject } from 'rxjs';

export class Watcher {
    private watcher: FSWatcher = null;
    private observable: Observable<string>;
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
                this.watcher.removeListener( event, listener );
            } );
        } ).publish().refCount();
    }
    
    constructor( private path: string ) {
        this.watcher = watch( this.path, {
            ignoreInitial: true,
            followSymlinks: false,
            persistent: true, // 継続的にモニタする
            awaitWriteFinish: {
                stabilityThreshold: 1000,
                pollInterval: 200
              },
        });
        this.addObservable = this.toObservable( 'add' ).publish().refCount();
        this.changeObservable = this.toObservable( 'change' ).publish().refCount();
        this.unlinkObservable = this.toObservable( 'unlink' ).publish().refCount();
        this.addDirObservable = this.toObservable( 'addDir' ).publish().refCount();
        this.unlinkDirObservable = this.toObservable( 'unlinkDir' ).publish().refCount();
    }
}
