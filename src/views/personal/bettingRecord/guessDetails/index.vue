<template>
  <div class="v-guess-details">
    <PubHeader :right-icon="false" />
    <transition name="more" appear :css="false" @before-enter="beforeEnter" @enter="paragraphEnter">
      <div class="v-guess-details-main" :data-index="3">
        <div class="guess-info">
          <div>
            <span>游戏名称</span>
            <span class="van-ellipsis">{{ detail.game_venue }}</span>
          </div>
          <div v-if="detail.team_home_name && detail.team_away_name">
            <span>战队名称</span>
            <span class="van-ellipsis"><span>{{ detail.team_home_name }}</span>
              <span class="vs">VS</span>
              <span>{{ detail.team_away_name }}</span></span>
          </div>
          <div>
            <span>竞猜类型</span>
            <span class="van-ellipsis">{{ detail.game_name }}</span>
          </div>
          <div v-if="detail.game_event">
            <span>赛事名称</span>
            <span class="van-ellipsis">{{ detail.game_event }}</span>
          </div>
          <div>
            <span>竞猜详情</span>
            <span class="van-ellipsis">{{ detail.game_detail }}</span>
          </div>
          <div>
            <span>盘口类型</span>
            <span>{{ detail.game_type }}</span>
          </div>
          <div>
            <span>竞猜单号</span>
            <span>{{ detail.game_order }} <span style="margin-left:10px"><Clipboard :message="detail.game_order" /></span></span>
          </div>
          <div>
            <span>竞猜时间</span>
            <span>{{ detail.game_order_time }}</span>
          </div>
          <!-- <div>
          <span>投注币种</span>
          <span>CNY</span>
        </div> -->
          <div>
            <span>投注金额</span>
            <span class="num">{{ priceToFixed(detail.bet_amount) }}</span>
          </div>
          <div v-if="detail.bet_odds">
            <span>结算赔率</span>
            <span class="num">{{ priceToFixed(detail.bet_odds) }}</span>
          </div>
          <div>
            <span>结算金额</span>
            <span :style="{ color: setColor(Number(detail.bet_winlost))[0] }">
              {{ setColor(Number(detail.bet_winlost))[1] }}
              {{ priceToFixed(detail.bet_winlost) }}
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import PubHeader from '@/components/PubHeader/index.vue';
import { getBetRecordDetail } from '@/api/bettingRecord.js';
import { useRoute } from 'vue-router';
import Clipboard from '@/components/Clipboard/index.vue';
import listAnimateHook from '@/hooks/listAnimate';
import { priceToFixed } from '@/utils/index.js';

export default defineComponent({
  components: {
    PubHeader,
    Clipboard
  },
  setup() {
    const detail = ref({});

    const loading = ref(false);

    const route = useRoute();

    const queryData = computed(() => {
      return route.query;
    });

    function setColor(num: number) {
      const n = Number(num);
      if (n > 0) {
        return ['#07c160', '+'];
      } else if (n < 0) {
        return ['#ee0a24', ''];
      } else {
        return ['#fff', ''];
      }
    }

    function getBetRecordDetailFun() {
      loading.value = true;
      getBetRecordDetail(queryData.value)
        .then((res: any) => {
          if (+res.code === 1) {
            detail.value = res.data;
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }

    const { beforeEnter, paragraphEnter } = listAnimateHook();

    onMounted(() => {
      getBetRecordDetailFun();
    });

    return { detail, setColor, beforeEnter, paragraphEnter, priceToFixed };
  }
});
</script>

<style lang="less" scoped>
.v-guess-details {
  overflow: auto;
  &-main {
    margin: 48px 15px 0 15px;

    .guess-info {
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      background-color: #2d363d;
      color: #fff;
      font-size: 12px;
      padding: 15px 17px;
      margin-top: 10px;
      > div {
        display: flex;
        height: 36px;
        line-height: 36px;
        > span:nth-child(1) {
          font-weight: 300;
          color: #b6c1cb;
        }
        > span:nth-child(2) {
          margin-left: 15px;
        }
        .vs {
          margin: 0 10px;
        }
      }
      div + div {
        border-top: 1px solid #3f4d57;
      }
    }
  }
  .num {
    font-weight: 600;
  }
}
</style>
