<template>
  <div class="main">
    <img class="main-banner" :src="require('@/assets/activity/five-game.png')" alt="" />
    <div class="table-container table-container--1">
      <div>
        <div class="title-tag">活动内容</div>
        <p class="title-text" style="padding-bottom:0">
          活动时间：<span v-if="activityInfo.is_time_limit === 1">
            {{ parseTime(activityInfo.start_time, '{y}/{m}/{d}') }} -
            {{ parseTime(activityInfo.end_time, '{y}/{m}/{d}') }}
          </span>
          <span v-else>长期活动</span>
        </p>
        <p class="title-text" style="padding-top:6px">
          会员每日投注任意五大联赛赛事，满足活动投注要求即可领取最高1188元奖金。
        </p>
      </div>
      <div class="table-title">
        <div class="table-td--left">每日投注金额</div>
        <div class="table-td--right">奖金</div>
      </div>
      <div class="table-body">
        <div class="table-tr">
          <div class="table-td--left">≥3000元</div>
          <div class="table-td--right">18元</div>
        </div>
        <div class="table-tr">
          <div class="table-td--left">≥6000元</div>
          <div class="table-td--right">28元</div>
        </div>
        <div class="table-tr">
          <div class="table-td--left">≥10000元</div>
          <div class="table-td--right">58元</div>
        </div>
        <div class="table-tr">
          <div class="table-td--left">≥20000元</div>
          <div class="table-td--right">128元</div>
        </div>
        <div class="table-tr">
          <div class="table-td--left">≥50000元</div>
          <div class="table-td--right">288元</div>
        </div>
        <div class="table-tr">
          <div class="table-td--left">≥100000元</div>
          <div class="table-td--right">688元</div>
        </div>
        <div class="table-tr">
          <div class="table-td--left">≥150000元</div>
          <div class="table-td--right">1188元</div>
        </div>
      </div>
    </div>
    <div class="table-container">
      <div>
        <p class="title-text">会员每周投注任意五大联赛赛事，满足活动投注要求即可领取最高8888元奖金。</p>
      </div>
      <div class="table-title">
        <div class="table-td--left">周累计投注金额</div>
        <div class="table-td--right">奖金</div>
      </div>
      <div class="table-body">
        <div class="table-tr">
          <div class="table-td--left">≥50000元</div>
          <div class="table-td--right">288元</div>
        </div>
        <div class="table-tr">
          <div class="table-td--left">≥100000元</div>
          <div class="table-td--right">588元</div>
        </div>
        <div class="table-tr">
          <div class="table-td--left">≥150000元</div>
          <div class="table-td--right">888元</div>
        </div>
        <div class="table-tr">
          <div class="table-td--left">≥200000元</div>
          <div class="table-td--right">1188元</div>
        </div>
        <div class="table-tr">
          <div class="table-td--left">≥500000元</div>
          <div class="table-td--right">3888元</div>
        </div>
        <div class="table-tr">
          <div class="table-td--left">≥800000元</div>
          <div class="table-td--right">5888元</div>
        </div>
        <div class="table-tr">
          <div class="table-td--left">≥1000000元</div>
          <div class="table-td--right">8888元</div>
        </div>
      </div>
      <img class="huoqiu" :src="require('@/assets/activity/huoqiiu.png')" alt="" />
    </div>
    <div class="rules">
      <div class="title-tag">活动规则</div>
      <p>1.活动投注仅限五大联赛赛事，凡参与五大联赛赛事投注会员每日、每周可获得两次返水奖励。</p>
      <p>
        2.投注赛事投注仅限独赢，让球，大小，单双四个盘口，允许投注上半场或全场及滚球，投注赛事赔率不得低于香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133。
      </p>
      <p>
        3.每周投注奖金需在每周一进行申请，提交申请内容为上周一至上周日已结算的注单。
      </p>
      <p>
        4.活动期间满足投注要求即可联系平台客服申请领取活动奖金，奖金将于申请后24小时内派发到中心钱包，领取奖金需完成一倍有效流水后即可提款。
      </p>
      <p>
        5.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133，串关、走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）
      </p>
      <p>
        6.每位有效会员、手机号码、电子邮箱、银行卡、IP地址、每台设备仅限一个账户享受此活动，对违规的用户，保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
      </p>
      <p>
        7.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import activityPageHook from '@/hooks/activityPage';
import { defineComponent } from 'vue';
import { parseTime } from '@/utils/index.js';

export default defineComponent({
  setup() {
    const { activityInfo } = activityPageHook();

    return {
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
  background-color: #152126;
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
  background-image: linear-gradient(90deg, #dc4c33 13%, #e67b66 92%);
  border-radius: 12px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
  width: 88px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  margin-left: -9px;
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
  height: 42px;
  line-height: 42px;
  display: flex;
  background-image: linear-gradient(90deg, #0a0708 3%, #534e47 100%);
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
}
.table-td--left {
  width: 207px;
  padding-left: 50px;
}
.table-td--right {
  width: 106px;
}
.table-body {
  height: 206px;
  padding-top: 6px;
  background-color: #dfe0d7;
  border-radius: 0 0 8px 8px;
}
.table-tr {
  line-height: 26px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #1c5134;
  font-weight: 500;
  display: flex;
}
.huoqiu {
  width: 94px;
  position: absolute;
  right: -5px;
  bottom: -60px;
}
</style>
