<template>
  <div class="v-envelope">
    <div class="v-envelope-main">
      <div class="v-envelope-main-header">
        <van-image :src="redEnvelopeImage" />
      </div>
      <div>
        <img class="tiro-task-title" :src="require('@/assets/activity/gq-title.png')" alt="" />
        <div class="ac-info">
          <div class="ac-info--title">欢度国庆</div>
          <div class="tiro-task-time" style="margin: 8px 0 0;">
            活动时间：
            <span v-if="+activityInfo['is_time_limit'] === 1">
              {{ parseTime(activityInfo.start_time, '{y}/{m}/{d}') }} -
              {{ parseTime(activityInfo.end_time, '{y}/{m}/{d}') }}
            </span>
            <span v-else>长期活动</span>
          </div>
          <p>
            小艾竞技将于每天12:00、16:00、20:00开启三次 抢红包活动，每轮红包奖金8888元，红包奖金最
            高达1888元，特此回馈新会员加入。
          </p>
        </div>
      </div>
      <div class="v-envelope-main-time">
        <div class="v-envelope-main-time-info">
          <div class="v-envelope-main-time-info-name">
            <span>准点开抢</span>
          </div>
          <div class="v-envelope-main-time-info-countdown">
            <swiper
              :modules="modules"
              :pagination="{ type: 'fraction' }"
              :slides-per-view="3"
              :space-between="0"
              :navigation="true"
            >
              <swiper-slide
                v-for="(item, index) in redEnvelopeTime"
                :key="index"
                :class="{ 'ac-swiper': item.status == 3 }"
              >
                <div class="ac-line-left"></div>
                <div class="v-envelope-main-time-info-countdown-col">
                  <span v-if="item.left_time > 0" class="ac-time">
                    <van-count-down :time="item.left_time * 1000" @finish="distanceStartsFinish" />
                  </span>
                  <span v-else class="ac-time">{{ item.date }}</span>
                  <span :class="{ 'ac-active': item.status == 3 }">{{ redEnvelopeTimeStatus(item.status) }}</span>
                </div>
                <div class="ac-line" :class="{ 'ac-line-active': item.status == 3 }">
                  <img :src="require('@/assets/activity/redball.png')" alt="" />
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div>
      <div class="v-envelope-main-bet">
        <div class="v-envelope-main-bet-tip">
          每日累计投注
          <span>¥500可参与抢红包</span>
        </div>
        <span v-if="+redEnvelopeObj.is_claim === 0" class="v-envelope-main-bet-button" @click="routeGo('Home')">
          前往投注
        </span>
        <span v-else class="v-envelope-main-bet-button" @click="redEnvelopeReserve = true">
          预约成功
        </span>
      </div>
      <div class="v-envelope-main-tabs">
        <van-tabs v-model:active="redEnvelopeActive" @click-tab="redEnvelopeClickTab">
          <van-tab title="活动规则">
            <div class="v-envelope-main-tabs-p">
              1.会员每日累计投注金额≥500元即可参加，限时红包活动仅限手机APP内参与。
            </div>
            <div class="v-envelope-main-tabs-p">
              2.获得红包将派发至主钱包中，红包奖金需完成一倍有效流水即可提款。
            </div>
            <div class="v-envelope-main-tabs-p">
              3.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133，串
              关、走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）
            </div>
            <div class="v-envelope-main-tabs-p">
              4.4.每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能享受一次活动，对违规的会员，平台保留无
              限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
            </div>
            <div class="v-envelope-main-tabs-p">
              5.凡参加活动用户，即表示接受且自愿遵守平台规定，平台保留最终解释权。
            </div>
          </van-tab>
          <van-tab title="我的奖励">
            <div class="v-envelope-main-tabs-history">
              <div class="v-envelope-main-tabs-history-summary">
                <div>
                  已累计抢到红包数量：
                  <span>{{ redEnvelopeTotalNum }}</span>
                </div>
                <div>
                  红包金额：
                  <span>{{ redEnvelopeTotalAmount }}</span>
                </div>
              </div>
              <div class="v-envelope-main-tabs-history-info">
                <div class="history-th">
                  <span>中奖时间</span>
                  <span>中奖金额</span>
                </div>
                <div v-for="(item, index) in redEnvelopeList" :key="index" class="history-tr">
                  <span>{{ item.get_time }}</span>
                  <span>{{ priceToFixed(item.reward_amount) }}</span>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <div id="packet" class="v-envelope-packet" />
    <div class="v-envelope-dialog">
      <van-dialog v-model:show="redEnvelopeShow" :show-confirm-button="false" class="v-envelope-dialog-bg">
        <div v-if="redEnvelopePity" class="v-envelope-dialog-price">
          <div>恭喜发财 大吉大利</div>
          <div>
            <span>{{ redEnvelopePrice }}</span>
            元
          </div>
          <div>
            已存入中心钱包
          </div>
        </div>
        <div v-else class="v-envelope-dialog-price">
          <div>好可惜，就差一点点</div>
          <div>再来一次</div>
        </div>
        <div class="v-envelope-dialog-x">
          <img :src="redEnvelopeX" @click.stop="redEnvelopeShow = false" />
        </div>
      </van-dialog>
    </div>
    <div class="v-envelope-chai">
      <van-dialog v-model:show="redEnvelopeChaiShow" :show-confirm-button="false" class="v-envelope-chai-bg">
        <div class="v-envelope-chai-main" @click.stop="memberRedPacketApply" />
        <!--        <div class="v-envelope-chai-x">-->
        <!--          <img :src="redEnvelopeX" @click="redEnvelopeChaiShow = false">-->
        <!--        </div>-->
      </van-dialog>
    </div>
    <div class="v-envelope-reserve">
      <van-dialog
        v-model:show="redEnvelopeReserve"
        :close-on-click-overlay="true"
        :show-cancel-button="false"
        :show-confirm-button="false"
      >
        <div class="v-envelope-reserve-content">
          <div>红包雨</div>
          <div v-show="!redEnvelopeShow">
            距离下一场红包雨还有
            <span>
              <van-count-down :time="redEnvelopeObj.next_time * 1000" format="HH时mm分ss秒" />
            </span>
          </div>
          <div>
            {{ parseTime(activityInfo.start_time, '{m}月{d}日') }}-{{ parseTime(activityInfo.end_time, '{m}月{d}日') }}
            红包雨来袭
          </div>
          <div>
            <span v-for="item in 5" :key="item" />
          </div>
          <div>
            <span v-for="(item, index) in redEnvelopeTime" :key="index">{{ item.date }}</span>
          </div>
        </div>
        <div class="v-envelope-reserve-button">
          <span @click="redEnvelopeReserve = false">我知道了</span>
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue';
import activityPageHook from '@/hooks/activityPage';
import webViewBridgeHook from '@/hooks/webViewBridge';
import { parseTime, priceToFixed } from '@/utils/index.js';
import { Toast } from 'vant';
import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue';
import { A11y, Autoplay, Navigation } from 'swiper';
import 'swiper/swiper.min.css';
import 'swiper/swiper-bundle.min.css';

