<template>
  <div class="tiro-task">
    <div class="tiro-task-box">
      <van-image width="100%" :src="friendInvitationImg">
        <template #error>
          <img :src="pageHeaderDefaultImage" style="width:100%" alt="" />
        </template>
        <template #loading>
          <ImageLoadBox />
        </template>
      </van-image>
      <div class="tiro-task-title">
        活动内容：
      </div>
      <div class="tiro-task-time">
        活动时间：
        <span v-if="+activityInfo.is_time_limit === 1">
          {{ parseTime(activityInfo.start_time, '{y}/{m}/{d}') }} -
          {{ parseTime(activityInfo.end_time, '{y}/{m}/{d}') }}
        </span>
        <span v-else>长期活动</span>
      </div>
      <div class="tiro-task-table">
        <div class="table-header">
          <div>晋升等级</div>
          <div>累计有效投注</div>
          <div>晋级奖金</div>
        </div>
        <div
          v-for="(content, index) in contentLists"
          :key="index"
          class="table-body"
          :class="{ 'is-current': String(content.id) === String(currentId) }"
        >
          <div>{{ content.level_name }}</div>
          <div>{{ toFixed2(content.total_valid) }}</div>
          <div>{{ content.amount }}</div>
        </div>
      </div>
      <div class="tiro-task-title">
        活动规则
      </div>
      <div class="rule-box-item rule-box-item-first">
        1.IA-Bet S2赛季晋级奖金每位会员每赛季仅限领取一次，根据会员赛季等级领取对应晋级奖金。
      </div>
      <div class="rule-box-item">
        2.晋级大奖赛单笔投注金额≥500元为有效投注。
      </div>
      <div class="rule-box-item">
        3.赛季结束后3个工作日内系统自动派发奖金到主钱包中，晋级赛等级将重置。
      </div>
      <div class="rule-box-item">
        4.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133，串关、走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）
      </div>
      <div class="rule-box-item">
        5.每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能享受一次活动，对违规的会员，平台保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
      </div>
      <div class="rule-box-item">
        6.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, Ref, ref } from 'vue';
import defaultImages from '@/hooks/defaultImages';
import activityPageHook from '@/hooks/activityPage';
import { parseTime, toFixed2 } from '@/utils/index.js';
import ImageLoadBox from '@/components/ImageLoadBox/index.vue';

export default defineComponent({
  name: 'GrandPrix',
  components: { ImageLoadBox },
  setup() {
    const { pageHeaderDefaultImage } = defaultImages();

    const friendInvitationImg = require('@/assets/activity/s2.png');

    const { activityInfo, request, token } = activityPageHook();

    const contentLists = computed(() => {
      if (activityInfo?.activity_template_content) {
        return JSON.parse(activityInfo.activity_template_content).config_arr || [];
      } else {
        return [];
      }
    });

    const currentId: Ref<string | number> = ref('0');

    function getStatus() {
      if (!token.value) return;
      request
        .value({
          url: '/index/Activity/qualifyInfo',
          method: 'get'
        })
        .then((res: any) => {
          if (+res.code === 1) {
            currentId.value = res.data.id;
          } else {
            currentId.value = '0';
          }
        })
        .catch(() => {
          currentId.value = '0';
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
      activityInfo,
      parseTime,
      toFixed2,
      currentId
    };
  }
});
</script>

<style lang="less" scoped>
.tiro-task {
  background-color: #192e3a;
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
    // width: calc(100% - 30px);
    overflow: auto;
    .tiro-task-time {
      margin: 14px 0 26px 0;
      font-family: PingFang-SC, serif;
      font-size: 12px;
      font-weight: bold;
      color: #fff;
      line-height: 26px;
      text-indent: 26px;
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
    margin: 0 26px;
    background: #101f23;
    border-radius: 0px 0px 16px 16px;
    padding-bottom: 5px;
    > div {
      display: flex;
      justify-content: space-between;

      > div {
        width: 33%;
        height: 34px;
        line-height: 34px;
        text-align: center;
      }
    }

    .table-header {
      background-image: linear-gradient(180deg, #245a67 0%, #04303b 100%);
      font-weight: bold;
      margin-bottom: 5px;
      > div {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #ffffff;
        font-weight: 500;
      }
    }

    .table-body {
      border-radius: 8px;
      > div {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #6c96a1;
        font-weight: 400;
      }
    }
  }

  .is-current {
    div {
      color: #ffffff !important;
    }
  }

  .rule-box-item {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #b6d8e2;
    line-height: 20px;
    font-weight: 400;
    margin: 0 40px 6px 35px;
    word-break: break-all;
    text-align: justify;
    &.rule-box-item-first {
      margin-top: 24px;
    }
    &:last-child{
      margin-bottom: 30px;
    }
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
      font-family: PingFang-SC, serif;
      font-size: 12px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      border: 1px #11dcd9 solid;
    }
  }
}
.tiro-task-title {
  background-image: linear-gradient(90deg, #245a67 5%, #04303b 78%);
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
  margin-top: 28px;
  text-indent: 26px;
  width: 164px !important;
  height: 28px;
  line-height: 28px;
}
</style>
