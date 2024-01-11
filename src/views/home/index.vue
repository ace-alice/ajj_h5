<template>
  <div class="v-home">
    <van-popup v-model:show="appDownShow" :lock-scroll="false" :overlay="false" position="top">
      <div class="v-home-down">
        <div class="v-home-down-title">更多精彩游戏,请安装app</div>
        <div class="v-home-down-icon">
          <span @click="appDown">立即下载</span>
          <span @click="appDownShow = false">
            <img :src="appDownClose" />
          </span>
        </div>
      </div>
    </van-popup>
    <Header :hasBack="true" />
    <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
      <div class="v-home-main">
        <Banner />
        <Notify />
        <Personal />
        <Games />
        <Tabs />
      </div>
      <div class="v-home-dialog">
        <van-dialog
          v-model:show="vipShow"
          :class="dialogContentInfo.type === 2 ? 'v-home-dialog-promotion' : 'v-home-dialog-birthday'"
          :show-confirm-button="false"
        >
          <img
            :class="dialogContentInfo.type === 2 ? 'v-home-dialog-promotion-title' : 'v-home-dialog-birthday-title'"
            :src="
              dialogContentInfo.type === 2
                ? require('@/assets/home/promotion-dialog-title.png')
                : require('@/assets/home/birthday-dialog-title.png')
            "
            alt=""
            srcset=""
          />
          <img
            :class="dialogContentInfo.type === 2 ? 'v-home-dialog-promotion-img' : 'v-home-dialog-birthday-img'"
            :src="
              dialogContentInfo.type === 2
                ? require('@/assets/home/promotion-dialog-bg.png')
                : require('@/assets/home/birthday-dialog-bg.png')
            "
            alt=""
            srcset=""
          />
          <!-- <div class="v-home-dialog-header">亲爱的{{ userInfo.nickname }}</div> -->
          <div class="v-home-dialog-footer">
            <div class="v-home-dialog-footer-1" v-if="dialogContentInfo.type !== 2">生日快乐！</div>
            <div class="v-home-dialog-footer-2">{{ dialogContentInfo.content }}</div>
            <div class="v-home-dialog-footer-3">
              <span @click="getItNow">立即领取</span>
            </div>
          </div>
          <div class="v-home-dialog-x">
            <img :src="promotionDialogX" @click="promotionDialogClose" />
          </div>
        </van-dialog>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, computed, getCurrentInstance, Ref, onUnmounted } from 'vue';
import Header from './components/Header/index.vue';
import Banner from './components/Banner/index.vue';
import Notify from './components/Notify/index.vue';
import Personal from './components/Personal/index.vue';
import Games from './components/Games/index.vue';
import Tabs from './components/Tabs/index.vue';
import { userAlert } from '@/api/message.js';
import store from '@/store/index.js';
import request from '@/utils/request.js';
import { Toast } from 'vant';
import GameBox from '@/components/gameBox/index.vue';
import createRequestFun from '@/utils/createRequest';
import { getToken } from '@/utils/index.js';

export default {
  name: 'Home',
  components: {
    Header,
    Banner,
    Notify,
    Personal,
    Games,
    Tabs,
    GameBox
  },
  setup() {
    const vipShow = ref(false);
    const promotionDialogX = require('@/assets/home/promotion-dialog-x.png');
    const userInfo = computed(() => store.getters.getUserInfo);
    const dialogContentInfo: Ref<any> = ref({});
    /**
     * app下载悬浮条
     */
    const appDownShow = ref(true);
    /**
     * app下载悬浮条关闭图片
     */
    const appDownClose = require('@/assets/home/app-down-x.png');
    const getUserAlert = async () => {
      const data = await userAlert();
      if (Number(data.code) === 1) {
        if (data.data.type === 1 || data.data.type === 2) {
          vipShow.value = true;
          dialogContentInfo.value = data.data;
        }
      }
    };
    const promotionDialogClose = () => {
      vipShow.value = false;
    };
    const getItNow = async () => {
      createRequestFun(
        '2',
        getToken()
      )({ url: dialogContentInfo.value.url, method: 'post' }).then((res: any) => {
        if (+res.code === 1) {
          Toast.success('领取成功');
          vipShow.value = false;
        } else {
          Toast.fail(res.msg);
          vipShow.value = false;
        }
      });
    };

    const { proxy } = getCurrentInstance() as any;

    const refreshLoading = ref(false);

    const appDown = () => {
      const androidUrl = 'xaih5awake://';
      const androidDown = 'https://file.aijj.vip/storage/file/android1.apk';
      const iosUrl = 'iagames://';
      const iosDownUrl =
        'itms-services:///?action=download-manifest&url=https://file.aijj.vip/storage/file/manifest.plist';
      // const iosDownUrl = 'https://aijj.com/#/download-page'
      const isAndroid = /(Android)/i.test(navigator.userAgent);
      const isiOS = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
      if (isAndroid) {
        let clickTime = new Date().getTime();
        window.location.href = androidUrl;
        let count = 0;
        let intHandle: any = null;
        intHandle = setInterval(() => {
          count++;
          let eTime = new Date().getTime() - clickTime;
          if (count >= 100 || eTime > 5000) {
            clearInterval(intHandle);
            if (document.hidden) {
              window.location.href = androidUrl;
              window.close();
            } else {
              window.location.href = androidDown;
            }
          }
        }, 20);
      }
      if (isiOS) {
        // window.location.href = iosUrl
        let clickTime = new Date().getTime();
        window.location.href = iosUrl;
        let count = 0;
        let intHandle: any = null;
        intHandle = setInterval(() => {
          count++;
          let eTime = new Date().getTime() - clickTime;
          if (count >= 100 || eTime > 5000) {
            clearInterval(intHandle);
            if (document.hidden) {
              window.location.href = iosUrl;
              window.close();
            } else {
              window.location.href = iosDownUrl;
            }
          }
        }, 20);
      }
    };

    function onRefresh() {
      proxy.mittBus.emit('getHotGame');
      proxy.mittBus.emit('allGameEntrance');
      proxy.mittBus.emit('getUserInfo');
      setTimeout(() => {
        refreshLoading.value = false;
      }, 500);
    }

    onMounted(() => {
      if (userInfo.value.id) {
        getUserAlert();
      }
    });

    onUnmounted(() => {
      proxy.mittBus.off('openGameBox');
    });

    return {
      vipShow,
      promotionDialogX,
      userInfo,
      dialogContentInfo,
      appDownShow,
      appDownClose,
      getUserAlert,
      promotionDialogClose,
      getItNow,
      onRefresh,
      refreshLoading,
      appDown
    };
  }
};
</script>

