import { Observable } from 'rxjs';

export interface ImageProvider {
    image$: Observable<string>;
}

export interface ImageConverter {
    convert( src: string ): Observable<string>;
}
