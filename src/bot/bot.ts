import { Observable, BehaviorSubject } from 'rxjs';
import * as Discord from 'discord.js';
import { Client } from '../client';
import { ChannelObservable } from './channel';
import { GuildObservable } from './guild';
import { OAuth2ApplicationObservable } from './oauth2application';

export class Bot extends Client {
    private channelObservable: ChannelObservable;
    private guildObservable: GuildObservable;
    private appObservable: OAuth2ApplicationObservable;

    get dmChannel$() { return this.channelObservable.dmChannel$; }
    get groupDmChannel$() { return this.channelObservable.groupDmChannel$; }
    get textChannel$() { return this.channelObservable.textChannel$; }
    get voiceChannel$() { return this.channelObservable.voiceChannel$; }
    get guild$() { return this.guildObservable.guild$; } 
    get app$() { return this.appObservable.app$; }

    constructor(){
        super();
        this.channelObservable = new ChannelObservable( this );
        this.guildObservable = new GuildObservable( this );
        this.appObservable = new OAuth2ApplicationObservable( this );

        this.addComponent( this.channelObservable );
        this.addComponent( this.guildObservable );
        this.addComponent( this.appObservable );
        this.init();
    }
}
