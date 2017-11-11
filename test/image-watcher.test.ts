import { ImageWatcher } from '../src';
import { Observable } from 'rxjs';

import { srcDir } from './constants';

let watcher = new ImageWatcher( srcDir );

console.log( 'Monitoring: ' + srcDir );
watcher.image$.map( image => { console.log( image ) } ).subscribe();