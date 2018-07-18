import { Poster } from './common';

export class PostService implements Poster{
    private poster: Poster = null;
    private checkPoster(): void {
        if( this.poster === null ) {
            throw new Error( 'Poster is not set.' );
        }
    }

    setPoster( poster: Poster ): void {
        this.poster = poster;
    }

    get connected(): boolean {
        this.checkPoster();
        return this.poster.connected;
    }
    
    connect(): Promise<void> {
        this.checkPoster();
        return this.poster.connect();
    }
    
    disconnect(): Promise<void> {
        this.checkPoster();
        return this.poster.disconnect();
    }
    
    post( message: string ): Promise<void> {
        this.checkPoster();
        return this.poster.post( message );
    }
    
    postImage( image: Buffer, message: string, filename?: string ): Promise<void> {
        this.checkPoster();
        return this.poster.postImage( image, message, filename );
    }
}
