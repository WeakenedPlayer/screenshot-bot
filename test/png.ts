const fs = require('fs');
const PNG = require('pngjs').PNG;
import { RawImageData, ImageHandler } from './common'; 

export class PngHandler implements ImageHandler {
    constructor( private option: any = {} ) {}
    read( src: string ): Promise<RawImageData> {
        return new Promise( ( resolve, reject ) => {
            try {
                let raw = PNG.sync.read( fs.readFileSync( src ) ) as RawImageData;
                resolve( raw );
            } catch( err ) {
                reject( err );
            }            
        } );
    }
    write( raw: RawImageData, dst: string ): Promise<string> {
        return new Promise( ( resolve, reject ) => {
            try {
                let buffer = PNG.sync.write( raw, this.option );
                fs.writeFileSync( dst, buffer );
                resolve( dst );
            } catch( err ) {
                reject( err );
            };
        } );
    }
}

