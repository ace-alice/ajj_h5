<template>
  <div class="v-app-download">
    <van-image class="v-app-box box-right" :src="app_right" />
    <van-image class="v-app-box box-bg" :src="app_bg" />
    <svg-icon icon-class="logo" class="v-app-box box-icon"></svg-icon>
    <div class="v-app-box box-1">
      <div>专业电竞竞猜</div>
      <div>秒存秒提 极速存取</div>
    </div>
    <div class="v-app-box box-2">
      <div>结算最权威</div>
      <div>玩法最全面</div>
      <div>资金最安全</div>
      <div>投注最便捷</div>
      <div class="box-btn">立即下载</div>
    </div>
    <div class="v-app-box box-2">
      <div>结算最权威</div>
      <div>玩法最全面</div>
      <div>资金最安全</div>
      <div>投注最便捷</div>
      <div class="box-btn">立即下载</div>
    </div>
    <van-image class="v-app-box box-app" :src="app_app" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppDownload',
  setup() {
    const app_bg = require('@/assets/other/app-down-bg.png')
    const app_app = require('@/assets/other/app-down-app.webp')
    const app_right = require('@/assets/other/1177.png')
    return { app_bg, app_app, app_right }
  }
})
</script>

<style lang="less" scoped>
.v-app-download {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;

  .v-app-box {
    position: absolute;
  }
  .box-icon {
    font-size: 100px;
    height: 40px;
    top: 2%;
    left: 6%;
  }
  .box-1 {
    left: 10%;
    top: 12%;
    font-size: 16px;
    color: #fff;
    font-family: HYYaKuHeiW;
    font-weight: 900;
    letter-spacing: 1.28px;
    text-shadow: 0px 1px 1px #00000050;
    div {
      margin: 15px 0;
    }
  }
  .box-2 {
    height: 40%;
    width: 45%;
    top: 32%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    div {
      font-family: PingFang-SC;
      color: #fff;
      font-size: 13px;
    }
    .box-btn {
      height: 40px;
      text-align: center;
      line-height: 40px;
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      border-radius: 20px;
      padding: 0 25px;
      color: #181f1f;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .box-bg {
    height: 90vw;
    width: 100vw;
    bottom: 0;
  }
  .box-app {
    height: 40%;
    bottom: 0;
    left: 50%;
    top: 32%;
  }
  .box-right {
    height: 80px;
    width: 125px;
    right: 0;
  }
}
</style>
