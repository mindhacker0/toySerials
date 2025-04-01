// 矩阵翻转函数；
function flipKernel(kernel) {
    const h = kernel.length;
    const half = Math.floor(h / 2);
    // 按中心对称的方式将矩阵中的数字上下、左右进行互换；
    for (let i = 0; i < half; ++i) {
        for (let j = 0; j < h; ++j) {
            let _t = kernel[i][j];
            kernel[i][j] = kernel[h - i - 1][h - j - 1];
            kernel[h - i - 1][h - j - 1] = _t;
        }
    }
    // 处理矩阵行数为奇数的情况；
    if (h & 1) {
        // 将中间行左右两侧对称位置的数进行互换；
        for (let j = 0; j < half; ++j) {
            let _t = kernel[half][j];
            kernel[half][j] = kernel[half][h - j - 1];
            kernel[half][h - j - 1] = _t;
        }
    }
    return kernel;
}
// 得到经过翻转 180 度后的卷积核矩阵；
const kernel = flipKernel([
    [-1, -1, 1],
    [-1, 14, -1],
    [1, -1, -1]
]);

function jsConvFilter(data, width, height, kernel) {
    const divisor = 4;  // 分量调节参数；
    const h = kernel.length, w = h;  // 保存卷积核数组的宽和高；
    const half = Math.floor(h / 2);
    // 根据卷积核的大小来忽略对边缘像素的处理；
    for (let y = half; y < height - half; ++y) {
        for (let x = half; x < width - half; ++x) {
        // 每个像素点在像素分量数组中的起始位置；
        const px = (y * width + x) * 4;  
        let r = 0, g = 0, b = 0;
        // 与卷积核矩阵数组进行运算；
        for (let cy = 0; cy < h; ++cy) {
            for (let cx = 0; cx < w; ++cx) {
            // 获取卷积核矩阵所覆盖位置的每一个像素的起始偏移位置；
            const cpx = ((y + (cy - half)) * width + (x + (cx - half))) * 4;
            // 对卷积核中心像素点的 RGB 各分量进行卷积计算(累加)；
            r += data[cpx + 0] * kernel[cy][cx];
            g += data[cpx + 1] * kernel[cy][cx];
            b += data[cpx + 2] * kernel[cy][cx];
            }
        }
        // 处理 RGB 三个分量的卷积结果；
        data[px + 0] = ((r / divisor) > 255) ? 255 : ((r / divisor) < 0) ? 0 : r / divisor;
        data[px + 1] = ((g / divisor) > 255) ? 255 : ((g / divisor) < 0) ? 0 : g / divisor;
        data[px + 2] = ((b / divisor) > 255) ? 255 : ((b / divisor) < 0) ? 0 : b / divisor;
        }
    }
    return data;
}
// 全局状态；
const STATUS = ['STOP', 'JS', 'WASM'];
// 当前状态；
let globalStatus = 'STOP';
const jsTimeRecords = [];
// 监听用户点击事件；
document.querySelector("button").addEventListener('click', () => {
    globalStatus = STATUS[Number(document.querySelector("input[name='options']:checked").value)];
});

function calcFPS(vector) {
    // 提取容器中的前 20 个元素来计算平均值；
    const AVERAGE_RECORDS_COUNT = 20;
    if (vector.length > AVERAGE_RECORDS_COUNT) {
        vector.shift(-1);  // 维护容器大小；
    } else {
        return 'NaN';
    }
    // 计算平均每帧在绘制过程中所消耗的时间；
    let averageTime = (vector.reduce((pre, item) => {
        return pre + item;
    }, 0) / Math.abs(AVERAGE_RECORDS_COUNT));
    // 估算出 1s 内能够绘制的帧数；
    return (1000 / averageTime).toFixed(2);
}
// 获取相关的 HTML 元素；
let video = document.querySelector('.video');
let canvas = document.querySelector('.canvas');
let fpsNumDisplayElement = document.querySelector(".fps-num");
// 使用 getContext 方法获取 <canvas> 标签对应的一个 CanvasRenderingContext2D 接口；
let context = canvas.getContext('2d');

// 自动播放 <video> 载入的视频；
let promise = video.play();
if (promise !== undefined) {
    promise.catch(error => {
        console.error("The video can not autoplay!")
    });
}
// 定义绘制函数；
function draw() {
    const timeStart = performance.now();
    // 调用 drawImage 函数绘制图像到 <canvas>；
    context.drawImage(video, 0, 0);
    // 获得 <canvas> 上当前帧对应画面的像素数组；
    const pixels = context.getImageData(0, 0, video.videoWidth, video.videoHeight);
    if(globalStatus === "JS"){
        pixels.data.set(jsConvFilter(pixels,video.videoWidth, video.videoHeight,kernel));
        context.putImageData(pixels,0,0);
    }
    let timeUsed = performance.now() - timeStart;
    jsTimeRecords.push(timeUsed);
    fpsNumDisplayElement.innerHTML = calcFPS(jsTimeRecords);
    // ...    
    // 更新下一帧画面；
    requestAnimationFrame(draw);
}
// <video> 视频资源加载完毕后执行；
video.addEventListener("loadeddata", () => {
    // 根据 <video> 载入视频大小调整对应的 <canvas> 尺寸；
    canvas.setAttribute('height', video.videoHeight);
    canvas.setAttribute('width', video.videoWidth);
    // 绘制函数入口；
    draw(context);
});



