import { ImageProvider } from './image';
import { Observable, Subject } from 'rxjs';
import * as Path from 'path';

const sharp = require( 'sharp');
const extension = '.jpg';

export class JpegOutputOption {
    constructor(
            public quality: number = 80,
            public progressive: boolean = false,
            public chromaSubsampling: string ='4:2:0',
            public trellisQuantisation: boolean = false,
            public overshootDeringing: boolean = false,
            public optimizeScans : boolean = false,
            public force: boolean = true ) {}    
}

export class JpegConverterOption {
    constructor( public readonly workDirectory: string = '',
                 public readonly jpegOption: JpegOutputOption = new JpegOutputOption() ) {}
}

export class JpegConverter implements ImageProvider {
    private imageObservable: Observable<string>;
    private option$: Observable<JpegConverterOption>
    
    constructor( private src$: Observable<string>, option$: Observable<JpegConverterOption> ) {
        // Memo: option 最新値を何度も参照したいため、shareReplay で Cold化
        //       src$ は特にHot/Coldの影響を受けないため処置しない 
        this.option$ = option$.shareReplay( 1 );    
        this.imageObservable = this.src$
        .withLatestFrom( this.option$ )
        .flatMap( ( [ src, option ] ) => {
            // ファイル名
            let ext: string = Path.extname( src );
            let base: string = Path.basename( src, ext ) + extension;
            let dst: string =  Path.join( option.workDirectory, base );
            
            // 変換後のファイル名を出力するObservable
            return Observable.create( observer => {
                sharp( src )
                .jpeg( option.jpegOption )
                .toFile( dst, ( err, info ) => {
                    if( !err ) {
                        // Memo: 1回ごとに完了させる
                        observer.next( dst );
                        observer.complete();
                    } else {
                        console.warn( 'unable to convert.' );
                    }
                } );
            } ).map( () => dst );
        } );
    }
    
    get image$(): Observable<string> {
        return this.imageObservable;
    }
}
