import { Observable } from 'rxjs';

export interface ImageWatcher {
    start(): Promise<void>;
    stop(): Promise<void>;
    image$: Observable<string>;
}