export default defineComponent({
  name: 'GrabRedEnvelope',
  components: {
    Swiper,
    SwiperSlide
  },
  setup() {
    /**
     * 抢红包活动图
     */
    const redEnvelopeImage = require('@/assets/activity/gqRedRain-banner.png');
    /**
     * 红包背景图
     */
    const redEnvelopeBg = require('@/assets/activity/red-envelope.png');
    /**
     * 所有抢到红包的总金额
     */
    const totalMoney = ref(0);
    /**
     * 延时
     */
    const delayTime = ref(0);
    /**
     * 最后一张掉落的红包
     */
    const lastImage: any = ref(null);
    /**
     * 红包随机序列
     */
    const imageList: any = ref(null);
    /**
     * 游戏结果
     */
    const imageResult = ref('');
    /**
     * 抢红包tabs默认选中
     */
    const redEnvelopeActive = ref(0);
    /**
     * 倒计时时间
     */
    const distanceStartsTime: any = ref(null);
    /**
     * 领取红包关闭按钮
     */
    const redEnvelopeX = require('@/assets/home/promotion-dialog-x.png');
    /**
     * 领取红包弹窗
     */
    const redEnvelopeShow = ref(false);
    /**
     * 拆红包弹窗
     */
    const redEnvelopeChaiShow = ref(false);
    /**
     * 总红包数量
     */
    const redEnvelopeTotalNum = ref(0);
    /**
     * 总红包金额
     */
    const redEnvelopeTotalAmount = ref(0);
    /**
     * 红包列表
     */
    const redEnvelopeList = ref([]);
    /**
     * 抢红包状态
     */
    const redEnvelopeStatus = ref(false);
    const redEnvelopeObj: any = ref({});
    const activityInfo: any = ref({});
    const redEnvelopeTime: any = ref({});
    const redPacketList = ref(0);
    const redEnvelopePity = ref(false);
    const redEnvelopePrice = ref(0);
    const autoplayOptions = {
      disableOnInteraction: false,
      loop: false,
      pauseOnMouseEnter: true,
      reverseDirection: true
    };
    const isApply = ref(true);
    const modules = [A11y, Autoplay, Navigation];
    /**
     * 红包雨预约弹窗
     */
    const redEnvelopeReserve = ref(false);
    const { request, token } = activityPageHook(false);
    const { routeGo } = webViewBridgeHook();
    /**
     * 开始游戏
     */
    const startGame = () => {
      let s = 0;
      distanceStartsTime.value = setInterval(() => {
        s++;
        const dom: any = createDom(2);
        imageList.value = document.getElementsByTagName('img');
        const wrapper: any = document.getElementById('packet');
        wrapper.appendChild(dom);
        for (let i = 0; i < imageList.value.length; i++) {
          imageList.value[i].onclick = function() {
            // mouseHandler(i)
            // memberRedPacketApply()
            redEnvelopeChaiShow.value = true;
          };
        }
        if (s > 19) {
          imageList.value = [];
          wrapper.innerHTML = '';
          console.log('结束');
          clearInterval(distanceStartsTime.value);
        }
      }, 1000);
    };
    /**
     * 创建红包序列
     */
    const createDom = (num: number) => {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < num; i++) {
        const img: any = new Image();
        img.src = redEnvelopeBg;
        img.style.width = '58px';
        img.style.height = '68px';
        img.style.left = ranNum(58, window.innerWidth) - 58 + 'px';
        const delay = ranNum(0, 100) / 10;
        img.style.animationDelay = delay + 's';
        if (delayTime.value < delay) {
          delayTime.value = delay;
          lastImage.value = img;
        }
        img.dataset.money = redPacketList.value[num];
        frag.appendChild(img);
      }
      return frag;
    };
    /**
     * 随机数
     */
    const ranNum = (min: number, max: number) => {
      return Math.ceil(Math.random() * (max - min) + min);
    };
    /**
     * 点击红包
     */
    const mouseHandler = (index: number) => {
      redEnvelopeChaiShow.value = true;
      return;
      // redEnvelopeShow.value = true
      // const wrapper: any = document.getElementById('packet')
      // wrapper.innerHTML = ''
      // const event: any = window.event
      // const money = event.target.dataset.money
      // if (money) {
      //   imageResult.value = '恭喜抢到红包' + money + '元'
      //   for (let i = 0; i < imageList.value.length; i++) {
      //     imageList.value[i].style.animationPlayState = 'paused'
      //   }
      //   console.log('-------------------', imageResult.value)
      // }
    };
    /**
     * 抢红包
     */
    const memberRedPacketApply = () => {
      if (!token.value) return Toast.fail('请登录后再参与活动');
      if (isApply.value) {
        isApply.value = false;
        request
          .value({
            url: '/index/Activity/redPacketApply',
            method: 'post',
            params: {
              activity_id: 17
            }
          })
          .then((res: any) => {
            if (+res.code === 1) {
              redEnvelopeChaiShow.value = false;
              redEnvelopeShow.value = true;
              redEnvelopePity.value = true;
              clearInterval(distanceStartsTime.value);
              redEnvelopePrice.value = res.data.bonus_amount;
              isApply.value = true;
            }
          })
          .catch((err: any) => {
            Toast.fail(err.msg || err.message);
            redEnvelopeChaiShow.value = false;
            redEnvelopePity.value = false;
            redEnvelopeShow.value = false;
            isApply.value = true;
          });
      }
    };
    /**
     * 倒计时结束
     */
    const distanceStartsFinish = () => {
      memberRedPacketStatus();
      startGame();
    };
    /**
     * 红包雨活动状态
     */
    const memberRedPacketStatus = () => {
      // if (!token.value) return;
      request
        .value({
          url: '/index/Activity/redPacketInfo',
          method: 'post',
          params: {
            activity_id: 17
          }
        })
        .then((res: any) => {
          if (+res.code === 1) {
            redEnvelopeObj.value = res.data;
            activityInfo.value = res.data.activity_info;
            redEnvelopeTime.value = res.data.time_list;
            redEnvelopeStatus.value = true;
            const swiper: any = document.querySelector('.swiper');
            const swiperN: any = swiper.swiper;
            for (const i in redEnvelopeTime.value) {
              if (+redEnvelopeTime.value[i].left_time > 0) {
                swiperN.slideTo(+i < 2 ? 0 : +i - 1);
                return;
              }
            }
            swiperN.slideTo(0);
          }
        })
        .catch((err: any) => {
          if (err.code) {
            redEnvelopeStatus.value = false;
          }
        });
    };
    /**
     * tabs点击事件
     */
    const redEnvelopeClickTab = (row: any) => {
      if (+row.name === 1) {
        if (!token.value) return;
        request
          .value({
            url: '/index/Activity/memberRedPacketBonusList',
            method: 'post',
            data: {
              activity_id: 17
            }
          })
          .then((res: any) => {
            if (+res.code === 1) {
              redEnvelopeTotalNum.value = res.data.total;
              redEnvelopeTotalAmount.value = res.data.total_amount;
              redEnvelopeList.value = res.data.data;
            }
          })
          .catch((err: any) => {
            Toast.fail(err.msg || err.message);
          });
      }
    };
    const redEnvelopeTimeStatus = (timeSet: any) => {
      if (+timeSet === 1) {
        return '未开始';
      } else if (+timeSet === 2) {
        return '已抢光';
      } else if (+timeSet === 3) {
        return '距开始';
      } else {
        return '已开始';
      }
    };
    onMounted(() => {
      window.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
          memberRedPacketStatus();
        }
      });
      nextTick(() => {
        memberRedPacketStatus();
      });
      // window.addEventListener('mousedown', mouseHandler)
    });
    return {
      redEnvelopeImage,
      redEnvelopeBg,
      totalMoney,
      delayTime,
      lastImage,
      imageList,
      imageResult,
      redEnvelopeActive,
      distanceStartsTime,
      redEnvelopeX,
      redEnvelopeShow,
      redEnvelopeChaiShow,
      redEnvelopeReserve,
      redEnvelopeTotalNum,
      redEnvelopeTotalAmount,
      redEnvelopeList,
      redEnvelopeStatus,
      redEnvelopeObj,
      redEnvelopeTime,
      activityInfo,
      redPacketList,
      redEnvelopePity,
      redEnvelopePrice,
      isApply,
      startGame,
      mouseHandler,
      distanceStartsFinish,
      memberRedPacketStatus,
      memberRedPacketApply,
      redEnvelopeClickTab,
      redEnvelopeTimeStatus,
      routeGo,
      parseTime,
      priceToFixed,
      autoplayOptions,
      modules
    };
  }
});
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.v-envelope {
  background-image: linear-gradient(180deg, #090506 0%, #3f1616 100%);
  padding-bottom: 30px;
  &-main {
    // width: calc(100% - 30px);
    height: 100%;
    // margin: 0 auto 20px;
    font-family: PingFang-SC;
    overflow: auto;
    &-header {
      //   height: 210px;
    }
    &-time {
      display: flex;
      flex-direction: column;
      &-title {
        display: flex;
        justify-content: center;
        height: 40px;
        line-height: 40px;
        span {
          font-size: 14px;
          font-weight: bold;
          color: #fff;
        }
      }
      &-info {
        display: flex;
        position: relative;
        flex-direction: column;
        align-items: center;
        height: 140px;
        border-radius: 8px;
        background-color: #fff;
        margin: 0 36px 24px;
        width: 304px;
        overflow: hidden;
        &-name {
          display: flex;
          margin: 21px 0 16px;
          span {
            font-size: 14px;
            font-weight: bold;
            color: #c39f7a;
          }
        }
        &-countdown {
          display: flex;
          width: calc(100% - 10px);
          &-col {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex: 33.33%;
            margin: 0 5px;
            border-radius: 8px;
            background-color: #fff;

            span {
              line-height: 21px;
              font-size: 12px;
              font-weight: bold;
              color: #fff;
              :deep(.van-count-down) {
                line-height: 21px;
                font-size: 12px;
                font-weight: bold;
                color: #fff;
              }
            }
            .ac-time {
              padding: 0 11px;
              background-color: #c39f7a;
              border-radius: 20px;
            }
            span:nth-child(2) {
              font-size: 13px;
              font-weight: normal;
              color: #c39f7a;
              margin-top: 7px;
            }
            .ac-active {
              font-size: 14px !important;
              color: #000 !important;
              font-weight: 500;
            }
          }
          :deep(.swiper) {
            position: inherit;
            width: 100%;
          }
          :deep(.swiper-button-next) {
            right: -18px;
            top: 48%;
            width: 36px;
            height: 36px;
            border-radius: 50% 0 0 50%;
            background-color: #e5e5e5;
          }
          :deep(.swiper-button-next:after) {
            width: 0;
            height: 0;
            border-top: 7px solid transparent;
            border-right: 7px solid transparent;
            border-bottom: 7px solid transparent;
            border-left: 7px solid #714c24;
            position: relative;
            left: -2px;
            content: '';
          }
          :deep(.swiper-button-prev) {
            left: -18px;
            top: 48%;
            width: 36px;
            height: 36px;
            border-radius: 0 50% 50% 0;
            background-color: #e5e5e5;
          }
          :deep(.swiper-button-prev:after) {
            width: 0;
            height: 0;
            border-top: 7px solid transparent;
            border-left: 7px solid transparent;
            border-bottom: 7px solid transparent;
            border-right: 7px solid #714c24;
            position: relative;
            left: 2px;
            background-image: none;
            content: '';
          }
        }
      }
    }
    &-bet {
      display: flex;
      align-items: center;
      &-tip {
        display: flex;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #f9d59b;
        font-weight: 400;
        margin: 0 35px;
      }
      &-button {
        display: flex;
        justify-content: center;
        margin-left: 12px;
        width: 88px;
        height: 24px;
        line-height: 24px;
        border-radius: 14px;
        background-image: linear-gradient(90deg, #dc4c33 13%, #e67b66 92%);
        border-radius: 12px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #ffffff;
        text-align: right;
        font-weight: 500;
      }
    }
    &-tabs {
      margin: 0 35px;
      :deep(.van-tabs__nav) {
        background: transparent;
      }
      :deep(.van-tabs__nav--line) {
        padding-bottom: 8px;
      }
      :deep(.van-tab) {
        font-size: 14px;
        font-weight: bold;
        color: #adbfcf;
        flex: none;
      }
      :deep(.van-tab--active) {
        color: #fff;
      }
      :deep(.van-tabs__line) {
        height: 2px;
        background-color: #de5239;
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
  }
  &-dialog {
    position: relative;
    :deep(.van-dialog) {
      width: 163px;
      height: 212px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      overflow: visible;
    }
    :deep(&-bg) {
      background-image: url('../../../assets/activity/open-red-envelope.png');
    }
    :deep(.van-popup) {
      background-color: transparent;
    }
    &-price {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-top: 36px;
      div {
        color: #dd4408;
        font-family: PingFang-SC;
      }
      div:nth-child(1) {
        font-size: 12px;
        font-weight: bold;
      }
      div:nth-child(2) {
        line-height: 30px;
        font-size: 18px;
        font-weight: bold;
      }
      div:nth-child(3) {
        font-size: 10px;
        margin-top: 10px;
      }
    }
    &-x {
      display: flex;
      width: 100%;
      justify-content: center;
      position: absolute;
      bottom: -40px;
      left: 0;
      img {
        width: 25px;
        height: 25px;
      }
    }
  }
  &-chai {
    position: relative;
    :deep(.van-dialog) {
      width: 163px;
      height: 212px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      overflow: visible;
    }
    :deep(&-bg) {
      background-image: url('../../../assets/activity/red-envelope-chai.png');
    }
    :deep(.van-popup) {
      background-color: transparent;
    }
    &-main {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 60px;
      height: 60px;
      margin-top: -30px;
      margin-left: -30px;
    }
    &-x {
      display: flex;
      width: 100%;
      justify-content: center;
      position: absolute;
      bottom: -40px;
      left: 0;
      img {
        width: 25px;
        height: 25px;
      }
    }
  }
  &-reserve {
    display: flex;
    flex-direction: column;
    :deep(.van-dialog) {
      width: 240px;
      //height: 230px;
      padding: 10px 0;
      background-color: #2d363d;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      overflow: visible;
      color: #fff;
    }
    &-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: PingFang-SC;
      div:nth-child(1) {
        line-height: 30px;
        font-size: 14px;
        color: #fff;
      }
      div:nth-child(2) {
        display: flex;
        line-height: 30px;
        font-size: 12px;
        color: #c2d2df;
        span {
          .van-count-down {
            font-size: 12px;
            color: #ff9f07;
          }
        }
      }
      div:nth-child(3) {
        line-height: 30px;
        font-size: 12px;
        color: #fff;
      }
      div:nth-child(4) {
        display: flex;
        align-items: center;
        height: 30px;
        span:nth-child(2n + 1) {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 1px solid #0fd7cb;
        }
        span:nth-child(2n) {
          width: 64px;
          height: 1px;
          background-color: #11cac0;
        }
      }
      div:nth-child(5) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 194px;
        height: 20px;
        span {
          font-size: 12px;
          color: #fff;
        }
      }
    }
    &-button {
      display: flex;
      justify-content: center;
      margin-top: 16px;
      margin-bottom: 6px;
      span {
        display: flex;
        justify-content: center;
        width: 110px;
        height: 40px;
        line-height: 40px;
        font-size: 13px;
        font-weight: bold;
        color: #1b1818;
        background-color: #de5239;
        border-radius: 8px;
      }
    }
  }
}
.tiro-task-title {
  width: 241px;
  display: block;
  margin: 24px auto;
}
.tiro-task-time {
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #dc4c33;
  font-weight: 500;
}
.ac-info {
  margin: 0 36px 24px;
  width: 304px;
  height: 163px;
  border-radius: 8px;
  background-color: #ffffff;
  padding: 24px 21px 20px 23px;
  p {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #270e0f;
    line-height: 20px;
    font-weight: 400;
    margin: 6px 0;
  }
}
.ac-info--title {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #c39f7a;
  line-height: 20px;
  font-weight: 500;
}
.ac-line {
  height: 2px;
  background-color: rgba(192, 160, 126, 0.3);
  position: absolute;
  width: 40px;
  top: 10px;
  left: 99%;
  transform: translateX(-50%);
  z-index: 100;
  img {
    width: 19px;
    position: absolute;
    top: -8px;
    right: 12px;
  }
}
.ac-line-left {
  height: 2px;
  background-color: rgba(192, 160, 126, 0.3);
  position: absolute;
  width: 18px;
  top: 10px;
  right: 68%;
  transform: translateX(-50%);
  z-index: 100;
}
:deep(.swiper-slide) {
  &:first-child .ac-line-left {
    display: none;
  }
}
:deep(.swiper-slide) {
  &:last-child .ac-line {
    display: none;
  }
}
.ac-swiper {
  margin: 0 10px;
  .ac-line {
    img {
      right: 4px;
    }
  }
}
:deep(.van-tab) {
  margin-right: 30px;
}
</style>
<style>
#packet img {
  position: absolute;
  bottom: -1000px;
  /*transform: translateY(-100%);*/
  animation: dropDowm 5s linear;
  z-index: 999;
}
@keyframes dropDowm {
  0% {
    top: 0;
    /*transform: translateY(-100%) rotate(0deg);*/
  }
  100% {
    top: 150%;
    /*transform: translateY(0%) rotate(0deg);*/
  }
}
</style>
