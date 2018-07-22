import { RetryImageLoader } from '../image-loader';
import { ImageHandler } from '../image-handler';

export class ImageConverter extends RetryImageLoader {
    private input: ImageHandler;
    private output: ImageHandler;
    constructor() {
        super();
        this.input = null;
        this.output = null;
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
