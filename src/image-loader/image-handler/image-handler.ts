export interface RawImageData {
    data: Buffer;
    width: number;
    height: number;
}

export interface ImageHandler {
    read( src: string ): Promise<RawImageData>;
    convert( img: RawImageData ): Promise<Buffer>;
    write( img: RawImageData, dst: string ): Promise<string>;
}
