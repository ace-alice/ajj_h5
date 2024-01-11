<template>
  <div class="v-vip-club">
    <PubHeader :right-icon="false" />
    <div class="v-vip-club-main">
      <div class="club-main-swiper">
        <Loading v-show="loading" min-height="245px" />
        <van-swipe :show-indicators="false" :initial-swipe="vipCurrentObj.vip_current_level" @change="clubSwiperChange">
          <van-swipe-item v-for="(item, index) in clubVipList" :key="item.id">
            <div
              class="club-main-swiper-vip"
              :class="
                [0, 1].includes(index)
                  ? 'club-main-swiper-vip1'
                  : [2, 3].includes(index)
                    ? 'club-main-swiper-vip2'
                    : [4, 5].includes(index)
                      ? 'club-main-swiper-vip3'
                      : [6, 7].includes(index)
                        ? 'club-main-swiper-vip4'
                        : 'club-main-swiper-vip5'
              "
            >
              <div class="swiper-vip-name">
                <span>{{ item.level_name }}</span>
                <span>
                  保级条件：累计存款
                  {{ toFixed2(item.protect_recharge, true) }}
                  ，累计流水
                  {{ toFixed2(item.protect_water, true) }}
                </span>
              </div>
              <div
                v-if="vipCurrentObj.vip_current_level === item.level && index < clubVipList.length - 1"
                class="swiper-vip-progress"
              >
                <div class="swiper-vip-progress-info van-ellipsis">
                  <div>
                    <span>当前存款：</span>
                    <span>
                      {{ vipCurrentObj.upgrade_deposit }}/{{ toFixed2(clubVipList[index + 1].up_recharge, true) }}
                    </span>
                  </div>
                  <div>
                    <span style="margin-left: 5px;">当前流水：</span>
                    <span> {{ vipCurrentObj.upgrade_bet }}/{{ toFixed2(clubVipList[index + 1].up_water, true) }} </span>
                  </div>
                </div>
                <van-progress
                  :color="item.color"
                  stroke-width="3"
                  :show-pivot="false"
                  :percentage="vipCurrentObj.upgrade_percentage"
                />
              </div>
              <div v-else-if="index < clubVipList.length - 1" class="swiper-vip-upgrade">
                <span>升级条件：</span>
                <span>
                  累计存款
                  {{ toFixed2(clubVipList[index + 1].up_recharge, true) }}
                  ，累计流水
                  {{ toFixed2(clubVipList[index + 1].up_water, true) }}
                </span>
              </div>
              <div v-else-if="vipCurrentObj.vip_current_level === item.level" class="swiper-vip-upgrade">
                <!--                <span>升级条件：</span>-->
                <span>
                  当前存款
                  {{ vipCurrentObj.upgrade_deposit }}
                  当前流水
                  {{ toFixed2(item.protect_water, true) }}
                </span>
              </div>
              <div class="swiper-vip-image">
                <van-image :src="vipIcon" />
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="club-main-info">
        <van-row v-if="clubVipList[clubSwiperIndex]">
          <van-col v-if="clubVipList[clubSwiperIndex].upgrade > 0" :span="6">
            <div class="club-main-info-text">
              <div>
                <svg-icon icon-class="vip-birthday" />
              </div>
              <div>{{ toFixed2(clubVipList[clubSwiperIndex].upgrade, true) }}</div>
              <div>晋级礼金</div>
            </div>
          </van-col>
          <van-col v-if="clubVipList[clubSwiperIndex].birthday > 0" :span="6">
            <div class="club-main-info-text">
              <div>
                <svg-icon icon-class="vip-withdrawal-times" />
              </div>
              <div>{{ toFixed2(clubVipList[clubSwiperIndex].birthday, true) }}</div>
              <div>生日礼金</div>
            </div>
          </van-col>
          <van-col v-if="clubVipList[clubSwiperIndex].withdrawals_limit > 0" :span="6">
            <div class="club-main-info-text">
              <div>
                <svg-icon icon-class="vip-promotion" />
              </div>
              <div>
                {{ toFixed2(clubVipList[clubSwiperIndex].withdrawals_limit, true) }}
              </div>
              <div>提款额度</div>
            </div>
          </van-col>
          <van-col v-if="clubVipList[clubSwiperIndex].withdrawals > 0" :span="6">
            <div class="club-main-info-text">
              <div>
                <svg-icon icon-class="vip-withdrawal-limit" />
              </div>
              <div>{{ clubVipList[clubSwiperIndex].withdrawals }}次</div>
              <div>提款次数</div>
            </div>
          </van-col>
          <van-col v-if="clubVipList[clubSwiperIndex].first_bonus_cap > 0" :span="6">
            <div class="club-main-info-text">
              <div>
                <svg-icon icon-class="vip-resurrection-gold" />
              </div>
              <div>
                {{ toFixed2(clubVipList[clubSwiperIndex].first_bonus_cap, true) }}
              </div>
              <div>月首充返现</div>
            </div>
          </van-col>
          <van-col v-if="clubVipList[clubSwiperIndex].resurrection_bonus_cap > 0" :span="6">
            <div class="club-main-info-text">
              <div>
                <svg-icon icon-class="vip-cash-back" />
              </div>
              <div>
                {{ toFixed2(clubVipList[clubSwiperIndex].resurrection_bonus_cap, true) }}
              </div>
              <div>月复活金</div>
            </div>
          </van-col>
        </van-row>
      </div>
      <div class="club-main-tabs">
        <van-tabs v-model:active="tabActive">
          <van-tab title="会员权益">
            <UserTable />
          </van-tab>
          <van-tab title="VIP返水">
            <VipTable />
          </van-tab>
          <van-tab title="月首充返现">
            <CashTable />
          </van-tab>
          <van-tab title="月复活金">
            <GoldTable />
          </van-tab>
        </van-tabs>
      </div>
      <div class="vip-club-rule">
        <div class="title">
          <span>规则说明</span>
        </div>
        <div v-if="tabActive === 0" class="content">
          <span>
            1.晋升标准：会员充值且流水达到相应级别即可晋升相应VIP等级。
          </span>
          <span>
            2.晋升顺序：VIP等级不可越级晋升，每天仅限晋升一级。
          </span>
          <span>
            3.晋级奖金：会员晋级成功晋级奖金将需要在我的活动页面中领取，每个VIP等级的晋级奖金仅限领取一次。
          </span>
          <span>
            4.保级标准：会员在达到某VIP等级后，90天内投注需要完成保级要求。如果在此期间完成晋升，保级要求按照当前等级计算。
          </span>
          <span>
            5.降级标准：如果会员在90天内没有完成相应的保级流水，系统会自动降级1个等级，相应的返水及其它活动福利也会调整至降级后的等级。
          </span>
          <span>
            6.月首充返现：会员在注册成功30天后，即可申请领取月首充活动。
          </span>
          <span>
            7.生日奖金：会员在注册后90天内生日，今年将不能领取生日礼金，另注册时间大于90天的会员需在生日当天到我的活动页面领取，每年仅限领取一次。
          </span>
          <span>
            8.奖金流水：晋级奖金、生日奖金领取后需要完成一倍有效流水后即可提款，此活动不可以与其它活动共享。
          </span>
          <span>
            9.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133，串关、走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）
          </span>
          <span>
            10.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。
          </span>
        </div>
        <div v-if="tabActive === 1" class="content">
          <span>
            1.电竞、体育返水将于每日凌晨2:00系统自动派发，领取返水奖金需完成一倍有效流水。
          </span>
          <span>
            2.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133，串关、走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）
          </span>
          <span>
            3.每位有效会员、手机号码、电子邮箱、银行卡、IP地址、每台设备仅限一个账户享受此活动，对违规的会员，平台保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
          </span>
          <span>
            4.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。
          </span>
        </div>
        <div v-if="tabActive === 2" class="content">
          <span>
            1.会员每月首充金额≥500元即可在VIP页面申请此活动，充值后如有提款操作则本月无法申请此活动。
          </span>
          <span>
            2.充值成功后请在VIP页面领取奖金，会员需完成对应有效流水即可提款，此活动不可与其它活动共享。
            例：本金1000元，奖金150元 （1000+150）*12=13800元
          </span>
          <span>
            3.会员在注册成功30天后，即可申请领取月首充活动。
          </span>
          <span>
            4.VIP会员单笔存款要求以及对应活动奖金以会员申请后充值到账时间所对应的VIP等级为准。
          </span>
          <span>
            5.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133，串关、走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）
          </span>
          <span>
            6.每位有效会员、手机号码、电子邮箱、银行卡、IP地址、每台设备只能享受一次活动，对违规的会员，平台保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
          </span>
          <span>
            7.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。
          </span>
        </div>
        <div v-if="tabActive === 3" class="content">
          <span>
            1.月复活金每一个自然月为一个周期，如会员当月负盈利金额≥20万既可在VIP页面领取复活金。
          </span>
          <span>
            2.复活金将于每月1号-5号派发，会员需在VIP页面领取，领取复活金需完成一倍有效流水，奖金派发时限内未领取则视为自动放弃。
          </span>
          <span>
            3.电竞赔率：＜1.5，体育赔率：香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133，串关、走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）
          </span>
          <span>
            4.每位有效会员、手机号码、电子邮箱、银行卡、IP地址、每台设备仅限一个账户享受此活动，对违规的会员，平台保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
          </span>
          <span>
            5.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted, nextTick } from 'vue';
