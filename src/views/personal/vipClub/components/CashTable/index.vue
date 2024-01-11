<template>
  <div>
    <div class="vip-club-table-th">
      <van-row>
        <van-col :span="4">等级</van-col>
        <van-col :span="5">月首充条件</van-col>
        <van-col :span="5">返现比例</van-col>
        <van-col :span="5">奖金上限</van-col>
        <van-col :span="5">流水倍数</van-col>
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
          <van-col :span="5">≥¥{{ priceToFixed(item.min_recharge) }}</van-col>
          <van-col :span="5">{{ priceToFixed(item.inverse_ratio) }}%</van-col>
          <van-col :span="5">¥{{ priceToFixed(item.bonus_cap) }}</van-col>
          <van-col :span="5">{{ item.multiple }}</van-col>
        </van-row>
      </transition-group>
    </div>
    <div class="vip-club-table-button">
      <span
        v-if="cashTableObj.status === 1"
        class="enable-button"
        @click="cashTableDialogConfirm"
      >领取每月首充返现</span>
      <span v-else class="disable-button">领取每月首充返现</span>
    </div>
    <van-dialog
      v-model:show="cashTableDialogShow"
      title="提示"
      show-cancel-button
      :style="{ width: '70%' }"
      confirm-button-text="立即领取"
      cancel-button-text="稍后再领"
      @confirm="cashTableDialogConfirm"
      @cancel="cashTableDialogShow = false"
    >
      <div class="cash-table-dialog-main">
        您即将领取月首充返现{{
          priceToFixed(cashTableObj.money)
        }}元，领取成功后， 您的提款所需流水将会增加{{
          priceToFixed(cashTableObj.money * cashTableObj.multiple)
        }}元 您是否要立即领取
      </div>
    </van-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import {
  firstVip,
  isRechargeStatus,
  vipMonthFirstRechargeApply
} from '@/api/vip.js';
import { Toast } from 'vant';
import { toFixed2, priceToFixed } from '@/utils/index.js';
import listAnimateHook from '@/hooks/listAnimate';

export default defineComponent({
  setup() {
    /**
     * vip月首充
     */
    const clubTableList = ref([]);
    /**
     * 月首充返现弹窗状态
     */
    const cashTableDialogShow = ref(false);
    /**
     * 月首充奖励数据
     */
    const cashTableObj = ref({});
    /**
     * 获取vip月首充
     */
    const getFirstVip = async() => {
      const data = await firstVip();
      if (Number(data.code) === 1) {
        clubTableList.value = data.data;
      }
    };
    /**
     * 是否有月首充
     */
    const getRechargeStatus = () => {
      isRechargeStatus().then((res: any) => {
        if (+res.code === 1) {
          cashTableObj.value = res.data;
        }
      }).catch((err: any) => {
        cashTableObj.value = {}
      })
    };
    /**
     * 领取月首充
     */
    const receiveRechargeStatus = () => {
      cashTableDialogShow.value = true;
    };
    /**
     * 月首充返现弹窗确认按钮
     */
    const cashTableDialogConfirm = async() => {
      await vipMonthFirstRechargeApply()
        .then((res: any) => {
          if (+res.code === 1) {
            Toast.success({
              message: '领取成功',
              duration: 1500
            });
            getRechargeStatus();
          } else {
            if (+res.code === 10001) {
              Toast.fail(res.msg);
            }
          }
        })
        .catch((err: any) => {
          Toast.fail(err.msg);
        });
    };
    const { beforeEnter, paragraphEnter } = listAnimateHook();
    onMounted(() => {
      getFirstVip();
      getRechargeStatus();
    });
    return {
      clubTableList,
      cashTableObj,
      cashTableDialogShow,
      toFixed2,
      priceToFixed,
      getFirstVip,
      getRechargeStatus,
      receiveRechargeStatus,
      cashTableDialogConfirm,
      beforeEnter,
      paragraphEnter
    };
  }
});
</script>

<style lang="less" scoped>
.min-height {
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
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 34px;
    line-height: 34px;
    border-radius: 17px;
    font-size: 13px;
  }
  .enable-button {
    background-image: linear-gradient(to right, #12dedf, #07c79c);
    color: #1c2227;
  }
  .disable-button {
    background-color: #bbb;
    color: #fff;
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
  .cash-table-dialog-main {
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
