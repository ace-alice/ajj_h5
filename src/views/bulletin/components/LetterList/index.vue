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

        <van-checkbox-group v-model="checked" ref="checkboxGroup">
          <transition-group
            name="more"
            appear
            v-bind:css="false"
            v-on:before-enter="beforeEnter"
            v-on:enter="paragraphEnter"
          >
            <div
              v-for="(item, index) in placardList"
              :key="item.id"
              v-bind:data-index="index % 20"
              class="letter-item-box"
            >
              <div class="station-checkbox" v-if="placardStatus">
                <van-checkbox
                  :name="item.id"
                  icon-size="24px"
                  checked-color="#12dedf"
                />
              </div>
              <LetterItem :item="item" @click="goStationLetterDetails(item)" />
            </div>
          </transition-group>
        </van-checkbox-group>
      </van-list>
      <div class="v-empty"></div>
    </van-pull-refresh>
    <teleport to="#app">
      <transition name="van-slide-up">
        <div v-show="placardStatus" class="v-bulletin-footer">
          <div @click="bulletinCheckAll">全选</div>
          <div @click="bulletinHaveRead">标记已读</div>
          <div @click="bulletinDel">删除</div>
        </div>
      </transition>
    </teleport>
    <teleport to="#app">
      <div class="v-header-placard">
        <span v-if="!placardStatus" @click="bulletinEdit(true)">管理</span>
        <span v-else @click="bulletinEdit(false)">完成</span>
      </div>
    </teleport>
    <van-popup
      v-model:show="showDetail"
      teleport="#app"
      :style="{ height: '100%', width: '100%', background: '#1c2227' }"
      position="left"
    >
      <StationLetterDetails :detail="isDetail" v-if="showDetail" />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { getLetter, setReadLetter, delReadLetter } from '@/api/message.js'
import listAnimateHook from '@/hooks/listAnimate'
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  reactive,
  Ref,
  ref,
  watch
} from 'vue'
import LetterItem from './components/LetterItem.vue'
import StationLetterDetails from '../../stationLetterDetails/index.vue'
import { Toast } from 'vant'
import NoDataPage from '@/components/noData/index.vue'

export default defineComponent({
  name: 'BulletinList',
  components: { LetterItem, StationLetterDetails, NoDataPage },
  setup() {
    const placardList: Ref<any[]> = ref([])
    const checked = ref([])
    const showDetail = ref(false)
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
      getLetter(formData)
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

    /**
     * 站内信全选
     */
    const bulletinCheckAll = () => {
      if (proxy.$refs['checkboxGroup']) {
        proxy.$refs['checkboxGroup'].toggleAll()
      }
    }
    /**
     * 站内信已读
     */
    const bulletinHaveRead = () => {
      if (checked.value.length < 1) return
      setReadLetter({ ids: checked.value }).then((res: any) => {
        // console.log('站内信已读')
        if (res.code == 1) {
          checked.value = []
          Toast.success('操作成功')
          onRefresh()
        }
      })
    }
    /**
     * 站内信删除
     */
    const bulletinDel = () => {
      if (checked.value.length < 1) return
      delReadLetter({ ids: checked.value }).then((res: any) => {
        // console.log('删除成功')
        if (res.code == 1) {
          checked.value = []
          Toast.success('删除成功')
          onRefresh()
        }
      }).catch((err: any) => {
        Toast.fail(err.msg || err.message)
      })
    }
    /**
     * 跳转站内信详情
     */
    const goStationLetterDetails = (row: any) => {
      isDetail.value = row
      showDetail.value = true
    }

    function bulletinEdit(bool: boolean) {
      placardStatus.value = bool
    }

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
      proxy.mittBus.on('changeShowDetail', (val: boolean) => {
        showDetail.value = val
        onRefresh()
      })
    })
    onUnmounted(() => {
      proxy.mittBus.off('changeShowDetail')
    })
    return {
      goStationLetterDetails,
      placardList,
      loading,
      getLetterFun,
      beforeEnter,
      paragraphEnter,
      checked,
      placardStatus,
      bulletinCheckAll,
      bulletinHaveRead,
      bulletinDel,
      bulletinEdit,
      isDetail,
      showDetail,
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
  z-index: 2222;
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
    margin-top: 10px;
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
  z-index: 1001;

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
.v-header-placard {
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
