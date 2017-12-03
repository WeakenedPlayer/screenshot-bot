import { ImageProvider } from '../image';
import { ImageConverter, ImageConverterOption } from './image-converter';
import { Observable, Subject, Observer } from 'rxjs';
import * as Path from 'path';
const extension = '.jpg';

const fs = require('fs');
const JPG = require('jpeg-js');
var PNG = require('pngjs').PNG;

export class Png2JpgConverterOption extends ImageConverterOption {
    constructor( public readonly workDirectory: string = '',
                 public readonly quality = 80,
                 public readonly maxRetry = 5,
                 public readonly retryInterval = 200 ) {
        super( maxRetry, retryInterval );
    }
}

export class Png2JpgConverter extends ImageConverter {
    constructor( src$: Observable<string>, option$: Observable<Png2JpgConverterOption> ) {
        super( src$, option$ );
    }
    
    protected convert( src: string, option: Png2JpgConverterOption ): Promise<string> {
        let ext: string = Path.extname( src );
        let base: string = Path.basename( src, ext ) + extension;
        let dst: string =  Path.join( option.workDirectory, base );
        
        return new Promise( ( resolve, reject ) => {
            try {
                let data = fs.readFileSync( src );
                let png = PNG.sync.read( data );
                
                
                let rawImageData = {
                    data: png.data,
                    width: png.width,
                    height: png.height,
                    buffetrType: 'rgba'
                };

                let jpg = JPG.encode( rawImageData );
                let stream = fs.createWriteStream( dst );
                stream.write( jpg.data, option.quality );
                resolve( dst );
            } catch( err ) {
                reject( err );
            }
        } );
    }
}
