import { Observable } from 'rxjs';
import { ImageProvider } from './image';
import { ImageWatcher } from './image-watcher';
import { JpegConverter } from './jpeg-converter';
import { JpegOutputOption } from './jpeg-output-option';

export class JpegGenerator implements ImageProvider {
    private watcher: ImageWatcher;
    private converter: JpegConverter;
    private imageObservable: Observable<string>;
    constructor( filter: string, workDir: string, options?: JpegOutputOption ) {
        this.watcher = new ImageWatcher( filter );
        this.converter = new JpegConverter( workDir, options );
        this.imageObservable = this.watcher.image$
                               .flatMap( src => this.converter.convert( src ) );
    }

    get image$(): Observable<string> { return this.imageObservable }
}
