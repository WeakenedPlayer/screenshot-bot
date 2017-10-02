export class ClientState {
    constructor( public readonly ready: boolean = false,
                 public readonly busy: boolean = false,
                 public readonly connected: boolean = false ) {}
}
