<template>
  <div class="tiro-task">
    <GlobalLoading v-show="infoLoading" min-height="400px" align-row="flex-start" top="50%" />
    <div class="tiro-task-box">
      <van-image width="100%" :src="friendInvitationImg">
        <template #error>
          <img :src="pageHeaderDefaultImage" style="width:100%" alt="" />
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
      <div class="lottery-box">
        <div
          class="lottery-swipe-box"
          :style="{ '--left': leftAnimate + 'px', '--width': '120px', '--width-3': '40px' }"
        >
          <div ref="swipe" class="price-swipe">
            <div v-for="price in priceLists" :key="price.id + 'box1'">
              <van-image width="25" height="25" fit="contain" :src="getImageUrl(price.id)" />
            </div>
            <div v-for="price in priceLists" :key="price.id + 'box2'">
              <van-image width="25" height="25" fit="contain" :src="getImageUrl(price.id)" />
            </div>
          </div>
        </div>
        <div class="lottery-start can-start" @click.stop="start">开始抽奖</div>
      </div>
      <div class="lottery-times">抽奖次数：{{ activeStatus?.time || 0 }}次</div>
      <div class="list-button" @click.stop="showPopupPrice">我的奖品</div>
      <div class="receive-type">
        每累计投注¥<span style="color:#ff9f07">{{ contentLists.need_low_bet }}</span
        >可增加一次抽奖机会
        <span class="to-bet" @click.stop="routeGo('Home')">前往投注</span>
      </div>
      <div class="tiro-task-time">
        活动内容
      </div>
      <div class="tiro-task-table">
        <div class="table-header">
          <div>奖品</div>
          <div>奖品图片</div>
          <div>价格</div>
          <div>数量</div>
        </div>
        <div
          v-for="(content, index) in priceLists"
          :key="index"
          class="table-body"
          :class="{ 'has-back': index % 2 === 1 }"
        >
          <div class="price-name">
            <span>{{ content.name }}</span>
          </div>
          <div><van-image width="25" height="25" fit="contain" :src="getImageUrl(content.id)" /></div>
          <div>{{ content.price }}</div>
          <div>
            {{
              Number(content.received_num) > -1
                ? Number(content.received_num) >= content.num
                  ? content.num
                  : Number(content.received_num)
                : '*'
            }}/{{ content.num }}
          </div>
        </div>
      </div>
      <div class="receive-type">
        领取方式：实物奖励领取或折现需联系平台客服提交相关信息，信息提交后平台将在24小时是内审核并派发奖品，实物奖品领取信息提交成功后平台将于15个工作日内安排发货。
      </div>
      <div class="tiro-task-time">
        活动规则
      </div>
      <div class="rule-box-item">
        1.会员每累计有效投注≥{{ contentLists.need_low_bet }}元即可获得一张免费奖券，会员每人每天限领取{{
          contentLists.max_lottery_time
        }}张免费奖券，免费抽奖仅限当日有效。
      </div>
      <div class="rule-box-item">
        2.免费抽奖送完及活动停止，实物奖励折现与红包奖金全部需完成一倍有效流水即可提款。
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
    <van-popup v-model:show="showPrice" :close-on-click-overlay="false" :style="{ 'border-radius': '16px' }">
      <div class="price-box">
        <div class="text1">{{ winId === 'fail' ? '很遗憾' : '恭喜您' }}</div>
        <van-image
          :src="getImageUrl(winPrice.id)"
          fit="contain"
          height="95"
          width="95"
          @click.stop="showPrice = false"
        />
        <div class="text2">{{ winPrice.name }}</div>
        <van-image class="price-box-x" :src="imageX" height="25" width="25" @click="showPrice = false" />
        <div v-if="winId === 'fail'" class="price-btn" @click.stop="showPrice = false">再试一次</div>
        <div v-else-if="+winPrice.type === 1" class="price-btn" @click.stop="routeGo('CustomerService')">
          联系客服领奖
        </div>
        <div v-else class="price-btn" @click.stop="showPrice = false">
          您的奖品已派发
        </div>
      </div>
    </van-popup>
    <van-action-sheet v-model:show="showPopup" title="我的奖品" :style="{ height: '80%', color: '#fff' }">
      <van-pull-refresh v-model="loading.refresh" @refresh="onRefresh({ activity_id: 8 })">
        <van-list v-model:loading="loading.onload" :finished="loading.finished" @load="onLoad({ activity_id: 8 })">
          <template #finished>
            <span v-if="priceList.length > 0" style="margin-bottom:20px">
              没有更多了~
            </span>
            <NoData v-else />
          </template>
          <MyPriceListItem v-for="(price, index) in priceList" :key="index" :price="price" />
        </van-list>
      </van-pull-refresh>
    </van-action-sheet>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, reactive, ref, Ref } from 'vue';
