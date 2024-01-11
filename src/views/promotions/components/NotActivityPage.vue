<template>
  <div class="no-data">
    <van-image class="no-data-image" :show-loading="false" :src="noDataImage">
      <template #error>加载失败</template>
    </van-image>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const noDataImage = require('@/assets/other/not-activity.png')
    return { noDataImage }
  }
})
</script>

<style lang="less" scoped>
.no-data {
  width: 100vw;
  position: fixed;
  top:0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #3e4a53;
  font-weight: 500;
  font-family: PingFang-SC;
  font-size: 14px;
  height: calc(100% - 40px);
  .no-data-image{
    width: 100vw;
    height: 100%;
    img{
      height: 100%;
      width: 100%;
    }
  }
}
</style>
