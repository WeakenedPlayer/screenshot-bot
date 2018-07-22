export interface ImageLoader {
    load( src: string ): Promise<Buffer>;
}

function toRetryPromise<T>( factory: () => Promise<T>, waitRetry: () => Promise<boolean> ): Promise<T> {
    return factory()
    .catch( err => {
        console.warn( err );
        return waitRetry().then( ( canRetry: boolean ) => {
            if( canRetry ) {
                return factory();
            } else {
                return Promise.reject( 'Reaching maximum retry count.' );
            }
        } )
    } );
}

function wait( delay: number ): Promise<void> {
    return new Promise( ( resolve ) => {
        setTimeout( () => {
            resolve();
        }, delay );        
    } );
}

const DEFAULT_RETRY_COUNT = 5;
const DEFAULT_RETRY_INTERVAL = 500; 

export abstract class RetryImageLoader implements ImageLoader {
    private retryCount: number = DEFAULT_RETRY_COUNT;
    private retryInterval: number = DEFAULT_RETRY_INTERVAL;

    setRetryCount( count: number ): void {
        this.retryCount = count;
    }

    setRetryInterval( interval: number ): void {
        this.retryInterval = interval;
    }

    protected abstract _load( src: string ): Promise<Buffer>;
    
    load( src: string ): Promise<Buffer>{        
        let retry = this.retryCount;
        let interval = this.retryInterval;
        
        return toRetryPromise( () => {
            return this._load( src );
        }, () => wait( interval ).then( () => ( retry-- > 0 ) ) );
    }
}