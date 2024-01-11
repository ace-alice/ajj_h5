<template>
  <div class="vip-club-table-th">
    <van-row>
      <van-col :span="4">等级</van-col>
      <van-col :span="4">晋级礼金</van-col>
      <van-col :span="4">生日礼金</van-col>
      <van-col :span="6">单日提款额度</van-col>
      <van-col :span="6">单日提款次数</van-col>
    </van-row>
  </div>
  <div class="vip-club-table-content" :class="{ 'min-height': clubTableList.length < 1 }">
    <transition-group name="more" :css="false" @before-enter="beforeEnter" @enter="paragraphEnter">
      <van-row
        v-for="(item, index) in clubTableList"
        :key="index"
        :class="index % 2 === 0 ? '' : 'interlaced-color'"
        :data-index="index + 1"
      >
        <van-col :span="4">{{ item.level_name }}</van-col>
        <van-col class="van-ellipsis" :span="4">¥{{ priceToFixed(item.upgrade) }}</van-col>
        <van-col class="van-ellipsis" :span="4">¥{{ toFixed2(item.birthday) }}</van-col>
        <van-col :span="6">¥{{ toFixed2(item.withdrawals_limit) }}</van-col>
        <van-col :span="6">{{ item.withdrawals }}</van-col>
      </van-row>
    </transition-group>
  </div>
  <!--  <div class="vip-club-table-button" />-->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { memberVip } from '@/api/vip.js';
import { toFixed2, priceToFixed } from '@/utils/index.js';
import listAnimateHook from '@/hooks/listAnimate';

export default defineComponent({
  setup() {
    /**
     * vip会员权益列表
     */
    const clubTableList = ref([]);
    /**
     * 获取vip会员权益列表
     */
    const getMemberVip = async() => {
      const data = await memberVip();
      if (Number(data.code) === 1) {
        clubTableList.value = data.data;
      }
    };
    const { beforeEnter, paragraphEnter } = listAnimateHook();
    onMounted(() => {
      getMemberVip();
    });
    return {
      clubTableList,
      toFixed2,
      priceToFixed,
      getMemberVip,
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
}
</style>
