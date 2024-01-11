<template>
  <div class="sign-in-package">
    <div class="step-group">
      <div v-for="(content, index) in contentLists" :key="index" class="step-box">
        <div>{{ content.label }}</div>
        <van-image
          v-if="content.icon"
          :class="{ hery: !isReceive }"
          height="30"
          width="24"
          :src="content.icon"
          @click.stop="toGetPrice"
        >
          <template #error>
            <img :src="pageHeaderDefaultImage" style="width:100%" alt="">
          </template>
          <template #loading>
            <ImageLoadBox />
          </template>
        </van-image>
        <div
          v-else
          :class="{
            'select-box': true,
            'select-active': index < step
          }"
        />
        <div class="step-price">
          <span v-show="index === contentLists.length - 1"> {{ packageInfo.amount }}元红包</span>
        </div>
      </div>
    </div>
    <div class="condition">
      每日签到条件 : 每日累计存款
      <span class="red-text">≥{{ packageInfo.low_deposit }}</span>
      元且有效投注额
      <span class="red-text">≥{{ packageInfo.low_bet }}</span>
      元
    </div>
    <div class="button" :class="{ disabled: !canReceive }" @click.stop="toReceive">
      <van-loading v-show="receiveLoading" type="spinner" size="18px" />
      <span>签到</span>
    </div>
    <van-popup v-model:show="popupShow" :close-on-click-overlay="false">
      <div class="tiro-task-popup">
        <div class="header">提示</div>
        <div class="body">
          您的今日存款{{
            packageInfo.low_deposit > statusData.total_deposit
              ? `${statusData.total_deposit},还需${packageInfo.low_deposit - statusData.total_deposit}`
              : `已达到${packageInfo.low_deposit}`
          }}，投注金额{{
            packageInfo.low_bet > statusData.total_bet
              ? `${statusData.total_bet},还需${packageInfo.low_bet - statusData.total_bet}`
              : `已达到${packageInfo.low_deposit}`
          }}
          ，即可签到成功
        </div>
        <div class="footer">
          <div @click.stop="popupShow = false">再逛逛</div>
          <div @click.stop="toPath('Home')">去投注</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import defaultImages from '@/hooks/defaultImages';
import { computed, defineComponent, nextTick, onMounted, reactive, ref } from 'vue';
import webViewBridgeHook from '@/hooks/webViewBridge';
import activityPageHook from '@/hooks/activityPage';
import { Toast } from 'vant';
import ImageLoadBox from '@/components/ImageLoadBox/index.vue';

export default defineComponent({
  name: 'SignInPackage',
  components: { ImageLoadBox },
  props: {
    activityInfo: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    const { pageHeaderDefaultImage } = defaultImages();

    const popupShow = ref(false);

    const { routeGo } = webViewBridgeHook();

    function toPath(name: string) {
      routeGo(name);
    }

    const packageInfo = computed(() => {
      if (props.activityInfo?.activity_template_content) {
        const temp = JSON.parse(props.activityInfo?.activity_template_content);
        if (temp.sign) {
          return temp.sign;
        } else {
          return {};
        }
      } else {
        return {};
      }
    });

    const contentLists = computed(() => {
      const result: any[] = [];
      if (packageInfo.value) {
        if (packageInfo.value.full_day) {
          for (let i = 1; i < packageInfo.value.full_day; i++) {
            result.push({ label: `第${i}天` });
          }
          result.push({
            label: `第${packageInfo.value.full_day}天`,
            icon: require('@/assets/other/red-page.png'),
            price: packageInfo.value.amount + '元红包'
          });
        }
      }
      return result;
    });

    const { token, request } = activityPageHook(false);

    const canReceive = ref(false);

    const receiveLoading = ref(false);

    const step = ref(0);

    const isReceive = ref(false);

    const statusData: any = reactive({});

    function openPopup(data: any) {
      if (
        (packageInfo.value.low_deposit > data.total_deposit || packageInfo.value.low_bet > data.total_bet) &&
        !data.is_received
      ) {
        popupShow.value = true;
      }
    }

    function getStatus() {
      if (!token.value) return (isReceive.value = false);
      request
        .value({
          url: '/index/Activity/newTaskSignCheck',
          method: 'get'
        })
        .then((res: any) => {
          if (+res.code === 1) {
            canReceive.value = Boolean(Number(res.data.sign_status) || 0);
            isReceive.value = Boolean(Number(res.data.is_full) || 0) && !Number(res.data.is_received);
            step.value = res.data.day;
            Object.assign(statusData, res.data);
            openPopup(statusData);
          } else {
            isReceive.value = false;
            canReceive.value = false;
            popupShow.value = true;
            Toast(res.msg || res.message);
          }
        })
        .catch(() => {
          isReceive.value = false;
          canReceive.value = false;
        });
    }

    function toGetPrice() {
      if (!token.value) return;
      if (isReceive.value !== true || receiveLoading.value) return;
      receiveLoading.value = true;
      request
        .value({
          url: '/index/Activity/newTaskSignAwardReceive',
          method: 'get'
        })
        .then((res: any) => {
          // eslint-disable-next-line eqeqeq
          if (+res.code === 1) {
            isReceive.value = false;
            Toast.success(`奖金领取成功！`);
          } else {
            Toast(res.msg || res.message);
          }
        })
        .finally(() => {
          receiveLoading.value = false;
        });
    }

    function toReceive() {
      if (!token.value) return;
      if (canReceive.value !== true || receiveLoading.value) return;
      receiveLoading.value = true;
      request
        .value({
          url: '/index/Activity/newTaskSign',
          method: 'get'
        })
        .then((res: any) => {
          // eslint-disable-next-line eqeqeq
          if (+res.code === 1) {
            canReceive.value = false;
            getStatus();
            Toast.success(`签到成功！`);
          } else {
            Toast(res.msg || res.message);
          }
        })
        .finally(() => {
          receiveLoading.value = false;
        });
    }

    onMounted(() => {
      nextTick(() => {
        getStatus();
      });
    });

    return {
      step,
      contentLists,
      pageHeaderDefaultImage,
      popupShow,
      toPath,
      packageInfo,
      isReceive,
      receiveLoading,
      canReceive,
      toGetPrice,
      toReceive,
      statusData
    };
  }
});
</script>

