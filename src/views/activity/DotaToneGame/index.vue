<template>
  <div class="main">
    <img class="main-banner" :src="require('@/assets/activity/t1banner.png')" alt="" />
    <div class="ac-content">
      <div class="title-tag">
        <img :src="require('@/assets/activity/ti-title-left.png')" alt="" />
        <span>活动内容</span>
        <img :src="require('@/assets/activity/ti-title-right.png')" alt="" />
      </div>
      <p class="ac-time">
        活动时间：<span v-if="+activityInfo.is_time_limit === 1">
          {{ parseTime(activityInfo.start_time, '{y}/{m}/{d}') }} -
          {{ parseTime(activityInfo.end_time, '{y}/{m}/{d}') }}
        </span>
        <span v-else>长期活动</span>
      </p>
      <div class="v-envelope-main-tabs">
        <van-tabs v-model:active="redEnvelopeActive" @click-tab="redEnvelopeClickTab">
          <van-tab title="竞技大师" :name="19"> </van-tab>
          <van-tab title="竞技加码奖金" :name="20"> </van-tab>
          <van-tab title="竞技复活金" :name="21"> </van-tab>
        </van-tabs>
      </div>
      <div class="table-title">
        <div class="table-td center" v-for="item in getTemplate.result_arr[0]" :key="item">{{ item }}</div>
      </div>
      <div class="table-body">
        <div class="table-tr" v-for="(item, index) in getTemplate.result_arr.slice(1)" :key="index">
          <div class="table-td center" v-for="child in item" :key="child">{{ child }}</div>
        </div>
      </div>
      <div class="calc-box" v-if="redEnvelopeActive != 20">
        <p>TI赛事期间单笔盈利≥500元投注为有效注单，满足盈利注单笔数请在TI赛事结束后申请领取奖金。</p>
        <div class="bet-btn" @click.stop="showPopup = true">立即申请</div>
      </div>
    </div>
    <div class="rules">
      <div class="title-tag" style="margin: 24px 0">
        <img :src="require('@/assets/activity/ti-title-left.png')" alt="" />
        <span>活动规则</span>
        <img :src="require('@/assets/activity/ti-title-right.png')" alt="" />
      </div>
      <p>1.活动盘口仅限小艾电竞，投注赛事仅限TI 11为有效投注。</p>
      <p>
        2.赛事投注仅限独赢，让球，大小，单双四个盘口，允许投注上半场或全场及滚球，投注赛事赔率不得低于＜1.5。
      </p>
      <p>
        3.此活动不可与其它充值活动共享，领取奖金需完成一倍有效流水即可提款。
      </p>
      <p>
        4.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133，串
        关、走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）
      </p>
      <p>
        5.每位有效会员、手机号码、电子邮箱、银行卡、IP地址、每台设备仅限一个账户享受此活动，对违规的用户，保留
        无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
      </p>
      <p>
        6.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。
      </p>
    </div>
  </div>
  <van-popup
    v-model:show="showPopup"
    position="bottom"
    :closeable="true"
    :round="true"
    :overlay="true"
    class="dota-popup"
    :style="{
      height: 'max-content',
      backgroundImage: 'linear-gradient(180deg, #78c0d3 0%, #ffffff 25%)',
      borderRadius: '32px 32px 0px 0px',
      overflow: 'hidden'
    }"
  >
    <BonusApplication />
  </van-popup>
