import { ImageWatcher } from '../src';
import { Observable, Subject } from 'rxjs';

import { srcDir1, srcDir2, tmpDir } from './constants';

let src$ = new Subject<string>();
let watcher = new ImageWatcher( src$ );

console.log( 'Monitoring: ' + srcDir1 );
watcher.image$.map( image => { console.log( image + ' has been added.') } ).subscribe();

let toggle = false;
setInterval( ()=>{
    if( toggle ) {
        toggle = false;
        src$.next( srcDir1 );
        console.log( 'Watching ' +  srcDir1 );
    } else {
        toggle = true;
        src$.next( srcDir2 );
        console.log( 'Watching ' +  srcDir2 );
    }
}, 5000 );
