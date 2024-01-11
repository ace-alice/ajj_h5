import activityPageHook from '@/hooks/activityPage';
import { nextTick, onMounted, reactive, ref, Ref } from 'vue';

export default function priceInfoHook() {
  const { token, request } = activityPageHook(false);

  const loadingInfo = reactive({
    refresh: false,
    onload: false,
    finished: false
  });

  const formData = reactive({
    page: 0,
    limit: 10
  });

  const priceInfo: Ref<any[]> = ref([]);

  function toQuery(params?: any) {
    if (!token.value) return;
    formData.page++;
    // loadingInfo.refresh = true;
    request
      .value({
        url: '/index/Activity/moonFestivalLeaderBoard',
        method: 'get',
        params: {
          ...formData,
          ...params
        }
      })
      .then((res: any) => {
        if (+res.code === 1) {
          if (formData.page === 1) {
            priceInfo.value = res.data.data;
          } else {
            priceInfo.value = [...priceInfo.value, ...res.data.data];
          }
          loadingInfo.finished = res.data.data.length < formData.limit;
        } else {
          loadingInfo.finished = true;
        }
      })
      .catch(() => {
        loadingInfo.finished = true;
      })
      .finally(() => {
        loadingInfo.onload = false;
        loadingInfo.refresh = false;
      });
  }

  function onInfoRefresh(params?: any) {
    if (!token.value) return;
    formData.page = 0;
    loadingInfo.onload = true;
    loadingInfo.finished = false;
    toQuery(params);
  }

  function onInfoLoad(params?: any) {
    if (!token.value) return;
    setTimeout(() => {
      toQuery(params);
    }, 500);
  }

  function formChange(form: any) {
    Object.assign(formData, form);
    onInfoRefresh();
  }

  onMounted(() => {
    nextTick(() => {
      // onInfoRefresh();
    });
  });

  return { loadingInfo, onInfoRefresh, onInfoLoad, priceInfo, formChange };
}
