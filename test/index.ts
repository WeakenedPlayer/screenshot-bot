import * as Discord from 'discord.js'
import { ScreenshotBot, JpegConverterOption } from '../src';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { srcDir1, srcDir2, tmpDir, token, channelId } from './constants';

//Client
let client = new ScreenshotBot();

// Image source
let toggle = false;

client.login( token ).then( () => {
    setInterval( ()=>{
        if( toggle ) {
            toggle = false;
            client.stopPostiong();
            console.log( '----------- Stop  --------------------------------------------' );
        } else {
            toggle = true;
            client.startPostingTo( channelId );
            console.log( '----------- Start --------------------------------------------' );
        }
    }, 2000 );
} );
client.filter = srcDir1;
client.post$.subscribe( ()=> { console.log('heh')} );


