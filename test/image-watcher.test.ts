import { ImageWatcher } from '../src';
import { Observable, Subject } from 'rxjs';

import { srcDir, tmpDir } from './constants';

let src$ = new Subject<string>();
let watcher = new ImageWatcher( src$ );

console.log( 'Monitoring: ' + srcDir );
watcher.image$.map( image => { console.log( image + ' has been added.') } ).subscribe();

let toggle = false;
setInterval( ()=>{
    if( toggle ) {
        toggle = false;
        src$.next( srcDir );
        console.log( 'Watching ' +  srcDir );
    } else {
        toggle = true;
        src$.next( tmpDir );
        console.log( 'Watching ' +  tmpDir );
    }
}, 5000 );
