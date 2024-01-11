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
        <span v-if="+activityInfo['is_time_limit'] === 1">
          {{ parseTime(activityInfo.start_time, '{y}/{m}/{d}') }} -
          {{ parseTime(activityInfo.end_time, '{y}/{m}/{d}') }}
        </span>
        <span v-else>长期活动</span>
      </div>
      <div class="swipe-main">
        <div class="swipe-title">
          <span
            v-if="eventLists.length"
          >共<span>{{ eventLists.length }}</span>场包赔赛事</span>
          <span v-else>暂无包赔赛事</span>
        </div>
        <div class="swipe-box">
          <van-swipe ref="swipeRef" class="my-swipe" :show-indicators="false" @change="swipeChangeDone">
            <van-swipe-item v-for="(item, index) in eventLists" :key="index">
              <div class="swipe-item-box">
                <div>
                  <!--                  <div>{{ item.event_name }}</div>-->
                  <van-image height="35" fit="contain" :src="item.home_team_logo" />
                  <div>{{ item.home_team_name }}</div>
                </div>
                <div class="swipe-item-box-info">
                  <div>{{ item.event_name }}</div>
                  <div>{{ parseTime(item.event_time, '{y}.{m}.{d} {h}:{i}') }}</div>
                </div>
                <div>
                  <van-image height="35" fit="contain" :src="item.away_team_logo" />
                  <div>{{ item.away_team_name }}</div>
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
        <van-icon class="swipe-icon left-icon" name="arrow-left" @click.stop="swipeChange(1)" />
        <van-icon class="swipe-icon right-icon" name="arrow" @click.stop="swipeChange(2)" />
      </div>
      <div class="tiro-task-time">
        活动内容：
      </div>
      <div class="tiro-task-table">
        <div class="table-header">
          <div>VIP等级</div>
          <div>充值金额</div>
          <div>单笔投注金额</div>
          <div>包赔返利</div>
          <div>包赔上限</div>
        </div>
        <div
          v-for="(content, index) in contentLists"
          :key="index"
          class="table-body"
          :class="{ 'has-back': index % 2 === 1 }"
        >
          <div>VIP{{ content.level_name }}</div>
          <div>{{ activityInfoTemplate?.min_deposit_amount }}</div>
          <div>≥{{ activityInfoTemplate?.single_bet_amount }}</div>
          <div>{{ content.cashback_percentage }}%</div>
          <div>{{ content.limit_amount }}</div>
        </div>
      </div>

      <div class="list-button is-click" @click.stop="openVenuePayDialog">
        <!--        <van-loading v-show="receiveLoading" type="spinner" size="18px" />-->
        <span>立即申请</span>
      </div>
      <div class="tiro-task-time">
        活动规则
      </div>
      <div class="rule-box-item">
        1.会员在指定赛事投注即可获得活动返利，每位会员每日仅限申请一次包赔活动。
      </div>
      <div class="rule-box-item">
        2.包赔活动赛事投注仅限独赢，让球，大小，单双四个盘口，允许投注上半场或全场及滚球，投注赛事赔率不得低于香港盘＜0.75、欧洲盘＜1.75、马来盘＜0.75、印尼盘＜-1.3、美国盘＜-133。
      </div>
      <div class="rule-box-item">
        3.包赔活动注单结算为输一半则视为无效注单，不可申请包赔活动。
      </div>
      <div class="rule-box-item">
        4.首充定义：当日充值后未发起提款，此活动不可与其它充值活动共享。
      </div>
      <div class="rule-box-item">
        5.申请方式：会员需在注单结算后次日23:59:59分之前，进入活动页面领取，逾期视为放弃领取。奖金将会在申请后24小时内派发到主钱包中。
      </div>
      <div class="rule-box-item">
        6.活动领取奖金需在体育产品中完成三倍流水后可提款，有效投注额仅对已结算并产生输赢结果的投注额进行计算，香港盘0.75以下，欧洲盘1.75以下，马来盘0.75以下，印尼盘-1.3以下，美国盘-133以下，串关，走盘，注单取消，对冲等情况都不算有效流水。（虚拟游戏投注不计算在有效流水内）。
      </div>
      <div class="rule-box-item">
        7.每位有效会员、手机号码、电子邮箱、银行卡、IP地址、每台设备仅限一个账户享受此活动，对违规的用户，保留无限期审核，如发现恶意刷取活动套利者，将扣除红利及所得盈利。
      </div>
      <div class="rule-box-item">
        8.凡参加活动会员，即表示接受且自愿遵守平台规定，平台保留最终解释权。
      </div>
    </div>
    <div class="tiro-task-dialog">
      <van-dialog v-model:show="venuePayDialog" :show-confirm-button="false" :show-cancel-button="false">
        <div class="tiro-task-dialog-header">
          <span>申请</span>
        </div>
        <div class="tiro-task-dialog-main">
          <!--          <van-form @submit="venuePayOnSubmit">-->
          <van-cell-group inset>
            <van-field
              v-model="venuePayResult"
              is-link
              readonly
              name="picker"
              label="选择场馆："
              placeholder="请选择场馆"
              @click="venuePayShowPicker = true"
            />
            <van-popup v-model:show="venuePayShowPicker" teleport="#app" position="bottom">
              <van-picker
                :columns="venuePayColumns"
                @confirm="venuePayOnConfirm"
                @cancel="venuePayShowPicker = false"
              />
            </van-popup>
            <van-field
              v-model="timeResult"
              is-link
              readonly
              name="datePicker"
              label="投注日期："
              placeholder="请选择投注日期"
              @click="timeShowPicker = true"
            />
            <van-popup v-model:show="timeShowPicker" teleport="#app" position="bottom">
              <van-date-picker @confirm="timeOnConfirm" @cancel="timeShowPicker = false" />
            </van-popup>
            <van-field
              v-model="orderId"
              name="注单号码"
              label="注单号码："
              placeholder="请输入对应赛事的注单号码"
            />
          </van-cell-group>
          <!--          </van-form>-->
        </div>
        <div class="tiro-task-dialog-footer">
          <span @click.stop="venuePayDialog = false">取消</span>
          <span
            v-if="venuePayButtonDialogType"
            @click.stop="venuePayOnSubmit"
          >确定</span>
          <span v-else>确定</span>
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, ref, Ref } from 'vue';
import defaultImages from '@/hooks/defaultImages';
import GlobalLoading from '@/components/Loading/index.vue';
import { Toast } from 'vant';
import activityPageHook from '@/hooks/activityPage';
import { parseTime } from '@/utils/index.js';
import ImageLoadBox from '@/components/ImageLoadBox/index.vue';

