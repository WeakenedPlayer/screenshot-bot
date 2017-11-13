import * as Discord from 'discord.js'
import { JpegConverter, JpegConverterOption, ImageSource, ImageWatcher, ImagePoster } from '../src';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { srcDir1, srcDir2, tmpDir, token, channelId } from './constants';

//Client
let client = new Discord.Client();

// Image source
let toggle = false;
let gate$ = new BehaviorSubject<boolean>( false );
let filter$ = new BehaviorSubject<string>( srcDir1 );
let option$: Observable<JpegConverterOption> = Observable.of( new JpegConverterOption( tmpDir ) );

let source = new ImageSource( filter$, option$, gate$ );

// Poster
let channel$ = new BehaviorSubject<Discord.Channel>( null );
let poster = new ImagePoster( source, channel$ );

client.login( token ).then( () => {
    let channel = client.channels.find( 'id', channelId );    

    if( channel ) {
        console.log( 'channnel: ' + channel.id );
        channel$.next( channel );

        setInterval( ()=>{
            if( toggle ) {
                toggle = false;
                console.log( '----------- Stop  --------------------------------------------' );
            } else {
                toggle = true;
                console.log( '----------- Start --------------------------------------------' );
            }
            gate$.next( toggle );
        }, 2000 );

    } else {
        console.log( 'fail' );
    }
} );

//do something when app is closing
process.on('exit', ()=> { client.destroy() });

//catches ctrl+c event
process.on('SIGINT', ()=> { client.destroy() });

poster.post$.subscribe( ()=> { console.log('heh')} );







