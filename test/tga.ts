const fs = require('fs');
var TGA = require('tga');
import { RawImageData, ImageHandler } from './common'; 

export class TgaHandler implements ImageHandler {
    read( src: string ): Promise<RawImageData> {
        return new Promise( ( resolve, reject ) => {
            try {
                let raw = new TGA( fs.readFileSync( src ) );
                resolve( {
                    data: raw.pixels,
                    width: raw.width,
                    height: raw.height
                } );
            } catch( err ) {
                reject( err );
            }            
        } );
    }
    write( raw: RawImageData, dst: string ): Promise<string> {
        return new Promise( ( resolve, reject ) => {
            try {
                let img = TGA.createTgaBuffer( raw.width, raw.height, raw.data );
                fs.writeFileSync( dst, img );
                resolve( dst );
            } catch( err ) {
                reject( err );
            };
        } );
    }
}


