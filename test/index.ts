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

let poster = new ImagePosterService(
    new ImageWatcher(),
    createPng2JpgConverter( option, 80 ),
    new DummyPoster()
);

poster.start( 'tmp\\*.png' )
.then( () => {
    console.log( 'started' );
} );


