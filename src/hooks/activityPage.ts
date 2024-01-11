import { computed, nextTick, onMounted, reactive, Ref, ref, ComputedRef } from 'vue';
import createRequestFun from '@/utils/createRequest';
import { useRoute } from 'vue-router';
import { AxiosInstance } from 'axios';
import jwt_decode from 'jwt-decode';

export default function activityPageHook(init = true) {
  const token: Ref<any> = ref('');
  const activeId: Ref<any> = ref(null);
  const deviceId = ref('2');
  const device = ref('0');
  const infoLoading = ref(true);
  const route = useRoute();
  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  const request: Ref<AxiosInstance> = ref(null);

  const activityInfo: any = reactive({});

  function getActivityInfo(value: any) {
    infoLoading.value = true;
    request
      .value({
        url: '/index/Activity/activityDetail',
        method: 'post',
        data: { activity_id: activeId.value }
      })
      .then((res: any) => {
        // eslint-disable-next-line eqeqeq
        if (res.code == 1) {
          Object.assign(activityInfo, res.data);
        }
      })
      .finally(() => {
        infoLoading.value = false;
      });
  }

  const tokenObject: ComputedRef<any> = computed(() => {
    if (token.value) {
      return jwt_decode(token.value);
    } else {
      return {};
    }
  });

  function setActivityId(val: any){
    activeId.value = val
  }

  onMounted(() => {
    nextTick(() => {
      device.value = <string>route.query.device || '0';
      deviceId.value = ['2', '3', '3'][Number(route.query.device || '0')];
      activeId.value = route.query.activeId || '';
      token.value = route.query.token === 'null' ? '' : !route.query.token ? '' : route.query.token;
      request.value = createRequestFun(deviceId.value, token.value);
      if (!init) return;
      getActivityInfo(activeId.value);
    }).then(r => {});
  });

  return { token, infoLoading, setActivityId, activityInfo, request, tokenObject, deviceId, device, getActivityInfo };
}
