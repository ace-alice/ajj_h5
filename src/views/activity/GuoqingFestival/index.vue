<template>
  <div class="tiro-task">
    <GlobalLoading v-show="infoLoading" min-height="400px" align-row="flex-start" top="50%" />
    <div class="tiro-task-box">
      <van-image :src="friendInvitationImg" class="">
        <template #error>
          <img :src="pageHeaderDefaultImage" alt="" />
        </template>
        <template #loading>
          <ImageLoadBox />
        </template>
      </van-image>
      <!-- <div class="tiro-task-time" style="margin: 14px 0 0;">
        活动时间：
        <span v-if="+activityInfo['is_time_limit'] === 1">
          {{ parseTime(activityInfo.start_time, '{y}/{m}/{d}') }} -
          {{ parseTime(activityInfo.end_time, '{y}/{m}/{d}') }}
        </span>
        <span v-else>长期活动</span>
      </div> -->
      <div class="notice-content">
        <div class="notice-icon">
          <img :src="require('@/assets/activity/voice-icon.png')" alt="" />
        </div>
        <van-notice-bar color="#484848" background="#fff" @click.stop="showPopupPrice('priceInfo')">
          <span v-for="(item, index) in priceInfo" :key="index" class="notice-item">
            <span class="text-no">恭喜用户</span>
            <span class="text-w">{{ item['member_name'] }}</span>
            <span class="text-no">抽中</span>
            <span class="text-p">{{ item['prize_name'] }}</span>
          </span>
        </van-notice-bar>
      </div>
      <div class="lottery-box">
        <div
          class="lottery-swipe-box"
          :style="{ '--left': leftAnimate + 'px', '--width': '258px', '--width-3': '86px' }"
        >
          <div ref="swipe" class="price-swipe">
            <div v-for="price in priceLists" ck="priceLists" :key="price['id'] + 'box1'">
              <van-image width="86" height="86" class="van-image-reward" fit="contain" :src="price['img_url']" />
            </div>
            <div v-for="price in priceLists" :key="price['id'] + 'box2'">
              <van-image width="86" height="86" class="van-image-reward" fit="contain" :src="price['img_url']" />
            </div>
          </div>
        </div>
        <div class="lottery-times">抽奖次数：{{ activeStatus?.time || 0 }}次</div>
        <div class="lottery-start can-start" @click.stop="start">开始抽奖</div>
        <div class="lottery-start can-award" @click.stop="showPopupPrice('priceList')">我的奖品</div>
      </div>
      <div class="receive-type">
        <div>
          每累计投注<span style="color:#fff">¥{{ contentLists['need_low_bet'] }}</span
          >可增加一次抽奖机会
        </div>

        <span class="to-bet" @click.stop="routeGo('Home')">立即前往</span>
      </div>
      <div class="receive-type" style="color:#fff">
        领取方式：实物奖励领取或折现需联系平台客服提交相关信息，信息提交后平台将在24小时是内审核并派发奖品，实物奖品领取信息提交成功后平台将于15个工作日内安排发货。
      </div>
      <div class="v-envelope-main-tabs">
        <van-tabs v-model:active="redEnvelopeActive" @click-tab="redEnvelopeClickTab">
          <van-tab title="活动规则">
            <div class="v-envelope-main-tabs-p">
              1.会员每累计有效投注≥500元即可获得一张免费奖券，会员每人每天限领取5张免费奖券。
            </div>
            <div class="v-envelope-main-tabs-p">
              2.免费奖券送完及活动停止，实物奖励折现与红包奖金全部需完成一倍有效流水即可提款。
            </div>
            <div class="v-envelope-main-tabs-p">
              3.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133，串关、
              走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）
            </div>
            <div class="v-envelope-main-tabs-p">
              4.每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备仅限一个账户享受此活动，对违规的会员，平台保
              留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
            </div>
            <div class="v-envelope-main-tabs-p">
              5.凡参加活动用户，即表示接受且自愿遵守平台规定，平台保留最终解释权。
            </div>
          </van-tab>
          <van-tab title="活动奖品">
            <div class="tiro-task-table">
              <div class="table-header">
                <div>奖品</div>
                <div>奖品图片</div>
                <div>价格</div>
                <div>数量</div>
              </div>
              <div class="priceLists">
                <div v-for="(content, index) in priceLists" :key="index" class="table-body">
                  <div class="price-name">
                    <span>{{ content.name }}</span>
                  </div>
                  <div>
                    <van-image width="32" height="32" fit="contain" :src="content['img_url']" />
                  </div>
                  <div>{{ content['price'] }}</div>
                  <div>{{ content['received_num'] }}/{{ content['front_show_num'] }}</div>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <van-popup
      v-model:show="showPrice"
      :close-on-click-overlay="false"
      :style="{ 'border-radius': '16px', overflow: 'visible' }"
    >
      <div class="price-box">
        <div class="text1">{{ winId === 'fail' ? '很遗憾' : '恭喜您' }}</div>
        <van-image :src="winPrice['img_url']" fit="contain" height="95" width="95" @click.stop="showPrice = false" />
        <div class="text2">{{ winPrice.name }}</div>
        <van-image class="price-box-x" :src="imageX" height="25" width="25" @click="showPrice = false" />
        <div v-if="winId === 'fail'" class="price-btn" @click.stop="showPrice = false">再试一次</div>
        <div v-else-if="+winPrice['type'] === 1" class="price-btn" @click.stop="routeGo('CustomerService')">
          联系客服领奖
        </div>
        <div v-else class="price-btn" @click.stop="showPrice = false">
          您的奖品已派发
        </div>
      </div>
    </van-popup>
    <van-popup
      v-model:show="showPopup"
      position="bottom"
      round
      closeable
      :style="{ height: '80%', width: '100%', color: '#fff' }"
    >
      <!--suppress HtmlUnknownAnchorTarget -->
      <van-tabs
        v-model:active="tabActive"
        animated
        class="popup-tab"
        color="#0fd7cc"
        swipeable
        line-width="75px"
        background="#fff"
        title-active-color="#000"
        title-inactive-color="rgba(0,0,0,0.3)"
      >
        <van-tab title="中奖排行版" name="priceInfo">
          <van-pull-refresh v-model="loadingInfo.refresh" @refresh="onInfoRefresh({ activity_id: 16 })">
            <van-list
              class="range-list"
              v-model:loading="loadingInfo.onload"
              :finished="loadingInfo.finished"
              @load="onInfoLoad({ activity_id: 16 })"
            >
              <template #finished>
                <span v-if="priceInfo.length > 0" style="margin-bottom:20px">
                  没有更多了~
                </span>
                <NoData v-else />
              </template>
              <LotteryWinInfoItem v-for="(price, index) in priceInfo" :key="index" :index="index" :price="price" />
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="我的奖品" name="priceList" :disabled="isDisabled">
          <van-pull-refresh v-model="loading.refresh" @refresh="onRefresh({ activity_id: 16 })">
            <van-list v-model:loading="loading.onload" :finished="loading.finished" @load="onLoad({ activity_id: 16 })">
              <template #finished>
                <span v-if="priceList.length > 0" style="margin-bottom:20px">
                  没有更多了~
                </span>
                <NoData v-else />
              </template>
              <MyPriceListItem v-for="(price, index) in priceList" :key="index" :price="price" />
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, nextTick, onMounted, reactive, ref, Ref } from 'vue';
import defaultImages from '@/hooks/defaultImages';
import GlobalLoading from '@/components/Loading/index.vue';
import { Toast } from 'vant';
import activityPageHook from '@/hooks/activityPage';
import { parseTime } from '@/utils/index.js';
import webViewBridgeHook from '@/hooks/webViewBridge';
import MyPriceListItem from './components/MyPriceListItem/index.vue';
import priceInfoHook from './Hooks/priceInfoHook';
import NoData from '@/components/noData/index.vue';
import priceListHook from './Hooks/priceListHook';
import ImageLoadBox from '@/components/ImageLoadBox/index.vue';
import LotteryWinInfoItem from './components/LotteryWinInfoItem/index.vue';