<style lang="less" scoped>
:deep(.van-popup) {
  background: #1c2227;
}
.v-home {
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100%;
  overflow: auto;
  &-down {
    display: flex;
    padding: 0 15px;
    height: 44px;
    line-height: 44px;
    font-size: 13px;
    justify-content: space-between;
    background-color: #2d363d;
    font-family: PingFang-SC;
    font-weight: 500;
    &-title {
      display: flex;
      color: #fff;
    }
    &-icon {
      display: flex;
      align-items: center;
      span:nth-child(1) {
        display: flex;
        justify-content: center;
        width: 86px;
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        color: #3a3939;
        font-family: PingFang-SC;
        font-weight: 500;
        margin-right: 20px;
        background-image: linear-gradient(to right, #12dedf, #07c79c);
      }
      span:nth-child(2) {
        display: flex;
        justify-content: center;
        width: 20px;
        height: 20px;
        line-height: 20px;
        color: #fff;
      }
    }
  }
  &-main {
    height: calc(100% - 48px);
    width: 100%;
    margin-top: 48px;
    overflow-y: auto;
  }
  .v-space {
    height: 20vh;
  }
  &-dialog {
    position: relative;
    :deep(.van-dialog) {
      width: 260px;
      height: 350px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      overflow: visible;
    }
    :deep(&-promotion) {
      // background-image: url('../../assets/home/promotion-dialog-bg.png');
    }
    :deep(&-birthday) {
      // background-image: url('../../assets/home/birthday-dialog-bg.png');
    }
    .v-home-dialog-birthday-img {
      width: 226.5px;
      height: 140px;
      margin: 0 auto;
      display: block;
    }
    .v-home-dialog-promotion-img {
      width: 223px;
      height: 138px;
      margin: 0 auto;
      display: block;
    }
    .v-home-dialog-promotion-title, .v-home-dialog-birthday-title {
      margin: 35px auto 20px;
      width: 209px;
      height: 20.5px;
      display: block;
    }
    &-header {
      position: absolute;
      top: 22px;
      left: 11px;
      font-size: 12px;
      color: #fff;
    }
    &-footer {
      display: flex;
      width: 100%;
      flex-direction: column;
      position: absolute;
      bottom: 12px;
      left: 0;
      text-align: center;
      div.v-home-dialog-footer-1 {
        font-size: 13px;
        color: #fff;
        line-height: 28px;
      }
      div.v-home-dialog-footer-2 {
        font-size: 15px;
        color: #fff;
        line-height: 32px;
      }
      div.v-home-dialog-footer-3 {
        display: flex;
        justify-content: center;
        margin-top: 10px;
        span {
          width: 110px;
          height: 36px;
          line-height: 36px;
          border-radius: 18px;
          color: #11100e;
          font-size: 15px;
          background-image: linear-gradient(to right, #12dedf, #07c79c);
        }
      }
    }
    &-x {
      display: flex;
      width: 100%;
      justify-content: center;
      position: absolute;
      bottom: -40px;
      left: 0;
      img {
        width: 25px;
        height: 25px;
      }
    }
  }
}
</style>
