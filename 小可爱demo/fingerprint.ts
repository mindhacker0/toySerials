import { createSHA256 } from 'hash-wasm';
function getCanvasFingerprint():string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    // 绘制基础图形
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Hello, Fingerprint!', 2, 15);
    ctx.strokeStyle = '#080';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    // 获取图像数据
    return canvas.toDataURL();
}
// 获取WebGL信息
function getWebGLInfo() {
    try {
        const canvas = document.createElement('canvas');
        const gl:WebGLRenderingContext|null = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return null;
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
            version: gl.getParameter(gl.VERSION),
            shadingLanguage: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
        };
    } catch (e) {
        return null;
    }
}
//获取安装字体
function getInstalledFonts() {
    const fonts = [
        'Arial', 'Arial Black', 'Courier New', 'Times New Roman',
        'Microsoft YaHei', 'SimSun', 'PingFang SC', 'Helvetica',
        'Menlo', 'Monaco', 'Consolas', 'Verdana', 'Georgia',
        'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
        'Impact', 'Lucida Console', 'Tahoma'
    ];

    const availableFonts:string[] = [];
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '-9999px';
    div.style.fontFamily = 'monospace';
    div.innerHTML = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    document.body.appendChild(div);
    const defaultWidth = div.offsetWidth;
    const defaultHeight = div.offsetHeight;

    fonts.forEach(font => {
        div.style.fontFamily = `'${font}', monospace`;
        if (div.offsetWidth !== defaultWidth || div.offsetHeight !== defaultHeight) {
        availableFonts.push(font);
        }
    });

    document.body.removeChild(div);
    return availableFonts;
}
export const getBrowserFingerprint:()=>Promise<string> = async() => {
   const canvasInfo = getCanvasFingerprint();
   const webglInfo = getWebGLInfo();
   const screenInfo = {
    width: screen.width,
    height: screen.height,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio || 1
  };
  const navigatorInfo = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    maxTouchPoints: navigator.maxTouchPoints || 0
  };
  const fontInfo = getInstalledFonts();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezoneOffset = new Date().getTimezoneOffset();
  const blob = new Blob([JSON.stringify({canvasInfo,webglInfo,screenInfo,navigatorInfo,fontInfo,timezone,timezoneOffset})],{type:"application/json"});
  const buffer = await blob.arrayBuffer();
  const hasher = await createSHA256();
  hasher.init();
  hasher.update(new Uint8Array(buffer));
  return hasher.digest('hex');
}