</template>
<script lang="ts">
import activityPageHook from '@/hooks/activityPage';
import webViewBridgeHook from '@/hooks/webViewBridge';
import BonusApplication from './components/BonusApplication.vue';
import { computed, defineComponent, nextTick, onMounted, Ref, ref } from 'vue';
import { parseTime } from '@/utils/index.js';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: { BonusApplication },
  setup() {
    const { activityInfo, request, token, getActivityInfo, setActivityId } = activityPageHook();

    const getTemplate = computed(() => {
      if (activityInfo.activity_template_content) {
        const _temp = JSON.parse(activityInfo.activity_template_content) || { tabel_column: 2, config_arr: [] };
        _temp.result_arr = [];
        _temp.config_arr &&
          _temp.config_arr.map((item: any) => {
            const obj: any = {};
            Object.keys(item)
              .slice(0, _temp.tabel_column)
              .map((key: any) => {
                obj[key] = item[key];
              });
            _temp.result_arr.push(obj);
          });
        return _temp;
      } else {
        return {
          tabel_column: 2,
          result_arr: [],
          config_arr: []
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

    /**
     * 抢红包tabs默认选中
     */
    const redEnvelopeActive: any = ref(19);

    const route = useRoute();
    /**
     * tabs点击事件
     */
    const redEnvelopeClickTab = (row: any) => {
      setActivityId(row.name);
      getActivityInfo(row.name);
    };

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

    const showPopup = ref(false);

    onMounted(() => {
      nextTick(() => {
        redEnvelopeActive.value = route.query.activeId || 19;
        getSportsRebateInfo();
        getMemberSportsRebateList();
      });
    });
    return {
      getTemplate,
      redEnvelopeClickTab,
      bonusList,
      redEnvelopeActive,
      betInfo,
      toPath,
      showPopup,
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
  background: #060d11;
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
  width: 309px;
  margin: 0 auto;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #b6d8e2;
  line-height: 20px;
  font-weight: 400;
  margin-bottom: 40px;
  text-align: justify;
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
  display: flex;
  justify-content: space-between;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #81b7fe;
  text-align: right;
  font-weight: 500;
  width: 195px;
  height: 29px;
  line-height: 29px;
  margin-top: 28px;
  margin-bottom: 8px;
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
  background-image: linear-gradient(180deg, #245a67 0%, #04303b 100%);
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
  .table-td {
    flex: 1;
    width: 100%;
  }
}
.table-td--left {
  //   width: 207px;
  //   padding-left: 37px;
}
.table-td--right {
  //   width: 106px;
}
// .w33 {
//   width: 33.33%;
//   padding: 0;
// }
.center {
  text-align: center;
}
.table-body {
  padding-top: 6px;
  padding-bottom: 12px;
  background: #101f23;
  border-radius: 0px 0px 16px 16px;
  margin-bottom: 24px;
}
.table-tr {
  line-height: 34px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
  display: flex;
  .table-td {
    width: 100%;
    flex: 1;
  }
}
.ac-content {
  margin: 0 26px;
  overflow: hidden;
}
.ac-time {
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #ffffff;
  line-height: 26px;
  font-weight: 500;
  margin-bottom: 12px;
}
.calc-box {
  background: #101f23;
  border-radius: 8px;
  height: 146px;
  border-radius: 8px;
  padding: 20px 27px;
  p {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #6c96a1;
    line-height: 20px;
    font-weight: 400;
    text-align: justify;
  }
  .bet-btn {
    background: #8b6950;
    border-radius: 16px;
    width: 140px;
    height: 32px;
    line-height: 32px;
    margin: 14px auto 0;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #ffffff;
    font-weight: 500;
    text-align: center;
  }
}
.bonus-list {
  margin: 24px 26px;
  .title-tag {
    margin-bottom: 16px;
  }
}
.v-envelope-main-tabs {
  //   margin: 0 35px;
  :deep(.van-tabs__nav) {
    background: transparent;
    justify-content: space-between;
  }
  :deep(.van-tabs__nav--line) {
    padding-bottom: 8px;
  }
  :deep(.van-tab) {
    font-size: 14px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.6);
    flex: none;
  }
  :deep(.van-tab--active) {
    color: #fff;
  }
  :deep(.van-tabs__line) {
    height: 2px;
    background-color: #2b96b4;
  }
  :deep(.van-tabs__content) {
    margin-top: 10px;
  }
  &-p {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #ffeaea;
    line-height: 20px;
    font-weight: 400;
    margin-bottom: 10px;
  }
  &-history {
    display: flex;
    flex-direction: column;
    font-family: PingFang-SC;
    &-summary {
      display: flex;
      width: 100%;
      height: 24px;
      font-size: 13px;
      background-color: #fff;
      border-radius: 8px;
      height: 52px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #270e0f;
      line-height: 20px;
      font-weight: 400;
      margin-bottom: 24px;
      padding: 0 13px;
      line-height: 52px;
      justify-content: space-between;
      div {
        display: flex;
        // width: 50%;
        // color: #fff;
        span {
          //   color: #ff9f07;
        }
      }
    }
    &-info {
      display: flex;
      flex-direction: column;
      font-family: PingFang-SC;
      background-color: #fff;
      border-radius: 8px;
      .history-th {
        display: flex;
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-radius: 8px 8px 0 0;
        background-color: #c0a07e;
        span {
          display: flex;
          justify-content: center;
          width: 50%;
          font-size: 14px;
          font-weight: bold;
          color: #fff;
        }
      }
      .history-tr {
        display: flex;
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-radius: 8px;
        span {
          display: flex;
          justify-content: center;
          width: 50%;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #270e0f;
          text-align: right;
          font-weight: 400;
        }
      }
    }
  }
}

</style>

<style lang="less">
.dota-popup {
  .van-popup__close-icon {
    border: 1px solid #425a60;
    border-radius: 50%;
    color: #425a60;
    right: 24px;
    top: 24px;
    font-size: 14px;
    padding: 3px;
  }
}
</style>
