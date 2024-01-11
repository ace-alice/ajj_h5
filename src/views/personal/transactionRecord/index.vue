<template>
  <div class="v-transaction-record">
    <TransactionHeader />
    <div class="v-transaction-record-main">
      <RecordTime @timeChange="timeChange" />
      <!--交易记录列表-->
      <div class="search-list">
        <van-pull-refresh
          v-model="tradeRefreshing"
          success-text="刷新成功"
          @refresh="tradeOnRefresh"
        >
          <van-list
            v-model:loading="tradeLoading"
            :finished="tradeFinished"
            @load="tradeOnLoad"
          >
            <template #finished>
              <span
                v-if="tradeRecordList.length > 0"
                style="margin-bottom:20px"
              >
                没有更多了~
              </span>
              <NoDataPage v-else />
            </template>
            <transition-group
              name="more"
              appear
              :css="false"
              @before-enter="beforeEnter"
              @enter="paragraphEnter"
            >
              <TradeRecordItem
                v-for="(item, index) in tradeRecordList"
                :key="item.id"
                :data-index="index % 10"
                :index="index"
                :item="item"
                @click="toRouteDetail(item)"
              />
            </transition-group>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
    <!--筛选弹窗-->
    <div class="v-transaction-record-popup">
      <van-popup
        v-model:show="transactionPopup"
        get-container="myTransaction"
        position="top"
        :style="{ height: 'auto' }"
      >
        <div class="popup-main">
          <div class="popup-main-currency">
            <span>
              交易类型
            </span>
            <div class="popup-main-currency-list popup-main-currency-type">
              <span
                :class="formData.type == null ? 'trade-active' : ''"
                @click="tradeTypeClick(null)"
              >全部</span>
              <span
                v-for="type in tradeTypeList"
                :key="type.id"
                :class="formData.type == type.id ? 'trade-active' : ''"
                @click="tradeTypeClick(type)"
              >{{ type.title_cn }}</span>
            </div>
          </div>
        </div>
        <div class="popup-button">
          <span @click="tradeReset">重置</span>
          <span @click="tradeSure">确定</span>
        </div>
      </van-popup>
    </div>
    <van-popup
      v-model:show="showDetail"
      :style="{ height: '100%', width: '100%', background: '#1c2227' }"
    >
      <TransactionRecordDetail v-if="showDetail" :detail="detail" />
    </van-popup>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  Ref,
  toRefs
} from 'vue'
import TransactionHeader from './components/TransactionHeader/index.vue'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import RecordTime from '../components/RecordTime/index.vue'
import TradeRecordItem from './components/TradeRecordItem/index.vue'
import listAnimateHook from '@/hooks/listAnimate'
import NoDataPage from '@/components/noData/index.vue'
import { parseTime } from '@/utils/index.js'
import { getTradeRecordList, getTradeRecordType } from '@/api/tradeRecord.js'
import TransactionRecordDetail from './transactionRecordDetail/index.vue'

