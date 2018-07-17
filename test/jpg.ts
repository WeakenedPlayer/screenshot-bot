const fs = require('fs');
const JPG = require('jpeg-js');
import { RawImageData, ImageHandler } from './common'; 

export class JpgHandler implements ImageHandler {
    constructor( private option: any = { quality: 80 } ) {}
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
