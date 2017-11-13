import { ImageWatcher, JpegConverter, ImageProvider, JpegConverterOption, JpegOutputOption } from '../image';
import { Subject, Subscription, Observable } from 'rxjs';

export interface ImagePosterOption {
    workDirectory: string;
    jpegOption?: JpegOutputOption;
}

export class ImageSource implements ImageProvider {
    private watcher: ImageWatcher;
    private converter: JpegConverter;
    private gate$: Observable<boolean>;
    private imageObservable: Observable<string>;

    constructor( filter$: Observable<string>, jpegOption$: Observable<JpegConverterOption>, gate$: Observable<boolean> ) {
        // filter$: 購読時に watcher に最後の1回を渡したいので shareReplay で Cold observable に変換
        this.watcher = new ImageWatcher( filter$.shareReplay( 1 ) );

        // jpegOption$$: 購読時に converter に最後の1回を渡したいので shareReplay で Cold observable に変換
        this.converter = new JpegConverter( this.watcher.image$, jpegOption$.shareReplay( 1 ) );
        
        // Memo: takeUntil を正しく機能させるために、Hot observable に変換 
        this.gate$ = gate$.share().distinctUntilChanged();
        
        this.imageObservable = this.gate$.filter( gate => gate )
        .flatMap( ( gate ) => {
            return this.converter.image$.takeUntil( this.gate$ );
        } );
    }
    
    get image$(): Observable<string> {
        return this.imageObservable;
    }
}