import defaultImages from '@/hooks/defaultImages';
import GlobalLoading from '@/components/Loading/index.vue';
import { Toast } from 'vant';
import activityPageHook from '@/hooks/activityPage';
import { parseTime } from '@/utils/index.js';
import webViewBridgeHook from '@/hooks/webViewBridge';
import MyPriceListItem from '@/components/MyPriceListItem/index.vue';
import NoData from '@/components/noData/index.vue';
import priceListHook from './Hooks/priceListHook';
import ImageLoadBox from '@/components/ImageLoadBox/index.vue';

export default defineComponent({
  name: 'OpeningLottery',
  components: { GlobalLoading, MyPriceListItem, NoData, ImageLoadBox },
  setup() {
    const { pageHeaderDefaultImage } = defaultImages();

    const imageX = require(`@/assets/home/promotion-dialog-x.png`);

    function getImageUrl(id: any) {
      if (!id) return '';
      return require(`@/assets/activity/price/price${id}.png`);
    }

    const { routeGo } = webViewBridgeHook();

    const { infoLoading, activityInfo, request, token } = activityPageHook();

    const friendInvitationImg = require('@/assets/activity/opening-lottery-header.png');

    const activeStatus: any = reactive({
      time: 0,
      prize_array: []
    });

    const contentLists = computed(() => {
      if (activityInfo.activity_template_content) {
        return JSON.parse(activityInfo.activity_template_content) || [];
      } else {
        return {};
      }
    });

    const priceLists = computed(() => {
      let result: any[] = [];
      if (activityInfo.activity_template_content) {
        result = JSON.parse(activityInfo.activity_template_content).config_arr || [];
      }
      result.forEach(price => {
        const ps = (activeStatus?.prize_array || []).filter((p: any) => {
          return Number(p.prize_id) === Number(price.id);
        });
        if (ps.length > 0) {
          price.received_num = ps[0].received_num;
        } else {
          price.received_num = '*';
        }
      });
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      animateOptions.singleLeft = result.length * animateOptions.boxWidth;
      return result;
    });

    const receiveLoading = ref(false);

    function toGetPrice() {
      if (!token.value || (activeStatus?.time || 0) < 1) return;
      if (receiveLoading.value) return;
      receiveLoading.value = true;
      winId.value = 'fail';
      request
        .value({
          url: '/index/Activity/memberLottery',
          method: 'get',
          params: {
            activity_id: 8
          }
        })
        .then((res: any) => {
          // eslint-disable-next-line eqeqeq
          if (res.code == 1) {
            winId.value = res.data?.id || 'fail';
            getStatus();
            // Toast.success(`奖金领取成功！`);
          } else {
            winId.value = 'fail';
            Toast(res.msg || res.message);
          }
        })
        .catch(() => {
          winId.value = 'fail';
        })
        .finally(() => {
          receiveLoading.value = false;
        });
    }

    const animateOptions = {
      boxWidth: 40,
      minTime: 5,
      currentTime: 5,
      singleLeft: 0,
      speed: 10
    };

    const leftAnimate = ref(0);

    let timer: any = null;

    const winId: Ref<any> = ref('fail');

    const winIndex = computed(() => {
      if (winId.value === 'fail') return winId.value;
      return priceLists.value.findIndex((item: any) => {
        return Number(item.id) === Number(winId.value);
      });
    });

    const winPrice = computed(() => {
      const temp = priceLists.value.filter((item: any) => {
        return Number(item.id) === Number(winId.value);
      });
      if (temp.length > 0) {
        return temp[0];
      } else {
        return {
          name: '大奖与你擦肩而过~',
          id: 'fail'
        };
      }
    });

    function start() {
      if (!token.value || (activeStatus?.time || 0) < 1) return;
      if (receiveLoading.value) return;
      if (!timer && priceLists.value.length > 0) {
        console.log('start');
        toGetPrice();
        timer = setInterval(() => {
          animateOptions.currentTime -= 0.01;
          animateOptions.speed -= 0.02;
          if (animateOptions.speed < 1) {
            animateOptions.speed = 1;
          }
          leftAnimate.value -= animateOptions.speed;
          if (leftAnimate.value < animateOptions.singleLeft * -1) {
            leftAnimate.value += animateOptions.singleLeft;
          }
          if (animateOptions.currentTime < 0) {
            end();
          }
        }, 10);
      }
    }
    function end() {
      if (winIndex.value === 'fail' && !receiveLoading.value) {
        clearInterval(timer);
        timer = null;
        animateOptions.currentTime = animateOptions.minTime;
        animateOptions.speed = 10.4;
        showPrice.value = true;
        return;
      }
      const left =
        leftAnimate.value +
        (winIndex.value === 0
          ? animateOptions.singleLeft - animateOptions.boxWidth
          : animateOptions.boxWidth * (winIndex.value - 1));
      if (left > -animateOptions.speed * 2 && left < animateOptions.speed * 2) {
        leftAnimate.value =
          winIndex.value === 0
            ? animateOptions.singleLeft * -1 + animateOptions.boxWidth
            : animateOptions.boxWidth * (1 - winIndex.value);
        clearInterval(timer);
        timer = null;
        animateOptions.currentTime = animateOptions.minTime;
        animateOptions.speed = 10.4;
        showPrice.value = true;
      }
    }

    // eslint-disable-next-line no-unused-vars
    function getStatus() {
      if (!token.value) return;
      request
        .value({
          url: '/index/Activity/realThingLotteryStatus',
          method: 'get',
          params: {
            activity_id: 8
          }
        })
        .then((res: any) => {
          if (+res.code === 1) {
            Object.assign(activeStatus, res.data);
          } else {
            activeStatus.time = 0;
          }
        })
        .catch(() => {
          activeStatus.time = 0;
        });
    }

    const showPopup = ref(false);

    function showPopupPrice() {
      if (!token.value || receiveLoading.value || timer) return;
      showPopup.value = true;
      onRefresh({ activity_id: 8 });
    }

    const showPrice = ref(false);

    const { loading, priceList, onRefresh, onLoad } = priceListHook();

    onMounted(() => {
      nextTick(() => {
        getStatus();
      });
    });

    return {
      pageHeaderDefaultImage,
      contentLists,
      friendInvitationImg,
      toGetPrice,
      infoLoading,
      receiveLoading,
      activityInfo,
      token,
      parseTime,
      priceLists,
      start,
      end,
      leftAnimate,
      routeGo,
      showPopup,
      showPopupPrice,
      activeStatus,
      getImageUrl,
      showPrice,
      imageX,
      winId,
      winPrice,
      loading,
      priceList,
      onRefresh,
      onLoad
    };
  }
});
</script>

