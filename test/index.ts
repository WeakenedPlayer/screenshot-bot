//import { JpegConverter, JpegConverterOption, ImageWatcher } from '../src';
//import { Subject, Subscription, Observable } from 'rxjs';
//import { srcDir, srcDir2, tmpDir } from './constants';
//
//let condition = new Subject<boolean>();
//let toggle = false;
//
//let filter$ = new Subject<string>();
//let src$ = new ImageWatcher( filter$ );
//let option$: Observable<JpegConverterOption> = Observable.of( new JpegConverterOption( tmpDir ) ).shareReplay(1);
//let converter$ = new JpegConverter( src$.image$, option$ );
//
////setInterval( ()=>{
////    if( toggle ) {
////        toggle = false;
////        filter$.next( srcDir1 );
////        console.log( 'Watching ' +  srcDir1 );
////    } else {
////        toggle = true;
////        filter$.next( srcDir2 );
////        console.log( 'Watching ' +  srcDir2 );
////    }
////}, 5000 );
//converter$.image$.map( image => { console.log( image ) } ).subscribe();
//filter$.next( srcDir );
// でぃてくた


var fs = require('fs');
var TGA = require('tga');
var jpeg = require('jpeg-js');
var PNG = require('pngjs').PNG;

var tga = new TGA(fs.readFileSync('test/img/sample.tga'));
console.log(tga.width, tga.height);

var png = new PNG({
    width: tga.width,
    height: tga.height
});

png.data = tga.pixels;
png.pack().pipe(fs.createWriteStream('test/img/output.png'));

var rawImageData = {
        data: tga.pixels,
        width: tga.width,
        height: tga.height,
        buffetrType: 'rgba'
      };

var jpegImageData = jpeg.encode( rawImageData );
var stream = fs.createWriteStream('test/img/output.jpg');
console.log( jpegImageData )
stream.write( jpegImageData.data );