export default defineComponent({
  name: 'TransactionRecord',
  components: {
    TransactionHeader,
    RecordTime,
    TradeRecordItem,
    NoDataPage,
    TransactionRecordDetail
  },
  setup() {
    /**
     * 获取挂载在全局的属性和获取上下文
     */
    const { proxy } = useCurrentInstance()
    const myTransaction = document.querySelector('.v-transaction-record-main')
    const state: any = reactive({
      /**
       * 交易记录列表
       */
      tradeRecordList: [],
      /**
       * 筛选弹窗状态
       */
      transactionPopup: false,
      /**
       * 是否处于下拉状态
       */
      tradeRefreshing: false,
      /**
       * 是否处于加载状态
       */
      tradeLoading: false,
      /**
       * 是否已加载完成
       */
      tradeFinished: false,

      /**
       * 交易类型列表
       */
      tradeTypeList: []
    })

    function getTradeRecordTypeFun() {
      getTradeRecordType().then((result: any) => {
        // console.log(result)
        if (+result.code === 1) {
          state.tradeTypeList = result.data
        }
      })
    }

    const formData: any = reactive({
      type: null,
      start_time: parseTime(new Date(), '{y}-{m}-{d}'),
      end_time: parseTime(new Date(), '{y}-{m}-{d}'),
      page: 0,
      limit: 10
    })
    /**
     * 交易记录下拉刷新
     */
    const tradeOnRefresh = () => {
      state.tradeFinished = false
      state.tradeLoading = true
      state.tradeRefreshing = true
      Object.assign(formData, { page: 0 })
      tradeOnLoad()
    }
    /**
     * 交易记录数据加载
     */
    const tradeOnLoad = () => {
      formData.page++
      getTradeRecordList(formData)
        .then((res: any) => {
          if (res.code == 1) {
            if (formData.page == 1) {
              state.tradeRecordList = res.data.data
            } else {
              state.tradeRecordList = [
                ...state.tradeRecordList,
                ...res.data.data
              ]
            }
            if (state.tradeRecordList.length == res.data.total) {
              state.tradeFinished = true
            }
          } else {
            state.tradeFinished = true
          }
        })
        .catch(() => {
          state.tradeFinished = true
        })
        .finally(() => {
          state.tradeLoading = false
          state.tradeRefreshing = false
        })
    }
    /**
     * 交易类型点击事件
     */
    const tradeTypeClick = (row: any) => {
      if (!row) return (formData.type = null)
      formData.type = row.id
    }
    /**
     * 交易记录条件重置
     */
    const tradeReset = () => {
      formData.type = null
    }
    /**
     * 交易记录条件确定
     */
    const tradeSure = () => {
      state.transactionPopup = false
      tradeOnRefresh()
    }

    const detail: Ref<any> = ref({})

    const showDetail = ref(false)

    function toRouteDetail(row: any) {
      // router.push({
      //   name: 'TransactionRecordDetail',
      //   query: { id: row.id }
      // })
      detail.value = row
      showDetail.value = true
    }

    /** *
     * 时间改变方法
     */
    function timeChange(value: any) {
      Object.assign(formData, value)
      tradeOnRefresh()
    }

    const { beforeEnter, paragraphEnter } = listAnimateHook()
    onMounted(() => {
      getTradeRecordTypeFun()
      /**
       * 接收筛选弹窗
       */
      proxy.mittBus.on('transactionFilter', (val: boolean) => {
        // tradeReset()
        state.transactionPopup = val
      })
      proxy.mittBus.on('changeTranShowDetail', (val: boolean) => {
        showDetail.value = val
      })

      proxy.mittBus.emit('changeTranShowDetail', false)
    })
    onUnmounted(() => {
      proxy.mittBus.off('transactionFilter')
      proxy.mittBus.off('changeTranShowDetail')
    })
    return {
      ...toRefs(state),
      tradeTypeClick,
      tradeReset,
      tradeSure,
      tradeOnRefresh,
      tradeOnLoad,
      myTransaction,
      beforeEnter,
      paragraphEnter,
      formData,
      timeChange,
      toRouteDetail,
      showDetail,
      detail
    }
  }
})
</script>

<style lang="less" scoped>
.v-transaction-record {
  &-main {
    margin: 48px 15px 15px 15px;
    height: 100%;
    .search-list {
      margin-top: 14px;
      height: calc(100% - 91px);
      overflow: auto;
    }
  }
  .v-transaction-record-popup {
    position: relative;
    font-size: 12px;
    color: #b6c1cb;
    .popup-main {
      display: flex;
      flex-direction: column;
      padding: 15px 5px 15px 15px;
      &-currency {
        display: flex;
        flex-direction: column;
        span {
          line-height: 30px;
        }
        &-list {
          display: flex;
          .trade-active {
            background-image: linear-gradient(to right, #12dedf, #07c79c);
            color: #fff;
          }
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            width: calc(25% - 10px);
            height: 26px;
            border-radius: 13px;
            background-color: #3e4a53;
            margin: 5px 10px 5px 0;
          }
        }
        &-type {
          flex-flow: row wrap;
          align-content: flex-start;
        }
      }
    }
    .popup-button {
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      border-end-end-radius: 8px;
      border-end-start-radius: 8px;
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50%;
        height: 40px;
        background-color: #3e4a53;
      }
      span:nth-child(2) {
        background-image: linear-gradient(to right, #12dedf, #07c79c);
        color: #000;
      }
    }
    :deep(.van-popup--top) {
      top: 90px;
      background-color: #1c2227;
    }
  }
}
</style>
