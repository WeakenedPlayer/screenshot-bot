const fs = require('fs');
const PNG = require('pngjs').PNG;
import { RawImageData, ImageHandler } from './common'; 

//no option
export interface PngHandlerOption {
}

export function createPngHandler() {
    return new PngHandler();
}

export class PngHandler implements ImageHandler {
    constructor() {}
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
    
    convert( raw: RawImageData ): Promise<Buffer> {
        return new Promise( ( resolve, reject ) => {
        try {
            let buffer = PNG.sync.write( raw );
            resolve( buffer );
        } catch( err ) {
            reject( err );
        } } );
    }
    
    write( raw: RawImageData, dst: string ): Promise<string> {
        return this.convert( raw )
        .then( buffer => {
            fs.writeFileSync( dst, buffer );
            return dst;
       } );
    }
}