export default defineComponent({
  name: 'VenuePay',
  components: { GlobalLoading, ImageLoadBox },
  setup() {
    const { pageHeaderDefaultImage } = defaultImages();

    const { infoLoading, activityInfo, request, token } = activityPageHook();

    const friendInvitationImg = require('@/assets/activity/venue-pay.png');

    const currentGameId: Ref<any> = ref(null);

    const venuePayColumns = [
      {
        value: 1,
        text: '小艾电竞'
      },
      {
        value: 4,
        text: '小艾体育'
      },
      {
        value: 3,
        text: '平博体育'
      },
      {
        value: 2,
        text: '沙巴体育'
      }
    ]

    const venuePayShowPicker = ref(false)

    const venuePayResult = ref('')

    const venuePayId = ref('')

    const timeResult = ref('')

    const timeShowPicker = ref(false)

    const venuePayDialog = ref(false)

    const orderId = ref('')

    const venuePayButtonDialogType = ref(true)

    let isInit: boolean = false;

    function initCurrentGameId(eventList: any[]) {
      if (isInit) return;
      currentGameId.value = eventList[0].id;
      isInit = true;
      // getStatus();
    }

    const { proxy }: any = getCurrentInstance();

    const activityInfoTemplate = computed(() => {
      if (activityInfo?.activity_template_content) {
        return JSON.parse(activityInfo.activity_template_content) || {};
      } else {
        return {};
      }
    });

    const formatter = (time: any) => {
      const newDate = time == null ? new Date() : new Date(time);
      const year = newDate.getFullYear();
      const month = newDate.getMonth() + 1;
      const date = newDate.getDate();
      let newTime = year + '-';
      if (month < 10) {
        newTime += '0';
      }
      newTime += month + '-';
      if (date < 10) {
        newTime += '0';
      }
      newTime += date;

      return newTime;
    }

    const contentLists = computed(() => {
      if (activityInfo?.activity_template_content) {
        return JSON.parse(activityInfo.activity_template_content).vip_arr || [];
      } else {
        return [];
      }
    });

    const eventLists = computed(() => {
      if (activityInfo?.activity_template_content) {
        const eventL = JSON.parse(activityInfo.activity_template_content).event_arr || [];

        if (eventL.length > 0) {
          // noinspection ES6ShorthandObjectProperty
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          initCurrentGameId(eventL);
        }
        return eventL;
      } else {
        return [];
      }
    });

    const venuePayOnConfirm = (values: any) => {
      venuePayShowPicker.value = false
      venuePayResult.value = values.selectedOptions[0].text
      venuePayId.value = values.selectedOptions[0].value
      // fieldValue.value = selectedOptions[0].text
    }

    const timeOnConfirm = (values: any) => {
      timeResult.value = formatter(values.selectedValues.join('/'))
      timeShowPicker.value = false
    }

    const venuePayOnSubmit = () => {
      if (!token.value) return;
      if (!currentGameId.value) {
        return Toast.fail('赛事ID不能为空')
      }
      if (!venuePayId.value) {
        return Toast.fail('场馆不能为空')
      }
      if (!timeResult.value) {
        return Toast.fail('投注时间不能为空')
      }
      if (!orderId.value) {
        return Toast.fail('注单号不能为空')
      }
      if (venuePayButtonDialogType.value) {
        venuePayButtonDialogType.value = false
        const params = {
          id: currentGameId.value,
          venue_id: venuePayId.value,
          bet_time: parseTime(timeResult.value, '{y}-{m}-{d} {h}:{i}:{s}'),
          order_id: orderId.value
        }
        request.value({
          url: '/index/Activity/sportsBonusApply',
          method: 'post',
          data: params
        }).then((res: any) => {
          if (+res.code === 1) {
            venuePayDialog.value = false
            Toast.success('申请成功')
          }
          venuePayButtonDialogType.value = true
        }).catch((err: any) => {
          Toast.fail(err.msg || err.message)
          venuePayButtonDialogType.value = true
        })
      }
    }

    const receiveLoading = ref(false);

    // function toGetPrice() {
    //   if (!token.value) return;
    //   if (!isReceive.value || receiveLoading.value) return;
    //   receiveLoading.value = true;
    //   request
    //     .value({
    //       url: '/index/Activity/sportsBonusApply',
    //       method: 'post',
    //       data: { id: currentGameId.value }
    //     })
    //     .then((res: any) => {
    //       // eslint-disable-next-line eqeqeq
    //       if (res.code == 1) {
    //         isReceive.value = false;
    //         Toast.success(`奖金领取成功！`);
    //       } else {
    //         Toast(res.msg || res.message);
    //       }
    //     })
    //     .finally(() => {
    //       receiveLoading.value = false;
    //     });
    // }

    // const isReceive = ref(false);

    // function getStatus() {
    //   if (!token.value) return (isReceive.value = false);
    //   isReceive.value = false;
    //   request
    //     .value({
    //       url: '/index/Activity/sportsCashbackInfo',
    //       method: 'post',
    //       data: { id: currentGameId.value }
    //     })
    //     .then((res: any) => {
    //       if (+res.code === 1) {
    //         isReceive.value = Boolean(Number(res.data.is_claim)) || false;
    //       } else {
    //         isReceive.value = false;
    //         Toast(res.msg || res.message);
    //       }
    //     })
    //     .catch(() => {
    //       isReceive.value = false;
    //     });
    // }

    const openVenuePayDialog = () => {
      venuePayButtonDialogType.value = true
      venuePayResult.value = ''
      venuePayId.value = ''
      timeResult.value = ''
      orderId.value = ''
      venuePayDialog.value = true
    }

    function swipeChange(handle: number) {
      if (proxy.$refs['swipeRef']) {
        if (handle === 1) {
          proxy.$refs['swipeRef'].prev();
        }
        if (handle === 2) {
          proxy.$refs['swipeRef'].next();
        }
      }
    }

    function swipeChangeDone(index: number) {
      currentGameId.value = eventLists.value[index].id;
      // getStatus();
    }

    return {
      pageHeaderDefaultImage,
      contentLists,
      friendInvitationImg,
      // isReceive,
      // toGetPrice,
      infoLoading,
      receiveLoading,
      activityInfoTemplate,
      activityInfo,
      eventLists,
      token,
      parseTime,
      swipeChange,
      swipeChangeDone,
      venuePayColumns,
      venuePayDialog,
      venuePayOnConfirm,
      venuePayShowPicker,
      venuePayResult,
      venuePayOnSubmit,
      timeResult,
      timeShowPicker,
      timeOnConfirm,
      venuePayId,
      orderId,
      venuePayButtonDialogType,
      formatter,
      openVenuePayDialog
    };
  }
});
</script>

