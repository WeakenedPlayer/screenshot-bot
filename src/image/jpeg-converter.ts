import { ImageProvider } from './image';
import { Observable } from 'rxjs';
import { JpegOutputOption } from './jpeg-output-option';
import * as Path from 'path';

const sharp = require( 'sharp');
const extension = '.jpg';

export interface JpegConverterOption {
    workDirectory: string;
    jpegOption?: JpegOutputOption
}

export class JpegConverter implements ImageProvider {
    private imageObservable: Observable<string>;

    constructor( private src: ImageProvider, private option$: Observable<JpegConverterOption> ) {
        this.imageObservable = this.src.image$
        .withLatestFrom( this.option$ )
        .flatMap( ( [ src, option ] ) => {
            // ファイル名
            let ext: string = Path.extname( src );
            let base: string = Path.basename( src, ext ) + extension;
            let dst: string =  Path.join( option.workDirectory, base );
            
            // 変換後のファイル名を出力するObservable (shareでHotにする)
            return Observable.create( observer => {
                sharp( src )
                .jpeg( option.jpegOption )
                .toFile( dst, ( err, info ) => {
                    if( !err ) {
                        // Memo: 1回ごとに完了させる(うまくいくか不明)
                        observer.next( dst );
                        observer.complete();
                    } else {
                        observer.error( err );
                    }
                } );
            } ).map( () => dst ).share();
        } );
    }
    
    get image$(): Observable<string> {
        return this.imageObservable;
    }
}
