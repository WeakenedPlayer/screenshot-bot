import { Png2JpgConverter, Png2JpgConverterOption, Tga2JpgConverter, Tga2JpgConverterOption, ImageWatcher, MultiFormatConverter } from '../src';
import { Subject, Subscription, Observable } from 'rxjs';
import { srcDir1, srcDir2, tmpDir } from './constants';

let condition = new Subject<boolean>();
let toggle = false;

let filter$ = new Subject<string>();
let src = new ImageWatcher( filter$ );
let tgaOption$: Observable<Tga2JpgConverterOption> = Observable.of( new Tga2JpgConverterOption( tmpDir, 80 ) );
let pngOption$: Observable<Png2JpgConverterOption> = Observable.of( new Png2JpgConverterOption( tmpDir, 80  ) );

let converter$ = new MultiFormatConverter( src.image$ );
converter$.add( '.png', ( src ) => new Png2JpgConverter( src, pngOption$ ) );
converter$.add( '.tga', ( src ) => new Tga2JpgConverter( src, tgaOption$ ) );

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
