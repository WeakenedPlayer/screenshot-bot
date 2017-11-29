import { ImageProvider } from './image';
import { ImageProcessor, ImageProcessorOption } from './image-processor';
import { Observable, Subject, Observer } from 'rxjs';
import * as Path from 'path';
const extension = '.jpg';

const fs = require('fs');
const JPG = require('jpeg-js');
var PNG = require('pngjs').PNG;

export class Png2JpgConverterOption extends ImageProcessorOption {
    constructor( public readonly workDirectory: string = '',
                 public readonly quality = 80,
                 public readonly maxRetry = 5,
                 public readonly retryInterval = 200 ) {
        super( maxRetry, retryInterval );
    }
}

export class Png2JpgConverter extends ImageProcessor {
    constructor( src$: Observable<string>, option$: Observable<Png2JpgConverterOption> ) {
        super( src$, option$ );
    }
    
    protected process( src: string, option: Png2JpgConverterOption ): Promise<string> {
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

                console.log( rawImageData.width );
                console.log( rawImageData.height );
                console.log( rawImageData.data );
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
