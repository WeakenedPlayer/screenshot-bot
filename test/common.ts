export interface RawImageData {
    data: Buffer;
    width: number;
    height: number;
}

export interface ImageHandler {
    read( src: string ): Promise<RawImageData>;
    write( img: RawImageData, dst: string, option?: any ): Promise<void>;
}
