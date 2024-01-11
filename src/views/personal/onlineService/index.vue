<template>
  <div class="contact-box">
    <div class="contact-box-header">
      <van-icon name="arrow-left" @click.stop="toPath" />
      <span>24H客服</span>
      <van-icon
        :key="iframeKey"
        name="replay"
        class="rotate"
        @click.stop="refresh"
      />
    </div>
    <div class="contact-box-main">
      <iframe
        :key="iframeKey"
        height="100%"
        width="100%"
        :src="contactAllTimeUrl"
        name="24h"
        frameborder="false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { contactAllTimeUrl } from '@/api/contactUs.js'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const iframeKey = ref('24h')

    const router = useRouter()

    function toPath() {
      router.go(-1)
    }

    function refresh() {
      iframeKey.value = 'reload'
      setTimeout(() => {
        iframeKey.value = '24h'
      }, 5)
    }
    return { iframeKey, refresh, contactAllTimeUrl, toPath }
  }
})
</script>

<style lang="less" scoped>
.contact-box {
  height: 100%;
  .contact-box-header {
    height: 48px;
    width: calc(100% - 30px);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 18px;
    span {
      font-size: 14px;
      font-weight: 600;
    }
  }
  .contact-box-main {
    height: calc(100% - 48px);
    overflow: auto;
  }
  .rotate {
    animation: rotate360 2s linear;
  }
  @keyframes rotate360 {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