export default defineComponent({
  name: 'MidAutumnFestival',
  components: { GlobalLoading, MyPriceListItem, NoData, ImageLoadBox, LotteryWinInfoItem },
  setup() {
    const { pageHeaderDefaultImage } = defaultImages();

    const imageX = require(`@/assets/home/promotion-dialog-x.png`);

    function getImageUrl(id: any) {
      if (!id) return '';
      return require(`@/assets/activity/price/price${id}.png`);
    }

    const { routeGo } = webViewBridgeHook();

    const { infoLoading, activityInfo, request, token } = activityPageHook();

    const friendInvitationImg = require('@/assets/activity/guoqi-banner.png');

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
            activity_id: 16
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
      boxWidth: 86,
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
            console.log('end');
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
        onInfoRefresh({ activity_id: 16 });
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
        onInfoRefresh({ activity_id: 16 });
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
            activity_id: 16
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

    function showPopupPrice(name: string) {
      if ((!token.value || receiveLoading.value || timer) && name === 'priceList') return;
      tabActive.value = name;
      showPopup.value = true;
      switch (name) {
        case 'priceInfo':
          onInfoRefresh({ activity_id: 16 });
          return;
        case 'priceList':
          onRefresh({ activity_id: 16 });
          return;
      }
    }

    const showPrice = ref(false);

    const tabActive = ref('priceInfo');

    const isDisabled = computed(() => {
      return !token.value;
    });

    const { loading, priceList, onRefresh, onLoad } = priceListHook();

    const { loadingInfo, onInfoRefresh, onInfoLoad, priceInfo } = priceInfoHook();

    onMounted(() => {
      nextTick(() => {
        getStatus();
        onInfoRefresh({ activity_id: 16 });
        onRefresh({ activity_id: 16 });
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
      onLoad,
      tabActive,
      loadingInfo,
      onInfoRefresh,
      onInfoLoad,
      priceInfo,
      isDisabled
    };
  }
});
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
//noinspection CssInvalidPseudoSelector
:deep(.van-popup) {
  //border-radius: 16px;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 32px 32px 0px 0px;
  .van-popup__close-icon {
    z-index: 10010 !important;
  }
}

.notice-item {
  font-size: 13px;
  color: #484848;

  .text-no {
    color: #484848;
  }

  .text-w {
    color: #484848;
    font-weight: 600;
  }

  & + .notice-item {
    margin-left: 50px;
  }
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
  //width: calc(100% - 4px) !important;
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
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #ffffff;
  font-weight: 400;
  position: absolute;
  right: 20px;
  bottom: 58px;
}

.lottery-box {
  height: 237px;
  width: 282px !important;
  margin: 20px auto 27px;
  background-image: url('../../../assets/activity/guoqing-box.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;

  .lottery-start {
    position: absolute;
    bottom: 5px;
    width: 130px;
    height: 35px;
    line-height: 35px;
    text-align: left;
    text-indent: 18px;
    border-radius: 20px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #433403;
    font-weight: 500;
    color: #433403;
    cursor: not-allowed;
    background-image: url('../../../assets/activity/guoqing-btton.png');
    background-size: 100% 100%;
  }

  .can-start {
    color: #433403;
    // box-shadow: 0 2px 0 0 #c08004, inset 0 7px 7px 0 #fff6bd;
    // border: solid 1px #cea303;
    // background-image: linear-gradient(to right, #ffc95d, #ffcf6c);
    cursor: pointer;
    left: 10px;
  }
  .can-award {
    right: 10px;
  }

  .lottery-swipe-box {
    // width: calc(100% - 24px);
    width: var(--width);
    height: 88px;
    position: absolute;
    top: 80px;
    left: calc(50% - var(--width) / 2);
    overflow: hidden;
    //background-color: #0cd1ba;
  }
  //   .van-image-reward {
  //     width: 80px;
  //     height: 80px;
  //     img {
  //       width: 80px;
  //       height: 80px;
  //     }
  //   }
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
  background-image: linear-gradient(180deg, #090506 0%, #3f1616 100%);
  //noinspection CssInvalidPseudoSelector
  :deep(.van-tabs) {
    height: 100%;
    overflow-y: auto;
    position: unset;
    // .van-tabs__wrap {
    //   position: absolute;
    //   margin-left: 15px;
    //   top: 0;
    //   z-index: 10000;
    //   background-color: #2d363d;
    // }

    .van-tabs__content {
      //   padding: 56px 0 0;
    }
  }

  .tiro-task-box {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-bottom: 20px;

    //noinspection CssInvalidPseudoSelector
    & > :deep(.van-image) {
      width: 100%;
      overflow: hidden;
    }

    > div {
      flex-shrink: 0;
      width: calc(100% - 64px);
    }

    //noinspection CssInvalidPseudoSelector
    :deep(.van-notice-bar) {
      flex: 1;
      height: 34px;
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
    border-radius: 8px;
    background-image: linear-gradient(180deg, #ffe3ba 0%, #ffffff 100%);
    > div {
      display: flex;
      justify-content: space-between;

      > div > div {
        width: 25%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: #433403;
        &:nth-child(1) {
          width: 30%;
          color: #433403;
        }

        &:nth-child(2) {
          width: 30%;
          color: #433403;
        }

        &:nth-child(3) {
          width: 20%;
          color: #433403;
        }

        &:nth-child(4) {
          width: 20%;
          color: #433403;
        }
      }
    }

    .table-header {
      background-color: #ffe4bc;
      border-radius: 8px;
      font-weight: bold;
      width: calc(100% - 28px);
      margin: 0 14px;

      > div {
        color: #433403;
        font-size: 16px;
        line-height: 58px;
        &:nth-child(1) {
          width: 30%;
          text-align: center;
        }

        &:nth-child(2) {
          width: 30%;
          text-align: center;
        }

        &:nth-child(3) {
          width: 20%;
          text-align: center;
        }

        &:nth-child(4) {
          width: 20%;
          text-align: center;
        }
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
    margin: 0 0 25px;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #f9d59b;
    line-height: 20px;
    font-weight: 400;
    .to-bet {
      display: inline-block;
      padding: 0 16px;
      height: 24px;
      line-height: 24px;
      margin-left: 20px;
      color: #1a242c;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #433403;
      text-align: right;
      font-weight: 500;
      background-image: linear-gradient(90deg, #ffab54 13%, #ffef00 92%);
      border-radius: 12px;
      cursor: pointer;

      // &:hover {
      //   background-image: linear-gradient(to right, #08e2e3, #0ce7b6);
      // }

      // &:active {
      //   background-image: linear-gradient(to right, #0d9697, #10a181);
      // }
    }
  }
}
.notice-content {
  display: flex;
  height: 34px;
  align-items: center;
  width: calc(100% - 34px);
  margin: 15px 34px auto;
  border-radius: 30px;
  background-color: #fff;
  border-radius: 80px;
  overflow: hidden;
  align-items: center;
  .notice-icon {
    width: 34px;
    height: 34px;
    img {
      width: 100%;
    }
  }
}
.v-envelope-main-tabs {
  margin: 0 auto;
  width: calc(100% - 54px) !important;
  :deep(.van-tabs__nav) {
    background: transparent;
  }
  :deep(.van-tabs__nav--line) {
    padding-bottom: 8px;
  }
  :deep(.van-tab) {
    flex: none;
    margin-right: 28px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
  }
  :deep(.van-tab--active) {
    color: #fff;
  }
  :deep(.van-tabs__line) {
    height: 2px;
    background-color: #ffee01;
  }
  :deep(.van-tabs__content) {
    // margin-top: 10px;
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
.priceLists {
  width: calc(100% - 28px);
  margin: 0 14px;
  display: block !important;
  background-color: #fff;
  border-radius: 16px;
  > div {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
}
.popup-tab {
  background-image: linear-gradient(180deg, #ffcad6 0%, #ffffff 25%);
  border-radius: 32px 32px 0px 0px;
  :deep(.van-tabs__wrap) {
    height: 68px;
    border-radius: 32px 32px 0px 0px;
  }
  :deep(.van-tabs__nav) {
    background: transparent !important;
  }
  :deep {
    .van-tabs__content {
      height: calc(100% - 68px);
      overflow: auto;
      background-color: #fff;
      padding: 0 35px;
      margin: 0 auto;
      border-radius: 32px 32px 0px 0px;
      // .van-swipe__track {
      //     overflow: auto;
      // }
      .van-swipe-item,
      .van-swipe,
      .van-swipe__track {
        height: max-content;
      }
    }
  }
}
</style>
