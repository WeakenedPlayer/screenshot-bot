import { ImageHandler, toRetryPromise, wait } from './common';

const DEFAULT_RETRY_COUNT = 5;
const DEFAULT_RETRY_INTERVAL = 500; 

export class ConvertService {
    private input: ImageHandler;
    private output: ImageHandler;
    private retryCount: number = DEFAULT_RETRY_COUNT;
    private retryInterval: number = DEFAULT_RETRY_INTERVAL;
    constructor() {
        this.input = null;
        this.output = null;
    }

    setInput( handler: ImageHandler ): void {
        this.input = handler;
    }

    setOutput( handler: ImageHandler ): void {
        this.output = handler;
    }

    setRetryCount( count: number ): void {
        this.retryCount = count;
    }

    setRetryInterval( interval: number ): void {
        this.retryInterval = interval;
    }

    convert( src: string ): Promise<Buffer>{        
        let retry = this.retryCount;
        let interval = this.retryInterval;
        
        if( this.input === null || this.output === null ) {
            throw new Error( 'Image handler is null.' );
        }

        return toRetryPromise( () => {
            return this.input.read( src ).then( img => this.output.convert( img ) );
        }, () => wait( interval ).then( () => ( retry-- > 0 ) ) );
    }
}
