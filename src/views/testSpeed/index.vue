<template>
  <div class="v-app-download">
    <van-image class="v-app-box box-top" :src="speed_top" />

    <div class="v-app-box box-1">
      <div>
        <van-image width="80" height="80" :src="app_qr" />
      </div>
      <div>扫码下载</div>
      <div class="v-join-us">
        <div @click.stop="toPath({ name: 'ContactUs' })">联系客服</div>
        <div @click.stop="toPath({ name: 'JoinUs' })">合作加盟</div>
      </div>
      <div class="v-speed-box-con">
        <div class="v-speed-box">
          <span>线路一</span>
          <div class="v-speed-box-num" :style="{ color: setColor(speed1) }">
            {{ setCode(speed1) }}ms
          </div>
        </div>
        <div class="v-speed-box">
          <span>线路二</span>
          <div class="v-speed-box-num" :style="{ color: setColor(speed2) }">
            {{ setCode(speed2) }}ms
          </div>
        </div>
        <div class="v-speed-box">
          <span>线路三</span>
          <div class="v-speed-box-num" :style="{ color: setColor(speed3) }">
            {{ setCode(speed3) }}ms
          </div>
        </div>
        <div class="v-speed-box">
          <span>线路四</span>
          <div class="v-speed-box-num" :style="{ color: setColor(150) }">
            {{ setCode(150) }}ms
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import toPathHook from '@/hooks/toPath'
import { defineComponent, onMounted, onUnmounted, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'TsetSpeed',
  setup() {
    const speed_top = require('@/assets/other/logo-common.webp')

    const app_qr = require('@/assets/other/logo-common.webp')

    const { toPath } = toPathHook()

    let state = reactive({
      speed1: 0,
      speed2: 0,
      speed3: 0
    })

    function setColor(num: number) {
      // if (num < 100) {
      //   return '#07c160'
      // } else if (num < 300) {
      //   return '#ef6a0c'
      // } else {
      //   return '#ee0a24'
      // }
      return ''
    }

    function setCode(num: number) {
      if (num > 400) {
        return '400+'
      } else {
        return String(num)
      }
    }

    function testSpeed(url: string, keyL: string) {
      const image = new Image()
      image.src = url
      const start = new Date().getTime()
      image.onload = function() {
        const end = new Date().getTime()
        state[keyL] = end - start
      }
      image.onerror = function() {
        const end = new Date().getTime()
        state[keyL] = end - start
      }
    }

    function initSpeed() {
      testSpeed('https://www.vkgame.vip/testImage.jpg', 'speed1')
      testSpeed('https://www.vkgame.cc/testImage.jpg', 'speed2')
      testSpeed('https://www.vkgame.net/testImage.jpg', 'speed3')
    }

    let timer: any = null

    onMounted(() => {
      initSpeed()
      timer = setInterval(() => {
        initSpeed()
      }, 10000)
    })

    onUnmounted(() => {
      clearInterval(timer)
      timer = null
    })

    return {
      speed_top,
      toPath,
      app_qr,
      testSpeed,
      ...toRefs(state),
      setColor,
      setCode
    }
  }
})
</script>

<style lang="less" scoped>
.v-app-download {
  background-image: url('../../assets/other/test-speed-bg.webp');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;

  .v-app-box {
    position: absolute;
  }
  .box-top {
    height: 73px;
    width: 107px;
    top: 3%;
    left: calc(50% - 53px);
  }
  .box-1 {
    left: 10%;
    width: 80%;
    bottom: 10%;
    max-height: 60%;
    font-size: 14px;
    color: #fff;
    font-family: PingFang-SC;
    > div {
      margin: 20px auto;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: PingFang-SC;
      font-size: 14px;
    }
    .v-speed-box-con {
      flex-wrap: wrap;
      margin-top: 50px;
    }
    .v-speed-box {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      width: 45%;
      border-radius: 8px;
      border-style: solid;
      border-width: 1px;
      border: solid 1px #a4a6e9;
      background-color: #3f428e;
      margin: 30px 2%;
      cursor: pointer;
      position: relative;
      span {
        display: inline-block;
        padding: 0 15px;
      }
      .v-speed-box-num {
        position: absolute;
        width: 100%;
        top: -25px;
        text-align: center;
      }
    }
    .v-join-us {
      justify-content: space-evenly;
      font-size: 12px;
      div {
        height: 30px;
        line-height: 30px;
        padding: 0 15px;
        border-radius: 15px;
        background-color: #4c509280;
        cursor: pointer;
      }
    }
  }
}
</style>
