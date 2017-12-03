import { Observable, Observer } from 'rxjs';
import { ImageProvider } from './image';
import { ImageConverter } from './converters';
import * as Path from 'path';

/* ############################################################################
 * test
 * ######################################################################### */
export class MultiFormatConverter implements ImageProvider {
    private converterMap: { [ ext: string ]: ImageProvider } = {};
    private src$: Observable<string>;
    private convertedImage$: Observable<string>;
    
    get image$(): Observable<string> {
        return this.convertedImage$;
    }
    
    constructor( src$: Observable<string> ) {
        this.src$ = src$.shareReplay( 1 );
        
        this.convertedImage$ = this.src$.flatMap( src => {
            let ext: string = Path.extname( src );
            let converter = this.converterMap[ ext ];
            
            if( converter ) {
                // every time images arrived, 
                return converter.image$.take(1);
            } else {
                console.warn( 'Extension ' + ext + ' is not supported.' );
                return Observable.never();
            }
        } );
    }

    private createFilter( ext: string ): Observable<string> {
        return this.src$.filter( src => Path.extname( src ) === ext );
    }
    
    add( ext: string, factory: ( src: Observable<string> ) => ImageConverter ){
        
        if( ext && factory ){
            let converter = factory( this.createFilter( ext ) );
            if( converter ) {
                this.converterMap[ ext ] = converter;                
            }
        }
    }
    
}