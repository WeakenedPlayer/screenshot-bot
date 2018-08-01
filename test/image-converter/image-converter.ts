import { RetryImageLoader, ImageHandler } from '../../dist';

export class ImageConverter extends RetryImageLoader {
    constructor( private input: ImageHandler = null, private output: ImageHandler = null ) {
        super();
    }

    setInput( handler: ImageHandler ): void {
        this.input = handler;
    }

    setOutput( handler: ImageHandler ): void {
        this.output = handler;
    }
    
    protected _load( src: string ): Promise<Buffer> {
        if( this.input === null || this.output === null ) {
            throw new Error( 'Image handler is null.' );
        }

        return this.input.read( src ).then( img => this.output.convert( img ) );
    }
}