<style lang="less" scoped>
.swipe-main {
  height: 150px;
  width: 100%;
  background-color: #3e4a53;
  border-radius: 8px;
  position: relative;
  margin-top: 15px;
  .swipe-icon {
    position: absolute;
    color: #adbfcf;
    font-size: 20px;
    font-weight: bold;
  }
  .left-icon {
    left: 1.5px;
    top: 80px;
  }
  .right-icon {
    right: 2.5px;
    top: 80px;
  }
  .swipe-title {
    height: 38px;
    line-height: 38px;
    text-align: center;
    font-family: PingFang-SC, serif;
    color: #fff;
    font-size: 14px;
    > span > span {
      color: #0ed5c4;
    }
  }
  .swipe-box {
    width: 86%;
    height: 100px;
    margin: auto;
    overflow: hidden;
    border-radius: 8px;
    .my-swipe .van-swipe-item {
      font-size: 20px;
      height: 100px;
      background-color: #2d363d;
      .swipe-item-title {
        font-size: 13px;
        font-weight: 400;
        color: #adbfcf;
        width: calc(100% - 30px);
        margin: auto;
        height: 35px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
      }
      .swipe-item-box {
        height: 100px;
        width: 100%;
        display: flex;
        color: #feffff;
        font-size: 13px;
        font-weight: 400;
        &-info {
          div {
            white-space: inherit !important;
            word-wrap: break-word;
          }
        }
        & > div {
          width: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          & > div {
            width: calc(100% - 6px);
            margin: 3px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
          }
        }
      }
    }
  }
}

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
        width: 20%;
        overflow: hidden;
        height: 40px;
        line-height: 40px;
        text-align: center;
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
  .tiro-task-dialog {
    :deep(.van-popup) {
      width: 80%;
      border-radius: 5px;
      background-color: #2d363d;
    }
    &-header {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 40px;
      background-color: #3e4a53;
      color: #fff;
      font-size: 14px;
    }
    &-main {
      display: flex;
      align-items: center;
      padding: 20px 0;
      :deep(.van-cell-group) {
        background: transparent;
      }
      :deep(.van-cell) {
        background: transparent;
        font-size: 12px;
      }
      :deep(.van-field__label) {
        display: flex;
        height: 26px;
        line-height: 26px;
        color: #fff;
        width: 70px;
      }
      :deep(.van-cell__value) {
        height: 26px;
        line-height: 26px;
        color: #fff;
      }
      :deep(.van-field__control) {
        height: 26px;
        line-height: 26px;
        color: #fff;
      }
      ::placeholder {
        font-size: 12px;
        height: 26px;
        line-height: 26px;
      }
    }
    &-footer {
      display: flex;
      height: 40px;
      span {
        display: flex;
        flex: 1 0 50%;
        align-items: center;
        justify-content: center;
      }
      span:nth-child(1) {
        background-color: #3e4a53;
        color: #94a5b1;
        font-size: 14px;
      }
      span:nth-child(2) {
        background-image: linear-gradient(to right, #12dedf, #07c79c);
        font-size: 14px;
        color: #1a242c;
      }
    }
  }
}
</style>
