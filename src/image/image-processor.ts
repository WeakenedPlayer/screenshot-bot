import { Observable, Observer } from 'rxjs';
import { ImageProvider } from './image';

/* ############################################################################
 * オプション
 * ######################################################################### */
export class ImageProcessorOption {
    constructor( public readonly maxRetry: number,
                 public readonly retryInterval: number ) {}
}

/* ############################################################################
 * リトライ付きで画像変換を行うクラス(具体的な処理は隠蔽)
 * ######################################################################### */
export abstract class ImageProcessor implements ImageProvider {
    private imageObservable: Observable<string>;
    private option$: Observable<ImageProcessorOption>;
    get image$(): Observable<string> { return this.imageObservable }
    constructor( private src$: Observable<string>, option$: Observable<ImageProcessorOption> ) {
        this.option$ = option$.shareReplay( 1 );
        this.imageObservable = this.src$
        .withLatestFrom( this.option$ )
        .flatMap( ( [ src, option ] ) => {
            // リトライ付き画像変換のひと固まりを Observable として返す
            let retryCount = 0;
            let convert$: Observable<string> = Observable.create( ( observer: Observer<Observable<string>> ) => {
                this.process( src, option )
                .then( ( dst ) => {
                    // Memo: 1回ごとに完了させることで購読を終了させる
                    observer.next( Observable.of( dst ) );
                    observer.complete();
                } , ( err ) => {
                    // ディレイ付きリトライ
                    if( retryCount < option.maxRetry ) {
                        retryCount++;
                        console.warn( 'Unable to convert \"' + src + '\". Retry: ' + retryCount + '/' + option.maxRetry );
                        observer.next( Observable.timer( option.retryInterval ).flatMap( () => convert$ ) );
                    } else {
                        // リトライNG
                        console.warn( 'Unable to convert. Exceed retry count of ' + option.maxRetry );
                        observer.complete();
                    }
                } );
            } ).flatMap( dst => dst );
            
            return convert$;
        } );
    }
    
    protected abstract process( src: string, option: ImageProcessorOption ): Promise<string>;
}