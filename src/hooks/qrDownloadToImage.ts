import webViewBridgeHook from '@/hooks/webViewBridge';

export default function qrDownloadToImageHook() {
  function dataURLtoBlob(dataUrl: string) {
    const arr: any = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bStr = atob(arr[1]);
    let n = bStr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bStr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const { routeGo } = webViewBridgeHook();

  function saveCode(id: string, data: any = '', device: any, url: string) {
    const fileName = data;
    // @ts-ignore
    const img = document.getElementById(id).getElementsByTagName('img')[0].src;
    console.log(img);
    const aLink = document.createElement('a');
    const blob = dataURLtoBlob(img);
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('click', true, true);
    aLink.download = fileName;
    console.log(blob);
    switch (Number(device)) {
      case 1:
        // js
        aLink.href = URL.createObjectURL(blob);
        break;
      case 2:
        // android
        aLink.href = img;
        break;
      case 3: // ios
        aLink.href = img;
        return routeGo('QRCode', { url: img });
      default:
        aLink.href = URL.createObjectURL(blob);
        break;
    }
    aLink.click();
  }

  return { saveCode };
}
