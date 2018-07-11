import { PngHandler } from './png';
import { JpgHandler } from './jpg';
import { TgaHandler } from './tga';

let PNG = new PngHandler();
let JPG = new JpgHandler();
let TGA = new TgaHandler();

PNG.read( './test/test.png' )
.then( a => {
    return JPG.write( a, './test/test-jpeg.jpg')
    .then( () => {
        TGA.write( a, './test/test-tga.tga' );
    } )
    .then( () => {
        PNG.write( a, './test/test-png.png')
    } );
} ).then( () => {
    console.log( 'done')
} );
