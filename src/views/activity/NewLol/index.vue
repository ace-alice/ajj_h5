<template>
  <div class="main">
    <img class="main-banner" :src="require('@/assets/activity/new-lol.png')" alt="" />
    <div class="ac-content">
      <div class="title-tag">活动规则</div>
      <p class="ac-time">
        活动时间：<span v-if="+activityInfo.is_time_limit === 1">
          {{ parseTime(activityInfo.start_time, '{y}/{m}/{d}') }} -
          {{ parseTime(activityInfo.end_time, '{y}/{m}/{d}') }}
        </span>
        <span v-else>长期活动</span>
      </p>
      <div class="table-title">
        <div class="table-td--left w33 center">累计投注金额</div>
        <div class="table-td--mid w33 center">返水比例</div>
        <div class="table-td--right w33 center">奖金上限</div>
      </div>
      <div class="table-body">
        <div class="table-tr">
          <div class="table-td--left w33 center">{{ getTemplate.total_bet_amount }}元</div>
          <div class="table-td--mid w33 center">{{ getTemplate.rebate_ratio }}%</div>
          <div class="table-td--right w33 center">{{ getTemplate.max_rebate_amount }}元</div>
        </div>
      </div>
      <div class="calc-box">
        <p>今日累计投注{{ betInfo.total_bet_amount }}元，预计可获得{{ betInfo.rebate_amount }}元奖金。</p>
        <div class="bet-btn" @click.stop="toPath('Home')">前往投注</div>
      </div>
    </div>
    <div class="bonus-list">
      <div class="title-tag">我的奖金</div>
      <div class="table-title">
        <div class="table-td--left">获取时间</div>
        <div class="table-td--right">我的奖金</div>
      </div>
      <div class="table-body">
        <div class="table-tr" v-for="(item, index) in bonusList" :key="index">
          <div class="table-td--left">{{ parseTime(item.rebate_time) }}</div>
          <div class="table-td--right">{{ item.rebate_amount }}元</div>
        </div>
      </div>
    </div>
    <div class="rules">
      <div class="title-tag">活动规则</div>
      <p>1.会员每日在电竞盘口投注累计≥500元即可获得2‰返水 加成奖励。</p>
      <p>
        2.活动加成奖金系统自动派发，奖金需完成一倍流水即可 提款。
      </p>
      <p>
        3.电竞赔率：＜1.5，串关、走盘，注单取消，对冲等情况 都不算有效流水。（虚拟游戏投注不计算在有效流水内）
      </p>
      <p>
        4.每位有效会员、手机号码、电子邮箱、银行卡、IP地址、 每台设备仅限一个账户享受此活动，对违规的会员，平台
        保留无限期审核，如发现恶意刷取活动套利者，将扣除红 利及所得盈利。
      </p>
      <p>
        5.凡参加活动会员，即表示接受且自愿遵守平台规定，平 台保留最终解释权。
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import activityPageHook from '@/hooks/activityPage';
import webViewBridgeHook from '@/hooks/webViewBridge';
import { computed, defineComponent, nextTick, onMounted, Ref, ref } from 'vue';
import { parseTime } from '@/utils/index.js';

export default defineComponent({
  setup() {
    const { activityInfo, request, token } = activityPageHook();

    const getTemplate = computed(() => {
      if (activityInfo.activity_template_content) {
        return JSON.parse(activityInfo.activity_template_content) || {};
      } else {
        return {
          total_bet_amount: '',
          rebate_ratio: '',
          max_rebate_amount: '',
          venue_ids: ''
        };
      }
    });

    const betInfo = ref({
      rebate_amount: null,
      total_bet_amount: null
    });

    async function getSportsRebateInfo() {
      request.value({ url: '/index/Activity/sportsRebateInfo', method: 'get' }).then((data: any) => {
        console.log(data);
        if (data.code == 1) {
          Object.assign(betInfo.value, data.data);
        }
      });
    }

    const { routeGo } = webViewBridgeHook();

    function toPath(name: string) {
      routeGo(name);
    }

    const bonusList = ref([]);
    async function getMemberSportsRebateList() {
      bonusList.value = [];
      request.value({ url: '/index/Activity/memberSportsRebateList', method: 'get' }).then((data: any) => {
        if (data.code == 1) {
          bonusList.value = data.data.data;
        }
      });
    }

    onMounted(() => {
      nextTick(() => {
        getSportsRebateInfo();
        getMemberSportsRebateList();
      });
    });
    return {
      getTemplate,
      bonusList,
      betInfo,
      toPath,
      parseTime,
      activityInfo
    };
  }
});
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
p {
  margin: 0;
}
.main {
  width: 100%;
  background-image: linear-gradient(180deg, #564072 0%, #231931 94%);
  min-height: 100%;
  overflow: auto;
}
.main-banner {
  width: 100%;
}
.table-container {
  background-color: #fff;
  border-radius: 8px 50px 8px 8px;
  width: 313px;
  margin: 0 auto;
  padding-top: 12px;
  position: relative;
}
.rules {
  width: 313px;
  margin: 0 auto;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #b0dec5;
  line-height: 20px;
  font-weight: 400;
  margin-bottom: 42px;
  .title-tag {
    margin: 24px 0 24px -9px;
  }
  p {
    margin-bottom: 4px;
  }
}
.table-container--1 {
  margin-top: -20px;
  position: relative;
  z-index: 20;
  margin-bottom: 24px;
}
.title-tag {
  background-image: url(../../../assets/activity/lol-title.png);
  background-size: 100% 100%;
  border-radius: 12px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #241a31;
  text-align: right;
  font-weight: 500;
  width: 161px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.title-text {
  line-height: 17px;
  padding: 9px 41px 9px 0;
  padding-left: 26px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #2c4725;
  text-align: left;
  font-weight: 400;
}
.table-title {
  height: 36px;
  line-height: 36px;
  display: flex;
  background-image: linear-gradient(180deg, #9377b7 0%, #664a89 100%);
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
}
.table-td--left {
  width: 207px;
  padding-left: 37px;
}
.table-td--right {
  width: 106px;
}
.w33 {
  width: 33.33%;
  padding: 0;
}
.center {
  text-align: center;
}
.table-body {
  padding-top: 6px;
  padding-bottom: 12px;
  background-color: #261f35;
  border-radius: 0 0 8px 8px;
}
.table-tr {
  line-height: 34px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
  display: flex;
}
.ac-content {
  margin: 32px 26px 0;
}
.ac-time {
  margin-top: 8px;
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #ffffff;
  line-height: 26px;
  font-weight: 500;
  margin-bottom: 12px;
}
.calc-box {
  background: #261f35;
  border-radius: 8px;
  margin: 24px 0 0;
  height: 104px;
  border-radius: 8px;
  text-align: center;
  padding-top: 12px;
  p {
    font-family: PingFangSC-Medium;
    font-size: 12px;
    color: #ffffff;
    line-height: 26px;
    font-weight: 500;
  }
  .bet-btn {
    background: #04b980;
    border-radius: 16px;
    width: 140px;
    height: 32px;
    line-height: 32px;
    margin: 14px auto 0;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #ffffff;
    font-weight: 500;
  }
}
.bonus-list {
  margin: 24px 26px;
  .title-tag {
    margin-bottom: 16px;
  }
}
</style>
