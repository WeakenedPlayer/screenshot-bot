import { Observable } from 'rxjs';

export interface ImageWatcher {
    image$: Observable<string>;
}
