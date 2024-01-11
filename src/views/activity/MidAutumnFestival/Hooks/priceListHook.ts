import activityPageHook from '@/hooks/activityPage';
import { nextTick, onMounted, reactive, ref, Ref } from 'vue';

export default function priceListHook() {
  const { token, request } = activityPageHook(false);

  const loading = reactive({
    refresh: false,
    onload: false,
    finished: false
  });

  const formData = reactive({
    page: 0,
    limit: 10
  });

  const priceList: Ref<any[]> = ref([]);

  function toQuery(params?: any) {
    if (!token.value) return;
    formData.page++;
    loading.refresh = true;
    request
      .value({
        url: '/index/Activity/moonFestivalRecord',
        method: 'get',
        params: {
          ...formData,
          ...params
        }
      })
      .then((res: any) => {
        if (+res.code === 1) {
          if (formData.page === 1) {
            priceList.value = res.data.data;
          } else {
            priceList.value = [...priceList.value, ...res.data.data];
          }
          loading.finished = res.data.data.length < formData.limit;
        } else {
          loading.finished = true;
        }
      })
      .catch(() => {
        loading.finished = true;
      })
      .finally(() => {
        loading.onload = false;
        loading.refresh = false;
      });
  }

  function onRefresh(params?: any) {
    if (!token.value) return;
    formData.page = 0;
    loading.onload = true;
    loading.finished = false;
    toQuery(params);
  }

  function onLoad(params?: any) {
    if (!token.value) return;
    setTimeout(() => {
      toQuery(params);
    }, 200);
  }

  function formChange(form: any) {
    Object.assign(formData, form);
    onRefresh();
  }

  onMounted(() => {
    nextTick(() => {
      // onRefresh();
    });
  });

  return { loading, onRefresh, onLoad, priceList, formChange };
}
