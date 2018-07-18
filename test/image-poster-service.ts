import { Observable, Subscription, from } from 'rxjs';
import { map, flatMap, retry, share } from 'rxjs/operators';
import { ImageHandler, ImageSource, ImageConverter, ImagePoster, toRetryPromise, wait } from './common'; 

export interface ImagePosterServiceConfig {
    retryCount: number;
    retryInterval: number;
}

const defaultConfig: ImagePosterServiceConfig = {
    retryCount: 5,
    retryInterval: 100
}

export class ImagePosterService {
    private subscription: Subscription = null;
    private conversion$: Observable<string>;
    constructor( private src: ImageSource,
                 private converter: ImageConverter,
                 private poster: ImagePoster, private config: ImagePosterServiceConfig = defaultConfig ) {
        // TENTATIVE: no check
        this.conversion$ = this.src.image$.pipe(
            flatMap( ( img: string ) => {
                    let count = this.config.retryCount; // retry count per image
                    return from( toRetryPromise( 
                        () => this.converter.convert( img ),    // conversion
                        () => wait( this.config.retryInterval ) // wait
                              .then( ()=> ( count-- > 0 ) )     // retry while count > 0
                ) )
            } ),
            retry()
        );
    }
    
    private isInactive(): boolean {
        return ( ( this.subscription === null ) || this.subscription.closed );
    }
    
    start(): void {
        if( !this.isInactive() ) {
            throw new Error( 'Already started.' );
        }
        this.subscription = this.conversion$.subscribe();
    }
    
    close(): void {
        if( this.isInactive() ) {
            throw new Error( 'Already stopped.' );
        }

        this.subscription.unsubscribe();
        this.subscription = null;
    }
}