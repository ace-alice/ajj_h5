<template>
  <div class="game-experience">
    <div v-for="(game, index) in depositInfo" class="game-experience-list" :Key="'deposit' + index">
      <div class="list-box">
        <div class="list-box-top">
          <div>累计充值</div>
          <div>奖金</div>
        </div>
        <div class="list-box-bottom">
          <div>{{ game.deposit }}</div>
          <div>{{ game.amount }}</div>
        </div>
      </div>
      <div class="list-button" :class="{ disabled: +totalList.deposit_status !== 1 }" @click.stop="toGetPrice(0)">
        <van-loading v-show="totalList.deposit_Loading" type="spinner" size="18px" />
        <span>立即领取</span>
      </div>
    </div>
    <div v-for="(game, index) in betAmountInfo" class="game-experience-list" :Key="'deposit' + index">
      <div class="list-box">
        <div class="list-box-top">
          <div>累计投注</div>
          <div>奖金</div>
        </div>
        <div class="list-box-bottom">
          <div>{{ game.bet_amount }}</div>
          <div>{{ game.amount }}</div>
        </div>
      </div>
      <div class="list-button" :class="{ disabled: +totalList.bet_status !== 1 }" @click.stop="toGetPrice(1)">
        <van-loading v-show="totalList.bet_loading" type="spinner" size="18px" />
        <span>立即领取</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, reactive } from 'vue';
import activityPageHook from '@/hooks/activityPage';
import { Toast } from 'vant';

const defaultList = {
  total_deposit: 0,
  deposit_status: 0,
  deposit_amount: 0,
  deposit_Loading: false,
  total_bet: 0,
  bet_status: 0,
  bet_amount: 0,
  bet_loading: false
};

export default defineComponent({
  name: 'GameExperience',
  props: {
    activityInfo: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    const totalList = reactive(Object.assign({}, defaultList));

    const { request, token } = activityPageHook(false);

    const depositInfo = computed(() => {
      if (props.activityInfo.activity_template_content) {
        const temp = JSON.parse(props.activityInfo?.activity_template_content);
        if (temp.game) {
          return temp.game.deposit;
        } else {
          return [];
        }
      } else {
        return [];
      }
    });

    const betAmountInfo = computed(() => {
      if (props.activityInfo?.activity_template_content) {
        const temp = JSON.parse(props.activityInfo.activity_template_content);
        if (temp.game) {
          return temp.game.bet_amount;
        } else {
          return [];
        }
      } else {
        return [];
      }
    });

    function toGetPrice(index: number) {
      if (!token.value) return;
      if (index === 0 && (totalList.deposit_Loading || !Number(totalList.deposit_status))) return;
      if (index === 1 && (totalList.bet_loading || !Number(totalList.bet_status))) return;
      const url = ['/index/Activity/newTaskGameDepositApply', '/index/Activity/newTaskGameBetApply'];
      index === 0 ? (totalList.deposit_Loading = true) : (totalList.bet_loading = true);
      request
        .value({
          url: url[index],
          method: 'get'
        })
        .then((res: any) => {
          // eslint-disable-next-line eqeqeq
          if (+res.code === 1) {
            index === 0 ? (totalList.deposit_status = 0) : (totalList.bet_status = 0);
            index === 0 ? (totalList.deposit_Loading = false) : (totalList.bet_loading = false);
            Toast.success(`奖金领取成功！`);
          } else {
            Toast(res.msg || res.message);
          }
        })
        .finally(() => {
          index === 0 ? (totalList.deposit_Loading = false) : (totalList.bet_loading = false);
        });
    }

    function getStatus() {
      if (!token.value) return;
      request
        .value({
          url: '/index/Activity/newTaskGameCheck',
          method: 'get'
        })
        .then((res: any) => {
          if (+res.code === 1) {
            Object.assign(totalList, res.data);
          } else {
            Object.assign(totalList, defaultList);
            // Toast(res.msg || res.message)
          }
        })
        .catch(() => {
          Object.assign(totalList, defaultList);
        });
    }

    onMounted(() => {
      nextTick(() => {
        getStatus();
      });
    });
    return { totalList, toGetPrice, depositInfo, betAmountInfo };
  }
});
</script>

<style lang="less" scoped>
.game-experience {
  font-family: PingFang-SC, serif;
  flex-shrink: 0;
  .game-experience-list {
    width: 100%;
    padding: 10px 0;
    .list-box {
      overflow: hidden;
      border-radius: 8px;
      width: 100%;
      > div {
        height: 40px;
        display: flex;
        align-items: center;
        width: 100%;
        > div {
          width: 50%;
          text-align: center;
        }
      }
      .list-box-top {
        font-size: 14px;
        color: #fff;
        background-color: #3e4a53;
      }
      .list-box-bottom {
        font-size: 13px;
        color: #c2cdd5;
        background-color: #2d363d;
      }
    }
    .list-button {
      height: 38px;
      line-height: 38px;
      text-align: center;
      border-radius: 8px;
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      color: #0f1011;
      font-weight: bold;
      font-size: 14px;
      margin: 10px auto 0;
      cursor: pointer;
      display: flex;
      justify-content: center;
    }
    .disabled {
      background: #808080 !important;
      color: #fff;
      cursor: not-allowed;
    }
  }
}
</style>
