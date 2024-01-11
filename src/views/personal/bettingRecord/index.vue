<template>
  <div class="v-betting-record">
    <TransactionHeader />
    <div class="v-betting-record-main">
      <!--      <div class="v-transaction-record-header">-->
      <!--        <div-->
      <!--          v-for="state in gameList"-->
      <!--          :key="state.id"-->
      <!--          :class="formData.game_id === state.id ? 'active' : ''"-->
      <!--          @click="gameTypeChange(state)"-->
      <!--        >-->
      <!--          {{ state.label }}-->
      <!--        </div>-->
      <!--      </div>-->
      <RecordTime @timeChange="timeChange" />
      <TotalDetail v-show="tradeRecordList.length > 0" :data="statisticsObj" />
      <!--交易记录列表-->
      <div class="betting-search-list">
        <van-pull-refresh v-model="tradeRefreshing" success-text="刷新成功" @refresh="tradeOnRefresh">
          <van-list v-model:loading="tradeLoading" :finished="tradeFinished" @load="tradeOnLoad">
            <template #finished>
              <span v-if="tradeRecordList.length > 0" style="margin-bottom:20px">
                没有更多了~
              </span>
              <NoDataPage v-else />
            </template>
            <transition-group name="more" :css="false" @before-enter="beforeEnter" @enter="paragraphEnter">
              <BetItem
                v-for="(item, index) in tradeRecordList"
                :key="item.game_order"
                :detail="item"
                class="betting-search-list-col"
                :data-index="index % 10"
                @click="goGuessDetails(item)"
              />
            </transition-group>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
    <!--    筛选弹窗-->
    <div class="v-transaction-record-popup">
      <van-popup v-model:show="transactionPopup" position="top" :style="{ height: 'auto' }">
        <div class="popup-main">
          <div class="popup-main-currency">
            <span>
              游戏名称
            </span>
            <div class="popup-main-currency-list">
              <span
                v-for="state in gameList"
                :key="state.id"
                :class="formData.game_id === state.id ? 'trade-active' : ''"
                @click="gameTypeChange(state)"
              >
                {{ state.label }}</span>
            </div>
          </div>
        </div>
        <div class="popup-button">
          <span @click="tradeReset">重置</span>
          <span @click="tradeSure">确定</span>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, toRefs } from 'vue';
import TransactionHeader from './components/TransactionHeader/index.vue';
import useCurrentInstance from '@/hooks/useCurrentInstance';
import RecordTime from '../components/RecordTime/index.vue';
import { useRouter } from 'vue-router';
import BetItem from './components/betItem/index.vue';
import TotalDetail from './components/TotalDetail/index.vue';
import { parseTime } from '@/utils/index.js';
import { getBetRecordList } from '@/api/bettingRecord.js';
import NoDataPage from '@/components/noData/index.vue';
import listAnimateHook from '@/hooks/listAnimate';

export default defineComponent({
  name: 'BettingRecord',
  components: {
    TransactionHeader,
    RecordTime,
    BetItem,
    TotalDetail,
    NoDataPage
  },
  setup() {
    /**
     * 获取挂载在全局的属性和获取上下文
     */
    const { proxy } = useCurrentInstance();
    const router = useRouter();
    const state: any = reactive({
      /**
       * 投注列表
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
       * 游戏列表
       */
      gameList: [
        // {
        //   id: 0,
        //   label: '全部'
        // },
        {
          id: 1,
          label: '小艾电竞'
        },
        {
          id: 4,
          label: '小艾体育'
        },
        {
          id: 5,
          label: 'AG真人'
        },
        {
          id: 3,
          label: '平博体育'
        },
        {
          id: 2,
          label: '沙巴体育'
        }
      ],
      list: []
    });

    const formData = reactive({
      start_time: parseTime(new Date(), '{y}-{m}-{d}'),
      end_time: parseTime(new Date(), '{y}-{m}-{d}'),
      game_id: 1,
      status: -1,
      page: 0,
      limit: 10
    });

    const statisticsObj = reactive({
      total_amount: 0,
      total_bet: 0,
      total_winlose: 0
    });

    /**
     * 交易记录下拉刷新
     */
    const tradeOnRefresh = () => {
      state.tradeFinished = false;
      state.tradeLoading = true;
      state.tradeRefreshing = true;
      Object.assign(formData, { page: 0 });
      tradeOnLoad();
    };
    /**
     * 注单列表数据加载
     */
    const tradeOnLoad = () => {
      formData.page++;
      getBetRecordList(formData)
        .then((res: any) => {
          if (+res.code === 1) {
            if (formData.page === 1) {
              state.tradeRecordList = res.data.data;
            } else {
              state.tradeRecordList = [...state.tradeRecordList, ...res.data.data];
            }
            Object.assign(statisticsObj, {
              total_amount: res.data.total_amount,
              total_bet: res.data.total_bet,
              total_winlose: res.data.total_winlose
            });
            if (state.tradeRecordList.length === +res.data.total) {
              state.tradeFinished = true;
            }
          } else {
            state.tradeFinished = true;
          }
        })
        .catch(() => {
          state.tradeFinished = true;
        })
        .finally(() => {
          state.tradeLoading = false;
          state.tradeRefreshing = false;
        });
    };
    /**
     * 注单状态点击事件
     */
    const statusChange = (row: any) => {
      formData.status = row.id;
    };
    /**
     * 游戏点击事件
     */
    const gameTypeChange = (row: any) => {
      formData.game_id = row.id;
      // tradeOnRefresh();
    };

    /**
     * 交易记录条件重置
     */
    const tradeReset = () => {
      formData.status = -1;
      formData.game_id = 1;
    };
    /**
     * 交易记录条件确定
     */
    const tradeSure = () => {
      state.transactionPopup = false;
      tradeOnRefresh();
    };
    /**
     * 跳转注单详情
     */
    const goGuessDetails = (row: any) => {
      router.push({
        name: 'GuessDetails',
        query: { game_id: row.game_id, order: row.game_order }
      });
    };

    /** *
     * 时间改变方法
     */
    function timeChange(value: any) {
      Object.assign(formData, value);
      tradeOnRefresh();
    }

    const { beforeEnter, paragraphEnter } = listAnimateHook();

    onMounted(() => {
      // tradeOnLoad()
      /**
       * 接收筛选弹窗
       */
      proxy.mittBus.on('transactionFilter', (val: boolean) => {
        // tradeReset()
        state.transactionPopup = val;
      });
    });
    onUnmounted(() => {
      proxy.mittBus.off('transactionFilter');
    });
    return {
      ...toRefs(state),
      statusChange,
      gameTypeChange,
      tradeReset,
      tradeSure,
      tradeOnRefresh,
      tradeOnLoad,
      goGuessDetails,
      timeChange,
      formData,
      statisticsObj,
      beforeEnter,
      paragraphEnter
    };
  }
});
</script>

<style lang="less" scoped>
.v-betting-record {
  width: 100%;
  &-main {
    margin: 48px 15px 15px 15px;
    height: 100%;
    .betting-search-list {
      height: calc(100% - 125px);
      overflow: auto;
    }
  }

  .v-transaction-record-header {
    width: 100%;
    margin: 48px auto 10px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;

    > div {
      width: calc(33.3% - 6px);
      text-align: center;
      height: 32px;
      line-height: 32px;
      border-radius: 16px;
      background-color: #3e4a53;
      color: #b6c1cb;
    }

    .active {
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      color: #000;
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
      top: 85px;
      background-color: #1c2227;
    }
  }
}
</style>
