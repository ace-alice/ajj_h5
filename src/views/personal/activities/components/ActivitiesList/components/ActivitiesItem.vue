<template>
  <div class="v-activities-item">
    <div class="v-activities-item-t">
      <span>{{ item.activity_title }}</span>
      <span>{{ priceToFixed(item.reward_amount) }}</span>
    </div>
    <div class="v-activities-item-b">
      <div class="v-activities-item-b-time">
        <span>发放时间：{{ item.create_time }}</span>
        <span>到期时间：{{ item.expiration }}</span>
      </div>
      <div class="v-activities-item-b-button">
        <span
          v-if="item.status === 1"
          class="unaccomplished"
          @click="getItRightNow"
        >立即领取</span>
        <span v-if="item.status === 2" class="finish">已领取</span>
        <span v-if="item.status === 3" class="finish">已过期</span>
      </div>
    </div>
    <van-dialog
      v-model:show="activitiesDialogShow"
      title="提示"
      show-cancel-button
      :style="{ width: '70%' }"
      confirm-button-text="立即领取"
      cancel-button-text="稍后再领"
      @confirm="activitiesDialogConfirm"
      @cancel="activitiesDialogShow = false"
    >
      <div class="activity-dialog-main">
        您即将领取{{ item.activity_title }}{{ priceToFixed(item.reward_amount) }}元，领取成功
        后，您的提款所需流水将会增加{{ priceToFixed(item.reward_amount * item.multiple) }}元
        您是否要立即领取
      </div>
    </van-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getToken, parseTime, priceToFixed } from '@/utils/index.js'
import defaultImages from '@/hooks/defaultImages'
import { Toast } from 'vant'
import createRequestFun from '@/utils/createRequest'
import useCurrentInstance from '@/hooks/useCurrentInstance'

export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    /**
     * 获取挂载在全局的属性和获取上下文
     */
    const { proxy } = useCurrentInstance()
    const activitiesDialogShow = ref(false)
    const { announcementDefaultImage } = defaultImages()
    const getItRightNow = () => {
      activitiesDialogShow.value = true
    }
    const activitiesDialogConfirm = () => {
      createRequestFun('2', getToken())({ url: props.item.url, method: 'post' }).then((res: any) => {
        if (+res.code === 1) {
          proxy.mittBus.emit('activity', 1)
          Toast.success(res.msg)
        } else {
          Toast.fail(res.msg)
        }
      })
    }
    return {
      parseTime,
      priceToFixed,
      announcementDefaultImage,
      activitiesDialogShow,
      getItRightNow,
      activitiesDialogConfirm
    }
  }
})
</script>

<style lang="less" scoped>
.v-activities-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  padding: 14px 10px;
  height: 56px;
  border-radius: 4px;
  background-color: #2d363d;
  margin-bottom: 10px;
  &-t {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    span:nth-child(1) {
      font-size: 14px;
      color: #fefefe;
    }
    span:nth-child(2) {
      font-size: 12px;
      color: #fff;
    }
  }
  &-b {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-time {
      display: flex;
      flex-direction: column;
      font-size: 12px;
      color: #94a5b1;
      span:nth-child(1) {
        margin-bottom: 5px;
      }
    }
    &-button {
      span {
        display: flex;
        justify-content: center;
        width: 71px;
        height: 24px;
        line-height: 24px;
        border-radius: 12px;
        font-size: 12px;
      }
      .unaccomplished {
        background-image: linear-gradient(to right, #12dedf, #07c79c);
        color: #191414;
      }
      .finish {
        background-color: #8f8f8f;
        color: #fff;
      }
    }
  }
  :deep(.van-popup) {
    height: auto;
    font-family: PingFang-SC;
    background: #2d363d;
    .van-dialog__header {
      height: 40px;
      line-height: 40px;
      padding: 0;
      font-size: 14px;
      color: #fff;
      background-color: #3e4a53;
    }
    .activity-dialog-main {
      display: flex;
      justify-content: center;
      height: 110px;
      align-items: center;
      padding: 0 18px;
      font-size: 12px;
      color: #94a5b1;
    }
    .van-dialog__cancel {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #94a5b1;
      background-color: #3e4a53;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .van-dialog__confirm {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #1a242c;
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .van-hairline--top::after {
      border-top-width: 0;
    }
    .van-hairline--left::after {
      border-left-width: 0;
    }
  }
}
</style>
