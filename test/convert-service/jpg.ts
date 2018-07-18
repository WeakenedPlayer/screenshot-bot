const fs = require('fs');
const JPG = require('jpeg-js');
import { RawImageData, ImageHandler } from './common'; 

//no option
export interface JpgHandlerOption {
    quality: number;
}

export function createJpgHandler( quality: number = 80 ) {
    return new JpgHandler( { quality: quality } );
}

export class JpgHandler implements ImageHandler {
    constructor( private option: JpgHandlerOption ) {}
    read( src: string ): Promise<RawImageData> {
        return new Promise( ( resolve, reject ) => {
            try {
                let img = JPG.decode( fs.readFileSync( src ) ) as RawImageData;
                resolve( img );
            } catch( err ) {
                reject( err );
            }            
        } );
    }
    
    convert( raw: RawImageData ): Promise<Buffer> {
        return new Promise( ( resolve, reject ) => {
            try {
                let img = JPG.encode( raw, this.option.quality );
                resolve( img.data );
            } catch( err ) {
                reject( err );
            };
        } );
    }
    
    write( raw: RawImageData, dst: string ): Promise<string> {
        return this.convert( raw )
        .then( img => {
            fs.writeFileSync( dst, img );
            return dst;
        } );
    }
}
