import { Observable } from 'rxjs';

export interface ImageProvider {
    image$: Observable<string>;
}
