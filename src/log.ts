import { Observable, Subject, BehaviorSubject } from 'rxjs';
export interface Loggable {
    log$: Observable<string>;
}

class Log {
    constructor( public readonly message, public readonly level: number = 0 ) {}
}

export class Logger {
    private _log$: Subject<Log> = new Subject();
    private _level$: BehaviorSubject<number> = new BehaviorSubject(0);
    private filteredLog$: Observable<string>;
    constructor() {
        // 一度 hot observable にする
        let level$ = this._level$.share();
        
        this.filteredLog$ = level$.flatMap( ( level ) => {
            return this._log$.filter( log => log.level >= level ).map( log => log.message ).takeUntil( level$ );
        } );
    }

    log( message: string, level: number = 0 ) {
        this._log$.next( new Log( message, level ) );
    }
    
    set level( value: number ) {
        this._level$.next( value );
    }
    
    get log$() {
        return this.filteredLog$;
    }
}

export const logger = new Logger();