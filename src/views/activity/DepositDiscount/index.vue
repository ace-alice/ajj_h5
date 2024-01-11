<template>
  <div class="tiro-task">
    <div class="tiro-task-box">
      <van-image width="100%" :src="pageHeaderImage">
        <template #error>
          <img :src="pageHeaderDefaultImage" style="width:100%" alt="">
        </template>
        <template #loading>
          <ImageLoadBox />
        </template>
      </van-image>
      <div class="tiro-task-time" style="margin: 14px 0;">
        活动时间：
        <span v-if="+activityInfo.is_time_limit === 1">
          {{ parseTime(activityInfo.start_time, '{y}/{m}/{d}') }} -
          {{ parseTime(activityInfo.end_time, '{y}/{m}/{d}') }}
        </span>
        <span v-else>长期活动</span>
      </div>
      <div class="tiro-task-content">
        活动内容
      </div>
      <div class="tiro-task-table">
        <div class="table-header">
          <div>充值金额</div>
          <div>奖金比例</div>
          <div>奖金上限</div>
        </div>
        <div class="table-body">
          <div>≥80USDT</div>
          <div>2%</div>
          <div>88USDT</div>
        </div>
      </div>
      <div class="tiro-task-time">
        活动规则
      </div>
      <div class="rule-box-item">
        1.会员每日单笔充值80USDT即可申请此活动，会员充值成功后奖金自动派发到中心钱包中。
      </div>
      <div class="rule-box-item">
        2.活动奖金需要完成一倍流水即可提款。
      </div>
      <div class="rule-box-item">
        3.每位有效会员、手机号码、电子邮箱、银行卡、IP地址、每台设备只能享受一次活动，对违规的会员，平台保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
      </div>
      <div class="rule-box-item">
        4.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import defaultImages from '@/hooks/defaultImages';
import activityPageHook from '@/hooks/activityPage';
import { parseTime } from '@/utils/index.js';
import ImageLoadBox from '@/components/ImageLoadBox/index.vue';

export default defineComponent({
  name: 'DepositDiscount',
  components: { ImageLoadBox },
  setup() {
    const { pageHeaderDefaultImage } = defaultImages();

    const pageHeaderImage = require('@/assets/activity/deposit.png');

    const { activityInfo } = activityPageHook();

    return {
      pageHeaderDefaultImage,
      pageHeaderImage,
      activityInfo,
      parseTime
    };
  }
});
</script>

<style lang="less" scoped>
.tiro-task {
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
      font-family: PingFang-SC;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
    }
    .tiro-task-content {
      margin: 0 0 14px;
      font-family: PingFang-SC;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
    }

    .tiro-task-button-group {
      display: flex;
      justify-content: space-between;
      > div {
        width: 31%;
        flex-shrink: 0;
        height: 40px;
        border-radius: 8px;
        background-color: #3e4a53;
        color: #c2cdd5;
        font-family: PingFang-SC;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }
      .button-active {
        background-image: linear-gradient(to right, #12dedf, #07c79c);
        color: #101213;
      }
    }
    .rule-box-item {
      font-family: PingFang-SC;
      font-size: 13px;
      margin: 5px 0;
      color: #c2d2df;
    }
  }
  .tiro-task-table {
    border-radius: 8px;
    overflow: hidden;
    > div {
      display: flex;
      justify-content: space-between;
      > div {
        width: 33%;
        height: 40px;
        line-height: 40px;
        text-align: center;
      }
    }
    .table-header {
      background-color: #3e4a53;
      > div {
        color: #fff;
        font-size: 14px;
      }
    }
    .table-body {
      background-color: #2d363d;
      > div {
        color: #c2cdd5;
        font-size: 13px;
      }
    }
  }
}
</style>
