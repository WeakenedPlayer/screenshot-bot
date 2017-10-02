export class JpegOutputOption {
    constructor(
            public quality: number = 80,
            public progressive: boolean = false,
            public chromaSubsampling: string ='4:2:0',
            public trellisQuantisation: boolean = false,
            public overshootDeringing: boolean = false,
            public optimizeScans : boolean = false,
            public force: boolean = true ) {}    
}
