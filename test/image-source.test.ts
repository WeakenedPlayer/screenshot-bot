import { JpegConverter, JpegConverterOption, ImageSource, ImageWatcher } from '../src';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { srcDir1, srcDir2, tmpDir } from './constants';

let toggle = false;
let gate$ = new BehaviorSubject<boolean>( toggle );
let filter$ = new BehaviorSubject<string>( srcDir1 );
let option$: Observable<JpegConverterOption> = Observable.of( new JpegConverterOption( tmpDir ) );
let source = new ImageSource( filter$, option$, gate$ );

setInterval( ()=>{
    if( toggle ) {
        toggle = false;
        console.log( '----------- Stop  --------------------------------------------' );
    } else {
        toggle = true;
        console.log( '----------- Start --------------------------------------------' );
    }
    gate$.next( toggle );
}, 2000 );

source.image$.map( image => { console.log( image ) } ).subscribe();

