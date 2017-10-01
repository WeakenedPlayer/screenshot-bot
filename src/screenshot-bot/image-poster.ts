import * as Discord from 'discord.js';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Client, ClientComponent } from '../client';
import { JpegGenerator, JpegOutputOption } from '../image';
export { JpegOutputOption };

export class ImagePoster implements ClientComponent {
    private discordClient: Discord.Client = null;
    private imageGeneratorSubject: BehaviorSubject<JpegGenerator>;
    private imageObservable: Observable<string>;
    private channelId: string = '';
    private subscription: Subscription = new Subscription();
    get image$(): Observable<string> { return this.imageObservable } 

    constructor( private client: Client ) {
        this.imageGeneratorSubject = new BehaviorSubject( null );
        this.imageObservable = this.imageGeneratorSubject
                               .asObservable()
                               .filter( generator => generator !== null )
                               .flatMap( generator => generator.image$ )
                               .publish()
                               .refCount();
    }
    
    configureWatcher( filter: string, dst: string, option?: JpegOutputOption ) {
        this.imageGeneratorSubject.next( new JpegGenerator( filter, dst, option ) );
    }
    
    // 指定されたチャネルIDへ、画像の投稿を開始する
    startPostingTo( channelId: string ) {
        this.stopPosting();
        this.channelId = channelId;
        this.subscription.add( this.imageObservable
        .map( ( img :string )=> {
            let client = this.discordClient;
            if( client ) {
                // tscでエラーが出るのを防止するため、あえて "any" として扱う。
                // TextChannel 以外は無視(エラーは出さない)
                let channel: any = client.channels.find( 'id', channelId );
                if( channel && channel.type === 'text' ) {
                    channel.send( '', { file: { attachment: img } } );                
                } 
            }
        } ).subscribe() );
    }

    // 画像の投稿を停止する
    stopPosting() {
        if( !this.subscription.closed ){
            this.subscription.unsubscribe();
            this.subscription = new Subscription();            
        }
    }
    
    // called by Client
    onClientInit( discordClient: Discord.Client ) {
        this.discordClient = discordClient;
    }
    
    onClientDestroy() {
        this.stopPosting();
        this.discordClient = null;
    }
}