<style lang="less" scoped>
.sign-in-package {
  flex-shrink: 0;
  padding: 20px 0 0;
  .step-group {
    position: relative;
    display: flex;
    justify-content: space-around;
    &::after {
      position: absolute;
      content: '';
      height: 3px;
      border-radius: 1.5px;
      background-color: #3e4a53;
      width: 100%;
      top: calc(50% - 3px);
      z-index: 10;
    }
  }
  .step-box {
    font-size: 13px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    height: 100px;
    z-index: 20;
    max-width: 40px;
    .select-box {
      height: 20px;
      width: 20px;
      border-radius: 11px;
      background-color: #3e4a53;
      border: solid 1px #0fd7cb;
    }
    .step-price {
      height: 20px;
      font-size: 12px;
      line-height: 20px;
      white-space: nowrap;
      text-align: center;
      color: #ff9f07;
    }
    .select-active {
      position: relative;
      background-color: #0fd7cb;
      &::after {
        position: absolute;
        content: '\2714';
        height: 22px;
        width: 20px;
        text-align: center;
        line-height: 22px;
      }
    }
  }
  .condition {
    font-family: PingFang-SC, serif;
    font-size: 13px;
    color: #fff;
    margin: 15px;
    .red-text {
      color: #ff9f07;
    }
  }
  .button {
    height: 38px;
    line-height: 38px;
    text-align: center;
    border-radius: 8px;
    background-image: linear-gradient(to right, #12dedf, #07c79c);
    color: #0f1011;
    font-weight: bold;
    font-size: 14px;
    margin: 10px auto 0;
    cursor: pointer;
    display: flex;
    justify-content: center;
  }
  .disabled {
    background: #808080 !important;
    color: #fff;
    cursor: not-allowed;
  }
}
:deep(.van-popup) {
  background: none;
}
.tiro-task-popup {
  width: 65vw;
  max-width: 500px;
  background: #2d363d;
  border-radius: 8px;
  overflow: hidden;
  font-size: 14px;
  .header {
    height: 40px;
    line-height: 40px;
    color: #fff;
    text-align: center;
    background-color: #3e4a53;
  }
  .body {
    padding: 30px 20px;
    color: #94a5b1;
    font-size: 12px;
  }
  .footer {
    display: flex;
    cursor: pointer;
    div {
      width: 50%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #94a5b1;
      background-color: #3e4a53;

      &:nth-child(2) {
        background-image: linear-gradient(to right, #12dedf, #07c79c);
        color: #1a242c;
      }
    }
  }
}
.hery {
  -webkit-filter: grayscale(80%);
  -moz-filter: grayscale(80%);
  -ms-filter: grayscale(80%);
  -o-filter: grayscale(80%);
  filter: grayscale(80%);
  filter: gray;
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
}
</style>
