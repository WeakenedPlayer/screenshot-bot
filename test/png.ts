const fs = require('fs');
const PNG = require('pngjs').PNG;
import { RawImageData, ImageHandler } from './common'; 

export class PngHandler implements ImageHandler {
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
    write( raw: RawImageData, dst: string, option: any = {} ): Promise<void> {
        return new Promise( ( resolve, reject ) => {
            try {
                let buffer = PNG.sync.write( raw, option );
                fs.writeFileSync( dst, buffer );
                resolve();
            } catch( err ) {
                reject( err );
            };
        } );
    }
}