import PubHeader from '@/components/PubHeader/index.vue';
import UserTable from './components/UserTable/index.vue';
import VipTable from './components/VipTable/index.vue';
import CashTable from './components/CashTable/index.vue';
import GoldTable from './components/GoldTable/index.vue';
import { getVipList, vipCurrent } from '@/api/vip.js';
import { toFixed2 } from '@/utils/index.js';
import { useRoute } from 'vue-router';
import Loading from '@/components/Loading/index.vue';

export default defineComponent({
  name: 'VipClub',
  components: {
    PubHeader,
    UserTable,
    VipTable,
    CashTable,
    GoldTable,
    Loading
  },
  setup() {
    const vipIcon = require('@/assets/vip/vip-silver.png');
    /**
     * tabs默认
     */

    const tabActive = ref(0);
    const vipCurrentObj: any = ref({});
    const state = reactive({
      clubSwiperIndex: 0,
      clubVipList: []
    });
    const clubTabsChange = (id: number) => {
      tabActive.value = id;
    };
    /**
     * 获取vip轮播图信息
     */
    const getVipInfoList = async() => {
      const data = await getVipList();
      if (Number(data.code) === 1) {
        state.clubVipList = data.data;
      }
    };
    /**
     * 轮播图改变事件
     */
    const clubSwiperChange = (index: number) => {
      state.clubSwiperIndex = index;
    };
    /**
     * 获取当前等级信息
     */
    const getVipCurrent = async() => {
      const data = await vipCurrent();
      if (Number(data.code) === 1) {
        vipCurrentObj.value = data.data;
      }
    };

    const route = useRoute();

    const loading = ref(true);
    onMounted(async() => {
      nextTick(() => {
        const tab = route.query.tab;
        if (tab) {
          tabActive.value = Number(tab);
        }
      });
      await getVipCurrent();
      await getVipInfoList();
      loading.value = false;
      state.clubSwiperIndex = vipCurrentObj.value.vip_current_level
    });
    return {
      ...toRefs(state),
      tabActive,
      vipIcon,
      toFixed2,
      vipCurrentObj,
      getVipCurrent,
      clubTabsChange,
      getVipInfoList,
      clubSwiperChange,
      loading
    };
  }
});
</script>

