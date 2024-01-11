<template>
  <div
    class="pub-loading"
    :style="{
      minHeight: minHeight,
      '--align-row': alignRow,
      '--align-column': alignColumn,
      '--top': top
    }"
  >
    <div class="pub-loading-bg">
      <img :src="pubImg">
      <span>加载中...</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GlobalLoad',
  props: {
    minHeight: {
      type: String,
      default: '0px'
    },
    alignColumn: {
      type: String,
      default: 'center'
    },
    alignRow: {
      type: String,
      default: 'center'
    },
    top: {
      type: String,
      default: '0px'
    }
  },
  setup() {
    const pubImg = require('@/assets/home/pub-loading.png')
    return {
      pubImg
    }
  }
})
</script>

<style lang="less" scoped>
.pub-loading {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #1c222750;
  backdrop-filter: blur(5px);
  border-radius: 8px;
  &-bg {
    display: flex;
    flex-direction: column;
    justify-content: var(--align-row);
    align-items: var(--align-column);
    position: absolute;
    width: 100%;
    height: 100%;
    margin-top: var(--top);
    border-radius: 8px;
    img {
      width: 34px;
      height: 34px;
      animation: rotation 1s linear infinite;
    }
    span {
      margin-top: 16px;
      color: #94a5b1;
      font-size: 12px;
      font-weight: 300;
    }
  }
}
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
