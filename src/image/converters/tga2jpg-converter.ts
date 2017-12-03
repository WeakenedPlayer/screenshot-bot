import { ImageProvider } from '../image';
import { ImageConverter, ImageConverterOption } from './image-converter';
import { Observable, Subject, Observer } from 'rxjs';
import * as Path from 'path';
const extension = '.jpg';

const fs = require('fs');
const TGA = require('tga');
const JPG = require('jpeg-js');

export class Tga2JpgConverterOption extends ImageConverterOption {
    constructor( public readonly workDirectory: string = '',
                 public readonly quality = 80,
                 public readonly maxRetry = 5,
                 public readonly retryInterval = 200 ) {
        super( maxRetry, retryInterval );
    }
}

export class Tga2JpgConverter extends ImageConverter {
    constructor( src$: Observable<string>, option$: Observable<Tga2JpgConverterOption> ) {
        super( src$, option$ );
    }
    
    protected convert( src: string, option: Tga2JpgConverterOption ): Promise<string> {
        let ext: string = Path.extname( src );
        let base: string = Path.basename( src, ext ) + extension;
        let dst: string =  Path.join( option.workDirectory, base );
        
        return new Promise( ( resolve, reject ) => {
            try {
                let tga = new TGA( fs.readFileSync( src ) );
                let rawImageData = {
                    data: tga.pixels,
                    width: tga.width,
                    height: tga.height,
                    buffetrType: 'rgba'
                };
                
                let jpg = JPG.encode( rawImageData, option.quality );
                let stream = fs.createWriteStream( dst );
                stream.write( jpg.data, option.quality );
                resolve( dst );
            } catch( err ) {
                reject( err );
            }
        } );
    }
}
