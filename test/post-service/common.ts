import { Observable, Subscription, from } from 'rxjs';

export interface Poster {
    connected: boolean;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    post(  message: string ): Promise<void>;
    postImage( image: Buffer, message: string, filename?: string ): Promise<void>;
}
