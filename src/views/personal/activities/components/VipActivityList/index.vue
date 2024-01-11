<template>
  <div class="v-bulletin-main-tab">
    <van-pull-refresh v-model="loading.refresh" @refresh="onRefresh">
      <van-list
        v-model:loading="loading.onload"
        :finished="loading.finished"
        @load="onLoad"
      >
        <template #finished>
          <span v-if="placardList.length > 0" style="margin-bottom:20px">
            没有更多了~
          </span>
          <NoDataPage v-else />
        </template>
<!--        <transition-group-->
<!--            name="more"-->
<!--            appear-->
<!--            v-bind:css="false"-->
<!--            v-on:before-enter="beforeEnter"-->
<!--            v-on:enter="paragraphEnter"-->
<!--        >-->
          <div
            v-for="(item, index) in placardList"
            :key="index"
            class="letter-item-box"
          >
            <VipActivityItem :item="item" />
          </div>
<!--        </transition-group>-->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script lang="ts">
import listAnimateHook from '@/hooks/listAnimate'
import {
  defineComponent,
  getCurrentInstance,
  onMounted, onUnmounted,
  reactive,
  Ref,
  ref,
  watch
} from 'vue'
import VipActivityItem from './components/VipActivityItem.vue'
import { Toast } from 'vant'
import NoDataPage from '@/components/noData/index.vue'
import { vipRewardRecord } from '@/api/activities.js'

export default defineComponent({
  name: 'BulletinList',
  components: { VipActivityItem, NoDataPage },
  setup() {
    const placardList: Ref<any[]> = ref([])
    const checked = ref([])
    const isDetail = ref({})

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
    const getLetterFun = () => {
      formData.page++
      vipRewardRecord(formData)
        .then((result: any) => {
          if (result.code == 1) {
            if (formData.page == 1) {
              placardList.value = result.data.data
            } else {
              placardList.value = [...placardList.value, ...result.data.data]
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
      loading.finished = false
      loading.onload = true
      formData.page = 0
      getLetterFun()
    }

    function onLoad() {
      getLetterFun()
    }

    const placardStatus = ref(false)

    const { proxy } = getCurrentInstance() as any

    const { beforeEnter, paragraphEnter } = listAnimateHook()

    watch(
      () => loading,
      () => {
        placardStatus.value = false
      },
      {
        deep: true
      }
    )

    watch(
      () => placardStatus.value,
      () => {
        checked.value = []
      }
    )

    onMounted(() => {
      onRefresh()
      proxy.mittBus.on('vip-activity', (val: number) => {
        if (val === 1) {
          onRefresh()
        }
      })
    })
    onUnmounted(() => {
      proxy.mittBus.off('vip-activity')
    })
    return {
      placardList,
      loading,
      getLetterFun,
      beforeEnter,
      paragraphEnter,
      checked,
      placardStatus,
      isDetail,
      onRefresh,
      onLoad
    }
  }
})
</script>

<style lang="less" scoped>
:deep(.van-popup) {
  height: 100%;
  width: 100%;
}
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
  height: 60px;
  width: 100%;
}
.letter-item-box {
  width: 100%;
  display: flex;
  align-items: center;
  + .letter-item-box {
    //margin-top: 10px;
  }
}
.v-bulletin-footer {
  display: flex;
  height: 45px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    // width: 100px;
    flex-grow: 1;
    height: 45px;
    line-height: 45px;
    font-size: 12px;
    justify-content: center;
  }
  div:nth-child(1) {
    background-image: linear-gradient(to right, #12dedf, #07c79c);
    color: #fff;
  }
  div:nth-child(2) {
    background-color: #3e4a53;
    color: #b6c1cb;
  }
  div:nth-child(3) {
    background-color: #9e1f20;
    color: #fff;
  }
}
.v-header-r {
  z-index: 2001;
  position: fixed;
  top: 0;
  right: 0;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;

  span {
    background-image: linear-gradient(to right, #12dedf, #07c79c),
      linear-gradient(to bottom, #fff, #fff);
    font-size: 12px;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
