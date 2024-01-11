import activityPageHook from '@/hooks/activityPage';
import { reactive, ref, Ref } from 'vue';
import { parseTime } from '@/utils/index.js';

export default function priceListHook() {
  const { token, request } = activityPageHook(false);

  const loading = reactive({
    refresh: false,
    onload: false,
    finished: false
  });

  const formData = reactive({
    status: 0,
    start_time: parseTime(new Date().getTime() - 1000 * 60 * 60 * 24 * 30, '{y}-{m}-{d}'),
    end_time: parseTime(new Date(), '{y}-{m}-{d}'),
    page: 0,
    limit: 10
  });

  const priceList: Ref<any[]> = ref([]);

  function toQuery() {
    if (!token) return;
    formData.page++;
    loading.refresh = true;
    request
      .value({
        url: '/index/Activity/inviteAwardRecord',
        method: 'get',
        params: formData
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

  function onRefresh() {
    if (!token) return;
    formData.page = 0;
    loading.onload = true;
    loading.finished = false;
    toQuery();
  }

  function onLoad() {
    if (!token) return;
    toQuery();
  }

  function formChange(form: any) {
    Object.assign(formData, form);
    onRefresh();
  }

  return { loading, onRefresh, onLoad, priceList, formChange };
}