<style lang="less" scoped>
:deep(.van-popup) {
  //border-radius: 16px;
  overflow: visible;
}
.price-box {
  position: relative;
  width: 240px;
  height: 250px;
  border-radius: 16px;
  background-color: #2d363d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .text1 {
    font-size: 14px;
    color: #fff;
    margin: 15px 0;
  }

  .text2 {
    font-size: 13px;
    color: #adbfcf;
    margin: 15px 0;
  }

  .price-btn {
    border-radius: 8px;
    background-image: linear-gradient(to right, #12dedf, #07c79c);
    padding: 10px 20px;
    color: #1b1818;
    font-weight: bold;
    font-size: 13px;
  }

  .price-box-x {
    position: absolute;
    bottom: -35px;
    left: calc(50% - 12.5px);
  }
}
.price-swipe {
  position: absolute;
  height: 100%;
  display: flex;
  overflow: hidden;
  left: var(--left);
  & > div {
    width: var(--width-3);
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.list-button {
  height: 38px;
  width: calc(100% - 4px) !important;
  border-radius: 20px;
  border: 1px solid #11dcd9;
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    margin-left: 10px;
  }
}
.lottery-times {
  color: #fff;
  font-size: 12px;
  text-align: center;
}
.lottery-box {
  height: 165px;
  width: 195px !important;
  margin: 20px auto;
  background-image: url('../../../assets/activity/lottery-box-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  .lottery-start {
    position: absolute;
    bottom: 15px;
    width: 84px;
    left: calc(50% - 42px);
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 13px;
    font-weight: bold;
    font-size: 13px;
    color: #fff;
    cursor: not-allowed;
    background-color: #808080;
  }
  .can-start {
    color: #654200;
    box-shadow: 0 2px 0 0 #c08004, inset 0 7px 7px 0 #fff6bd;
    border: solid 1px #cea303;
    background-image: linear-gradient(to right, #ffc95d, #ffcf6c);
    cursor: pointer;
  }
  .lottery-swipe-box {
    width: var(--width);
    height: 35px;
    position: absolute;
    top: 57px;
    left: calc(50% - var(--width) / 2);
    overflow: hidden;
    //background-color: #0cd1ba;
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
  font-family: PingFang-SC, serif;
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
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        &:nth-child(1) {
          width: 30%;
        }
        &:nth-child(2) {
          width: 30%;
        }
        &:nth-child(3) {
          width: 20%;
        }
        &:nth-child(4) {
          width: 20%;
        }
      }
    }

    .table-header {
      background-color: #3e4a53;
      border-radius: 8px;
      font-weight: bold;

      > div {
        color: #fff;
        font-size: 14px;
      }
    }

    .table-body {
      border-radius: 8px;

      .price-name {
        white-space: pre-wrap;
        line-height: normal;
        font-size: 12px;
        > span {
          margin-left: 10px;
        }
      }

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
      font-family: PingFang-SC, serif;
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
  .receive-type {
    font-size: 13px;
    color: #fff;
    margin: 15px 0 0;
    display: flex;
    align-items: center;
    .to-bet {
      display: inline-block;
      padding: 0 15px;
      height: 26px;
      line-height: 26px;
      margin-left: 20px;
      border-radius: 13px;
      color: #1a242c;
      font-size: 12px;
      font-weight: bold;
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      cursor: pointer;
      &:hover {
        background-image: linear-gradient(to right, #08e2e3, #0ce7b6);
      }
      &:active {
        background-image: linear-gradient(to right, #0d9697, #10a181);
      }
    }
  }
}
</style>
