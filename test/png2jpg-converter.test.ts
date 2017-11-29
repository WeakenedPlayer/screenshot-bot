import { Png2JpgConverter, Png2JpgConverterOption, ImageWatcher } from '../src';
import { Subject, Subscription, Observable } from 'rxjs';
import { srcDir1, srcDir2, tmpDir } from './constants';

let condition = new Subject<boolean>();
let toggle = false;

let filter$ = new Subject<string>();
let src$ = new ImageWatcher( filter$ );
let option$: Observable<Png2JpgConverterOption> = Observable.of( new Png2JpgConverterOption( tmpDir ) ).shareReplay(1);
let converter$ = new Png2JpgConverter( src$.image$, option$ );

setInterval( ()=>{
    if( toggle ) {
        toggle = false;
        filter$.next( srcDir1 );
        console.log( 'Watching ' +  srcDir1 );
    } else {
        toggle = true;
        filter$.next( srcDir2 );
        console.log( 'Watching ' +  srcDir2 );
    }
}, 5000 );

converter$.image$.map( image => { console.log( image ) } ).subscribe();
