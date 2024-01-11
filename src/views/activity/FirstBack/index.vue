<template>
  <div class="tiro-task">
    <GlobalLoading v-show="infoLoading" min-height="400px" align-row="flex-start" top="50%" />
    <div class="tiro-task-box">
      <van-image width="100%" :src="friendInvitationImg">
        <template #error>
          <img :src="pageHeaderDefaultImage" style="width:100%" alt="">
        </template>
        <template #loading>
          <ImageLoadBox />
        </template>
      </van-image>
      <div class="tiro-task-time" style="margin: 14px 0 0;">
        活动时间：
        <span v-if="+activityInfo.is_time_limit === 1">
          {{ parseTime(activityInfo.start_time, '{y}/{m}/{d}') }} -
          {{ parseTime(activityInfo.end_time, '{y}/{m}/{d}') }}
        </span>
        <span v-else>长期活动</span>
      </div>
      <div class="tiro-task-time">
        活动内容：
      </div>
      <div class="tiro-task-table">
        <div class="table-header">
          <div>首充金额</div>
          <div>奖金上限</div>
          <div>流水倍数</div>
          <div>名额上限</div>
        </div>
        <div class="table-body" :class="{ 'has-back': true }">
          <div>≥{{ contentLists.low_deposit_money }}</div>
          <div>{{ contentLists.bonus_cap }}</div>
          <div>{{ activityInfo?.shuffle_rate }}</div>
          <!--          <div>{{ contentLists.num }}</div>-->
          <div>{{ hasReceive >= 200 ? 500 : hasReceive }}/500</div>
        </div>
      </div>
      <div class="list-button" :class="{ 'is-click': isReceive }" @click.stop="toGetPrice">
        <van-loading v-show="receiveLoading" type="spinner" size="18px" />
        <span>立即领取</span>
      </div>
      <div class="tiro-task-time">
        活动规则
      </div>
      <div class="rule-box-item">
        1.首充值金额≥{{ contentLists.low_deposit_money }}元即可在活动页面申请一次首充活动，此活动仅限500名额。
      </div>
      <div class="rule-box-item">
        2.首次充值后如有提款操作则无法申请此活动，领取首充奖金后会员需完成三倍有效流水即可提款，此活动不可与其它活动共享。 例：本金188元，奖金188元 （188+188）*3=1128元
      </div>
      <div class="rule-box-item">
        3.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133，串关、走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）。
      </div>
      <div class="rule-box-item">
        4.每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能享受一次活动，对违规的会员，平台保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
      </div>
      <div class="rule-box-item">
        5.凡参加活动用户，即表示接受且自愿遵守平台规定，平台保留最终解释权。
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue';
import defaultImages from '@/hooks/defaultImages';
import GlobalLoading from '@/components/Loading/index.vue';
import { Toast } from 'vant';
import activityPageHook from '@/hooks/activityPage';
import { parseTime } from '@/utils/index.js';
import ImageLoadBox from '@/components/ImageLoadBox/index.vue';

const defaultInfo = {
  send_type: 0,
  low_deposit_money: 0,
  ratio: 0,
  bonus_cap: 0,
  num: 0
};

