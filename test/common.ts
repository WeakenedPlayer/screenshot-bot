import { Observable, Subscription, from } from 'rxjs';

export interface RawImageData {
    data: Buffer;
    width: number;
    height: number;
}

export interface ImageHandler {
    read( src: string ): Promise<RawImageData>;
    write( img: RawImageData, dst: string ): Promise<string>;
}

export interface ImageSource {
    start( filter: string ): Promise<void>;
    stop(): Promise<void>;
    image$: Observable<string>;
}

export interface ImageConverter {
    convert( src: string ): Promise<string>;
}

export interface ImagePoster {
    post( src: string ): Promise<void>;
}

export function toRetryPromise<T>( factory: () => Promise<T>, waitRetry: () => Promise<boolean> ): Promise<T> {
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

export function wait( delay: number ): Promise<void> {
    return new Promise( ( resolve ) => {
        setTimeout( () => {
            resolve();
        }, delay );        
    } );
}
