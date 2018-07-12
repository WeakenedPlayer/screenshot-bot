import { ImageHandler, ImageConverter } from './common'; 
import { PngHandler } from './png';
import { JpgHandler } from './jpg';
import { TgaHandler } from './tga';
import * as path from 'path';

export interface X2YConverterOption {
    tmpDir: string,
    extension: string
}

export class X2YConverter implements ImageConverter {
    constructor( private input: ImageHandler, private output: ImageHandler, private option: X2YConverterOption ) {
    }
    filename( src: string ): string {
        let dir = path.dirname( src );
        let ext = path.extname( src );
        let basename = path.basename( src, ext );
        console.log( dir )
        console.log( ext )
        console.log( basename )
        return path.format( {
            dir: this.option.tmpDir, 
            name : basename,
            ext: this.option.extension 
        } );
    }
    
    convert( src: string ): Promise<string> {
        return this.input.read( src ).then( data => {
            let dst = this.filename( src );
            console.log( dst )
            return this.output.write( data, dst );
        } );
    }
}

export function createPng2JpgConverter( convOption: X2YConverterOption, quality: number ): ImageConverter {
    return new X2YConverter( new PngHandler(), new JpgHandler( { quality: quality } ), convOption );
}

export function createTga2JpgConverter( convOption: X2YConverterOption, quality: number ): ImageConverter {
    return new X2YConverter( new TgaHandler(), new JpgHandler( { quality: quality }  ), convOption );
}
