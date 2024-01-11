<template>
  <div class="v-bulletin-main-tab">
    <van-pull-refresh
      v-model="loading.refresh"
      @refresh="onRefresh"
      class="refresh"
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

        <transition-group
          name="more"
          appear
          v-bind:css="false"
          v-on:before-enter="beforeEnter"
          v-on:enter="paragraphEnter"
        >
          <BullentinItem
            v-for="(item, index) in bulletinList"
            :key="item.id"
            :item="item"
            v-bind:data-index="index % 10"
            @click="goBulletinDetails(item)"
          />
        </transition-group>
      </van-list>
    </van-pull-refresh>
    <van-popup
      v-model:show="showDetail"
      :style="{
        height: '100%',
        width: '100%',
        background: '#1c2227'
      }"
      position="left"
    >
      <BulletinDetails :detail="isDetail" v-if="showDetail" />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { getAnnouncement } from '@/api/message.js'
import listAnimateHook from '@/hooks/listAnimate'
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  reactive,
  Ref,
  ref
} from 'vue'
import BullentinItem from './components/BullentinItem.vue'
import BulletinDetails from '../../bulletinDetails/index.vue'
import NoDataPage from '@/components/noData/index.vue'

export default defineComponent({
  name: 'BulletinList',
  components: { BullentinItem, BulletinDetails, NoDataPage },
  setup() {
    const bulletinList: Ref<any[]> = ref([])
    const goBulletinDetails = (row: any) => {
      isDetail.value = row
      showDetail.value = true
    }
    const loading = reactive({
      refresh: false,
      onload: false,
      finished: false
    })

    let formData = reactive({
      page: 0,
      limit: 10
    })

    /**
     * 获取公告列表
     */
    const getAnnouncementFun = () => {
      formData.page++
      getAnnouncement(formData)
        .then((result: any) => {
          if (result.code == 1) {
            if (formData.page == 1) {
              bulletinList.value = result.data.data
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

    const showDetail = ref(false)

    const isDetail = ref({})

    const { proxy } = getCurrentInstance() as any

    onMounted(() => {
      proxy.mittBus.on('changeBShowDetail', (val: boolean) => {
        onRefresh()
        showDetail.value = val
      })
    })
    onUnmounted(() => {
      proxy.mittBus.off('changeBShowDetail')
    })
    return {
      goBulletinDetails,
      bulletinList,
      loading,
      getAnnouncementFun,
      beforeEnter,
      paragraphEnter,
      showDetail,
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
