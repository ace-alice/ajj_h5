<template>
  <div class="v-bulletin-main-tab">
    <van-pull-refresh
      v-model="loading.refresh"
      class="refresh"
      @refresh="onRefresh"
    >
      <van-list
        v-model:loading="loading.onload"
        :finished="loading.finished"
        @load="onLoad"
      >
        <template #finished>
          <span v-if="bulletinList.length > 0" style="margin-bottom:20px">
            没有更多了~
          </span>
          <NoDataPage v-else />
        </template>

        <!--        <transition-group-->
        <!--          name="more"-->
        <!--          appear-->
        <!--          @before-enter="beforeEnter"-->
        <!--          @enter="paragraphEnter"-->
        <!--        >-->
        <ActivitiesItem
          v-for="(item, index) in bulletinList"
          :key="index"
          :item="item"
        />
        <!--        </transition-group>-->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script lang="ts">
import { rewardRecord } from '@/api/activities.js'
import listAnimateHook from '@/hooks/listAnimate'
import { defineComponent, onMounted, onUnmounted, reactive, Ref, ref } from 'vue'
import ActivitiesItem from './components/ActivitiesItem.vue'
import NoDataPage from '@/components/noData/index.vue'
import useCurrentInstance from '@/hooks/useCurrentInstance';

export default defineComponent({
  name: 'BulletinList',
  components: { ActivitiesItem, NoDataPage },
  setup() {
    /**
     * 获取挂载在全局的属性和获取上下文
     */
    const { proxy } = useCurrentInstance()
    const bulletinList: Ref<any[]> = ref([])
    const loading = reactive({
      refresh: false,
      onload: false,
      finished: false
    })

    const formData = reactive({
      page: 0,
      limit: 10
    })

    /**
     * 获取公告列表
     */
    const getAnnouncementFun = () => {
      formData.page++
      rewardRecord(formData)
        .then((result: any) => {
          if (+result.code === 1) {
            if (+formData.page === 1) {
              bulletinList.value = result.data.data
              // console.log(bulletinList.value)
            } else {
              bulletinList.value = [...bulletinList.value, ...result.data.data]
            }
            if (result.data.data.length < formData.limit) {
              loading.finished = true
            }
          } else {
            loading.finished = true
          }
        })
        .catch(() => {
          loading.finished = true
        })
        .finally(() => {
          loading.refresh = false
          loading.onload = false
        })
    }

    function onRefresh() {
      formData.page = 0
      loading.finished = false
      loading.onload = true
      getAnnouncementFun()
    }

    function onLoad() {
      getAnnouncementFun()
    }

    const { beforeEnter, paragraphEnter } = listAnimateHook()

    const isDetail = ref({})

    onMounted(() => {
      onRefresh()
      proxy.mittBus.on('activity', (val: number) => {
        if (val === 1) {
          onRefresh()
        }
      })
    })
    onUnmounted(() => {
      proxy.mittBus.off('activity')
    })
    return {
      bulletinList,
      loading,
      getAnnouncementFun,
      beforeEnter,
      paragraphEnter,
      isDetail,
      onRefresh,
      onLoad
    }
  }
})
</script>

<style lang="less" scoped>
.v-bulletin-main-tab {
  width: 100%;
  height: calc(100% - 106px);
  overflow: auto;

  .station {
    display: flex;
    width: 100%;
  }
  .station-checkbox {
    display: flex;
    width: 40px;
  }
}

.v-empty {
  height: 20vh;
  width: 100%;
}
</style>
