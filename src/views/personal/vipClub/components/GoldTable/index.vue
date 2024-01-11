<template>
  <div>
    <div class="vip-club-table-th">
      <van-row>
        <van-col :span="4">等级</van-col>
        <van-col :span="8">每月负盈利金额</van-col>
        <van-col :span="6">复活金比例</van-col>
        <van-col :span="6">奖金上限</van-col>
      </van-row>
    </div>
    <div
      class="vip-club-table-content"
      :class="{ 'min-height': clubTableList.length < 1 }"
    >
      <transition-group
        name="more"
        :css="false"
        @before-enter="beforeEnter"
        @enter="paragraphEnter"
      >
        <van-row
          v-for="(item, index) in clubTableList"
          :key="index"
          :class="index % 2 === 0 ? '' : 'interlaced-color'"
          :data-index="index + 1"
        >
          <van-col :span="4">{{ item.level_name }}</van-col>
          <van-col :span="8">≥¥{{ toFixed2(item.burden) }}</van-col>
          <van-col :span="6">{{ priceToFixed(item.resurrection) }}%</van-col>
          <van-col :span="6">¥{{ priceToFixed(item.bonus_cap) }}</van-col>
        </van-row>
      </transition-group>
    </div>
    <div class="vip-club-table-button">
      <span
        v-if="goldTableObj.status === 1"
        class="disable-button"
        @click="goldTableDialogConfirm"
      >领取月复活金</span>
      <span v-else class="disable-button">领取月复活金</span>
    </div>
    <van-dialog
      v-model:show="goldTableDialogShow"
      title="提示"
      show-cancel-button
      :style="{ width: '70%' }"
      confirm-button-text="立即领取"
      cancel-button-text="稍后再领"
      @confirm="goldTableDialogConfirm"
      @cancel="goldTableDialogShow = false"
    >
      <div class="gold-table-dialog-main">
        您即将领取月首充返现{{ priceToFixed(goldTableObj.reward_amount) }}元，领取成功后，
        您的提款所需流水将会增加{{ priceToFixed(goldTableObj.reward_amount * goldTableObj.multiple) }}元
        您是否要立即领取
      </div>
    </van-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import {
  resurrectionVip,
  vipResurrectionApply,
  vipResurrectionStatus
} from '@/api/vip.js'
import { Toast } from 'vant'
import { toFixed2, priceToFixed } from '@/utils/index.js'
import listAnimateHook from '@/hooks/listAnimate';

export default defineComponent({
  setup() {
    /**
     * 月复活金列表
     */
    const clubTableList = ref([])
    /**
     * 月首充返现弹窗状态
     */
    const goldTableDialogShow = ref(false)
    /**
     * 月首充奖励数据
     */
    const goldTableObj = ref({})
    /**
     * 获取月复活金数据
     */
    const getResurrectionVip = async() => {
      await resurrectionVip().then((res: any) => {
        if (+res.code === 1) {
          clubTableList.value = res.data
        }
      }).catch((err: any) => {

      })
    }
    /**
     * 是否有月复活奖励
     */
    const getVipResurrectionStatus = async() => {
      await vipResurrectionStatus().then((res: any) => {
        if (+res.code === 1) {
          goldTableObj.value = res.data
        }
      }).catch((err: any) => {

      })
    }
    /**
     * 领取月复活奖励
     */
    const receiveVipResurrectionStatus = () => {
      goldTableDialogShow.value = true
    }
    const goldTableDialogConfirm = async() => {
      await vipResurrectionApply().then((res: any) => {
        if (+res.code === 1) {
          Toast.success({
            message: '领取成功',
            duration: 1500
          })
          getVipResurrectionStatus()
        } else {
          if (+res.code === 10001) {
            Toast.fail(res.msg)
          }
        }
      }).catch((err: any) => {
        Toast.fail(err.msg)
      })
    }
    const { beforeEnter, paragraphEnter } = listAnimateHook()
    onMounted(() => {
      getResurrectionVip()
      getVipResurrectionStatus()
    })
    return {
      clubTableList,
      goldTableDialogShow,
      goldTableObj,
      priceToFixed,
      toFixed2,
      getResurrectionVip,
      getVipResurrectionStatus,
      receiveVipResurrectionStatus,
      goldTableDialogConfirm,
      beforeEnter,
      paragraphEnter
    }
  }
})
</script>

<style lang="less" scoped>
.min-height{
  min-height: 400px;
}
.vip-club-table-th {
  margin-top: 10px;
  :deep(.van-col) {
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 12px;
    background-color: #2d363d;
    border-right: 1px solid #64737e;
  }
  :deep(.van-col:first-child) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  :deep(.van-col:last-child) {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-right: none;
  }
}
.vip-club-table-content {
  .interlaced-color {
    :deep(.van-col) {
      background-color: #2d363d;
    }
    :deep(.van-col:first-child) {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    :deep(.van-col:last-child) {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
  :deep(.van-col) {
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 12px;
  }
}
.vip-club-table-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 66px;
  .disable-button {
    background-color: #bbb;
    color: #fff;
  }
  .enable-button {
    background-image: linear-gradient(to right, #12dedf, #07c79c);
    color: #1c2227;
  }
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 34px;
    border-radius: 17px;
    font-size: 13px;
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
  .gold-table-dialog-main {
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
</style>
