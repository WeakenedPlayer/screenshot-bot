import { JpegGenerator } from '../src';
import { Subject, Subscription, Observable } from 'rxjs';

import { srcDir, tmpDir } from './constants';

console.log( 'Monitoring: ' + srcDir );

let toggle = false;
let condition = new Subject<boolean>();
let watcher = new JpegGenerator( srcDir, tmpDir, condition );

watcher.image$.map( image => { console.log( image ) } ).subscribe();

setInterval( ()=>{
    if( toggle ) {
        toggle = false;
    } else {
        toggle = true;
    }
    condition.next( toggle );
    console.log( toggle );
}, 5000 );
