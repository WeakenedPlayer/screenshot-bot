import { JpegOutputOption } from '.';
export class ScreenshotBotOption {
    constructor( public readonly filter: string = '',
                 public readonly workDir: string = '',
                 public readonly jpegOption?: JpegOutputOption ) {}
}
