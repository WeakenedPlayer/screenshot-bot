import * as Discord from 'discord.js'
import { ScreenshotBot, JpegConverterOption } from '../src';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { srcDir1, srcDir2, tmpDir1, tmpDir2, token, channelId } from './constants';

import { logger } from '../src/log';

//Client
let client = new ScreenshotBot();

// Image source
let toggle = false;

client.login( token ).then( () => {
    client.channelId = channelId;
    setInterval( ()=>{
        if( toggle ) {
            toggle = false;
            client.filter = srcDir2;
            client.option = new JpegConverterOption( tmpDir2 );
            console.log( '----------- 2  --------------------------------------------' );
        } else {
            toggle = true;
            client.filter = srcDir1;
            client.option = new JpegConverterOption( tmpDir1 );
            console.log( '----------- 1 --------------------------------------------' );
        }
    }, 2000 );
} );

client.startPosting();
client.post$.catch( err => {
    console.log( err );
    return Observable.of( 1 );
} ).subscribe();

logger.log$.map( message => console.log( message ) ).subscribe();