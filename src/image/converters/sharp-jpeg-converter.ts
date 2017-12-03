import { ImageProvider } from '../image';
import { ImageConverter, ImageConverterOption } from './image-converter';
import { Observable, Subject, Observer } from 'rxjs';
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

export class JpegConverterOption extends ImageConverterOption {
    constructor( public readonly workDirectory: string = '',
                 public readonly jpegOption: JpegOutputOption = new JpegOutputOption(),
                 public readonly maxRetry = 5,
                 public readonly retryInterval = 200 ) {
        super( maxRetry, retryInterval );
    }
}

export class JpegConverter extends ImageConverter {
    constructor( src$: Observable<string>, option$: Observable<JpegConverterOption> ) {
        super( src$, option$ );
    }
    
    protected convert( src: string, option: JpegConverterOption ): Promise<string> {
        let ext: string = Path.extname( src );
        let base: string = Path.basename( src, ext ) + extension;
        let dst: string =  Path.join( option.workDirectory, base );
    
        return new Promise( ( resolve, reject ) => { 
            sharp( src )
            .jpeg( option.jpegOption )
            .toFile( dst, ( err, info ) => {
                if( !err ) {
                    console.log( dst );
                    resolve( dst );
                } else {
                    reject( err );
                }
            } );
        } );
    }
}
