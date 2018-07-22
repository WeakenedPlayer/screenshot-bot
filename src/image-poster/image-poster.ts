import { Observable, Subscription, from } from 'rxjs';

export interface ImagePoster {
    post(  message: string ): Promise<void>;
    postImage( image: Buffer, message: string, filename?: string ): Promise<void>;
}
