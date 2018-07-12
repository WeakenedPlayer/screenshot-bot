import { Observable, Subscription, from } from 'rxjs';
import { map, flatMap, tap, retry, share } from 'rxjs/operators';
import { ImagePoster } from './common'; 
import { ImageWatcher } from './image-watcher'; 
import { createPng2JpgConverter, X2YConverterOption } from './converter'; 
import { ImagePosterService } from './image-poster-service';


class DummyPoster implements ImagePoster {
    post( src: string ): Promise<void> {
        console.log(src);
        return Promise.resolve();
    }
}

const option: X2YConverterOption = {
    extension: '.jpg',
    tmpDir: 'tmp'
}

let watcher = new ImageWatcher();
let poster = new DummyPoster();

let imagePoster = new ImagePosterService(
    watcher,
    createPng2JpgConverter( option, 80 ),
    poster
);

//watcher.start( 'tmp\\*.png' )
//.then( () => {
//    console.log( 'watching')
//    return imagePoster.start()
//} ).then( () => {
//    console.log( 'started' );
//    // reverse
//    return watcher.start( 'tmp\\*.png' );
//} ).then( () => {
//    console.log( 'started' );
//} );
imagePoster.start();

watcher.start( 'tmp\\*.png' )
.then( () => {
    console.log( 'watching' )
} );
