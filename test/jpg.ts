const fs = require('fs');
const JPG = require('jpeg-js');
import { RawImageData, ImageHandler } from './common'; 

export class JpgHandler implements ImageHandler {
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
    write( raw: RawImageData, dst: string, option: any = { quality: 80 } ): Promise<void> {
        return new Promise( ( resolve, reject ) => {
            try {
                let img = JPG.encode( raw, option.quality );
                fs.writeFileSync( dst, img.data );
                resolve();
            } catch( err ) {
                reject( err );
            };
        } );
    }
}


