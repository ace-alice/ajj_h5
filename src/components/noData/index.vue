<template>
  <div class="no-data">
    <van-image
      width="10em"
      height="10em"
      fit="cover"
      round
      :show-loading="false"
      :src="noDataImage"
    >
      <template #error>加载失败</template>
    </van-image>
    <div>暂无数据</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const noDataImage = require('@/assets/other/no-data.webp')
    return { noDataImage }
  }
})
</script>

<style lang="less" scoped>
.no-data {
  width: 100%;
  padding: 160px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #3e4a53;
  font-weight: 500;
  font-family: PingFang-SC;
  font-size: 14px;
}
</style>