export default defineComponent({
  name: 'FirstBack',
  components: { GlobalLoading, ImageLoadBox },
  setup() {
    const { pageHeaderDefaultImage } = defaultImages();

    const { infoLoading, activityInfo, request, token } = activityPageHook();

    const friendInvitationImg = require('@/assets/activity/first-back-header.png');

    const contentLists = computed(() => {
      if (activityInfo?.activity_template_content) {
        return JSON.parse(activityInfo.activity_template_content) || defaultInfo;
      } else {
        return defaultInfo;
      }
    });

    const receiveLoading = ref(false);

    function toGetPrice() {
      if (!token.value) return;
      if (!isReceive.value || receiveLoading.value) return;
      receiveLoading.value = true;
      request
        .value({
          url: '/index/Activity/firstRechargeCashBackApply',
          method: 'get'
        })
        .then((res: any) => {
          // eslint-disable-next-line eqeqeq
          if (res.code == 1) {
            isReceive.value = false;
            Toast.success(`奖金领取成功！`);
          } else {
            Toast(res.msg || res.message);
          }
        })
        .finally(() => {
          receiveLoading.value = false;
        });
    }

    const isReceive = ref(false);

    const hasReceive = ref(0);

    function getStatus() {
      if (!token.value) return (isReceive.value = false);
      request
        .value({
          url: '/index/Activity/firstRechargeCashBackStatus',
          method: 'get'
        })
        .then((res: any) => {
          if (+res.code === 1) {
            isReceive.value = (Boolean(Number(res.data.status)) && !!Number(res.data.money)) || false;
            hasReceive.value = res.data.count;
            if (isReceive.value && Number(res.data.money)) {
              Toast.success(`您当前可领取的奖金为 ${res.data.money} 元`);
            }
          } else {
            isReceive.value = false;
            Toast(res.msg || res.message);
            // Toast(res.msg || res.message)
          }
        })
        .catch(() => {
          isReceive.value = false;
        });
    }

    onMounted(() => {
      nextTick(() => {
        getStatus();
      });
    });

    return {
      pageHeaderDefaultImage,
      contentLists,
      friendInvitationImg,
      isReceive,
      toGetPrice,
      infoLoading,
      receiveLoading,
      activityInfo,
      token,
      parseTime,
      hasReceive
    };
  }
});
</script>

<style lang="less" scoped>
.list-button {
  height: 40px;
  border-radius: 8px;
  background-color: #808080;
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
  cursor: not-allowed;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    margin-left: 10px;
  }
}

.is-click {
  background-image: linear-gradient(to right, #12dedf, #07c79c);
  color: #130e0e;
  cursor: pointer;

  &:hover {
    box-shadow: 20px 20px 40px #11dcd9 inset;
  }

  &:active {
    box-shadow: 20px 20px 40px #235f5e inset;
  }
}

.tiro-task {
  .tiro-task-info {
    width: calc(100% - 2px) !important;
    height: 40px;
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    border: solid 1px #6e7e8b;
    align-items: center;
    border-radius: 8px;
    margin-top: 10px;

    > div {
      padding: 0 15px;
    }
  }

  .tiro-task-box {
    height: 100%;
    margin: auto;
    width: calc(100% - 30px);
    overflow: auto;
    display: flex;
    align-items: center;
    flex-direction: column;

    > div {
      flex-shrink: 0;
      width: 100%;
    }

    .tiro-task-time {
      margin: 14px 0;
      font-family: PingFang-SC, serif;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
    }

    .tiro-task-content {
      margin: 0 0 14px;
      font-family: PingFang-SC, serif;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
    }
  }

  .tiro-task-table {
    overflow: hidden;
    border-bottom: 1px #2d363d solid;
    border-radius: 8px;

    > div {
      display: flex;
      justify-content: space-between;

      > div {
        width: 25%;
        height: 40px;
        line-height: 40px;
        text-align: center;
      }
    }

    .table-header {
      background-color: #3e4a53;
      font-weight: bold;

      > div {
        color: #fff;
        font-size: 14px;
      }
    }

    .table-body {
      > div {
        color: #c2cdd5;
        font-size: 13px;
      }
    }

    .has-back {
      background-color: #2d363d;
    }
  }

  .rule-box-item {
    font-family: PingFang-SC, serif;
    font-size: 13px;
    margin: 5px 0;
    color: #c2d2df;
  }

  .get-button {
    background-image: linear-gradient(to right, #12dedf, #07c79c);
    height: 40px;
    border-radius: 8px;
    color: #130e0e;
    line-height: 40px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    margin: 10px 0 20px;
  }

  .tiro-task-button-group {
    display: flex;
    justify-content: space-between;

    > div {
      width: 31%;
      flex-shrink: 0;
      height: 32px;
      border-radius: 17px;
      color: #fff;
      font-family: PingFang-SC;
      font-size: 12px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      border: 1px #11dcd9 solid;
    }
  }

  .qr-image {
    margin: 16px auto;
  }
}
</style>
