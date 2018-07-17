import { ImageHandler, toRetryPromise, wait } from './common';
import { JpgHandler } from './jpg';
import { PngHandler } from './png';
import { TgaHandler } from './tga';

export enum ImageFormat {
    JPG = 'jpg',
    PNG = 'png',
    TGA = 'tga'
} 

let handlerFactories: { [ format: string ]: ( option: any ) => ImageHandler } = {};
handlerFactories[ ImageFormat.JPG ] = ( option: any ) => new JpgHandler( option ); 
handlerFactories[ ImageFormat.PNG ] = ( option: any ) => new PngHandler( option ); 
handlerFactories[ ImageFormat.TGA ] = ( option: any ) => new TgaHandler( option ); 

function createHandler( type: ImageFormat, option: any ) {
    return handlerFactories[ type ]( option );
}

export class ConvertService {
    private input: ImageHandler;
    private output: ImageHandler;
    constructor() {
        this.input = new PngHandler();
        this.output = new JpgHandler();
    }
    
    from( type: ImageFormat, option: any = {} ): void {
        this.input = createHandler( type, option );
    }
    
    to( type: ImageFormat, option: any = {} ): void {
        this.output = createHandler( type, option );
    }
    
    convert( src: string ): Promise<Buffer>{
        let retry = 10;
        return toRetryPromise( () => {
            return this.input.read( src ).then( img => this.output.convert( img ) );
        }, () => wait( 100 ).then( () => ( retry-- > 0 ) ) );
    }
}
