<template>
  <div class="vip-club-table-th">
    <van-row>
      <van-col :span="4">等级</van-col>
      <van-col :span="4">小艾竞技</van-col>
      <van-col :span="4">小艾体育</van-col>
      <van-col :span="4">AG真人</van-col>
      <van-col :span="4">平博体育</van-col>
      <van-col :span="4">沙巴体育</van-col>
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
        <van-col :span="4">{{ toFixed2(item.ia_rebate) }}%</van-col>
        <van-col :span="4">{{ toFixed2(item.xj_rebate) }}%</van-col>
        <van-col :span="4">{{ toFixed2(item.ag_rebate) }}%</van-col>
        <van-col :span="4">{{ toFixed2(item.pb_rebate) }}%</van-col>
        <van-col :span="4">{{ toFixed2(item.sb_rebate) }}%</van-col>
      </van-row>
    </transition-group>
  </div>
  <!--  <div class="vip-club-table-button" />-->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { rebateVip } from '@/api/vip.js';
import { toFixed2 } from '@/utils/index.js';
import listAnimateHook from '@/hooks/listAnimate';

export default defineComponent({
  setup() {
    /**
     * 返水列表
     */
    const clubTableList = ref([]);
    /**
     * 获取vip返水
     */
    const getRebateVip = async() => {
      const data = await rebateVip();
      if (Number(data.code) === 1) {
        clubTableList.value = data.data;
      }
    };
    const { beforeEnter, paragraphEnter } = listAnimateHook();
    onMounted(() => {
      getRebateVip();
    });
    return {
      clubTableList,
      getRebateVip,
      toFixed2,
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