<style lang="less" scoped>
.v-vip-club {
  color: #fff;

  &-main {
    margin: 48px 0px 15px 0px;
    padding-bottom: 10px;
    height: calc(100% - 60px);
    overflow: auto;
    position: relative;

    .club-main-swiper {
      height: 130px;
      position: relative;

      :deep(.van-swipe) {
        height: 130px;
      }

      &-vip {
        position: relative;
        display: flex;
        flex-direction: column;
        margin: 0 10px;
        height: 100%;
        border-radius: 8px;

        .swiper-vip-name {
          display: flex;
          flex-direction: column;
          width: calc(100% - 20px);
          margin: 20px 0 0 20px;

          span:nth-child(1) {
            font-size: 24px;
            font-weight: bold;
            color: #eef5ff;
          }

          span:nth-child(2) {
            line-height: 24px;
            font-size: 10px;
            font-weight: 300;
            color: #eef5ff;
          }
        }

        .swiper-vip-progress {
          position: absolute;
          width: calc(100% - 40px);
          left: 20px;
          bottom: 10px;
          font-size: 12px;

          &-info {
            display: flex;
            line-height: 32px;

            div {
              display: flex;
              width: 50%;

              span:nth-child(1) {
                color: #eef5ff;
              }
            }
          }
        }

        .swiper-vip-upgrade {
          position: absolute;
          bottom: 14px;
          left: 20px;
          display: flex;
          flex-direction: column;
          font-size: 12px;
          color: #fff;
          font-family: PingFang-SC;
        }

        .swiper-vip-image {
          position: absolute;
          right: 0;
          top: 0;
          width: 100px;
          height: 100px;
        }
      }

      &-vip1 {
        background-image: linear-gradient(to right, #c1d5f1, #7c95cd);

        :deep(.van-progress) {
          background: #d5e6ff;
        }
      }

      &-vip2 {
        background-image: linear-gradient(to right, #f9b344, #e39807);

        :deep(.van-progress) {
          background: #fce1b5;
        }
      }

      &-vip3 {
        background-image: linear-gradient(to right, #b8b0eb, #6e64be);

        :deep(.van-progress) {
          background: #e4e0ff;
        }
      }

      &-vip4 {
        background-image: linear-gradient(to right, #f1c6c9, #dd97a1);

        :deep(.van-progress) {
          background: #f9dadd;
        }
      }

      &-vip5 {
        background-image: linear-gradient(to right, #ffbbc2, #f94d5b);

        :deep(.van-progress) {
          background: #ffc7cc;
        }
      }
    }

    .club-main-info {
      margin: 0 15px;
      min-height: 103px;

      :deep(.van-col) {
        display: flex;
        justify-content: center;
      }

      &-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 10px;

        div:nth-child(1) {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 44px;
          height: 44px;
          border-radius: 44px;
          background-color: #22282e;
        }

        div:nth-child(2) {
          display: flex;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
          color: #f6d8a0;
          font-weight: bold;
        }

        div:nth-child(3) {
          font-size: 13px;
          color: #fff;
        }
      }
    }

    .club-main-tabs {
      //display: flex;
      margin: 10px 15px;

      :deep(.van-tabs__nav) {
        background: transparent;
      }

      :deep(.van-tab) {
        padding: 0;

        .van-tab__text {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          height: 40px;
          margin: 0 5px;
          background-color: #3e4a53;
          border-radius: 4px;
          font-size: 13px;
          color: #c6d8e6;
          font-weight: 500;
        }
      }

      :deep(.van-tab:nth-child(1)) {
        .van-tab__text {
          margin-left: 0;
        }
      }

      :deep(.van-tab:nth-child(4)) {
        .van-tab__text {
          margin-right: 0;
        }
      }

      :deep(.van-tab--active) {
        .van-tab__text {
          background-image: linear-gradient(to right, #12dedf, #07c79c);
          color: #131516;
        }
      }

      :deep(.van-tabs__line) {
        width: 0;
      }
    }

    .vip-club-rule {
      display: flex;
      margin: 0 15px;
      flex-direction: column;

      .title {
        display: flex;
        font-size: 13px;
        color: #fff;
        line-height: 24px;
      }

      .content {
        display: flex;
        flex-direction: column;

        span {
          font-size: 12px;
          font-weight: 300;
          color: #a8b8c5;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
