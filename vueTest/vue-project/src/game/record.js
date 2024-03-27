import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
export async function loadFFmpeg(){
    const ffmpeg = new FFmpeg();
    const baseURL = 'src/assets';
    ffmpeg.on('log', ({ message }) => {
        console.log(message);
    });
    await ffmpeg.load(
        // {
        // coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        // wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        // workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
        // }
    );
    return {
        loadImageData(){

        }

    }
}

//http://localhost:5173/@fs/D:/projects/toySerials/vueTest/vue-project/node_modules/.vite/deps/worker.js?worker_file&type=module
