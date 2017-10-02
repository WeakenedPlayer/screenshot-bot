import { ImageConverter } from './image';
import { Observable } from 'rxjs';
import { JpegOutputOption } from './jpeg-output-option';
import * as Path from 'path';

const sharp = require( 'sharp');
const extension = '.jpg';

export class JpegConverter implements ImageConverter {
    private observable: Observable<string>;
    
    constructor( private readonly workDir: string, private options: JpegOutputOption ) {}
    
    private dstPath( src: string ): string {
        let ext: string = Path.extname( src );
        let base: string = Path.basename( src, ext ) + extension;
        return Path.join( this.workDir, base );
    }
    
    convert( src: string ): Observable<string> {
        return Observable.create( observer => {
            let dst = this.dstPath( src );
            sharp( src )
            .jpeg( this.options )
            .toFile( dst, ( err, info ) => {
                if( !err ) {
                    observer.next( dst );
                } else {
                    observer.error( err );
                }
            } );
        } ); 
    }
}