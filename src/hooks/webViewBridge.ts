import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
export default function webViewBridgeHook() {
  const route = useRoute();

  //路由跳转
  function routeGo(name: string, data: any = {}) {
    const device = route.query.device;
    const formData = Object.assign(
      {
        code: name
      },
      data
    );
    switch (device) {
      case '1':
        // js
        window.parent.postMessage(name, '*');
        break;
      case '2':
        //android
        (window as any).JSInterface.postMessage(JSON.stringify(formData));
        break;
      case '3':
        //ios
        (window as any).webkit.messageHandlers.routeGo.postMessage(formData);
        break;
      default:
        if (window.parent) {
          window.parent.postMessage(name, '*');
        } else {
          (window as any).JSInterface.postMessage(name);
        }
    }
    return name;
  }
  return { routeGo };
}
