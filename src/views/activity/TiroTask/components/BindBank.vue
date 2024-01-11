<template>
  <div class="bind-bank">
    <div>绑定银行卡奖励{{ bankInfo.amount }}元</div>
    <div v-if="isReceive === 1" class="button" @click="toPath('AddBankCard')">前往绑定</div>
    <div v-else class="button" :class="{ disabled: isReceive === 3 }" @click="toGetPrice">
      <van-loading v-show="receiveLoading" type="spinner" size="18px" />
      <span>立即领取</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue';
import webViewBridgeHook from '@/hooks/webViewBridge';
import { Toast } from 'vant';
import activityPageHook from '@/hooks/activityPage';

export default defineComponent({
  name: 'BindBank',
  props: {
    activityInfo: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    const { routeGo } = webViewBridgeHook();

    function toPath(name: string) {
      routeGo(name);
    }

    const isReceive = ref(3);

    const receiveLoading = ref(false);

    const { request, token } = activityPageHook(false);

    const bankInfo = computed(() => {
      if (props.activityInfo?.activity_template_content) {
        const temp = JSON.parse(props.activityInfo?.activity_template_content);
        if (temp.bind_card) {
          return temp.bind_card;
        } else {
          return {};
        }
      } else {
        return {};
      }
    });

    function toGetPrice() {
      if (!token.value) return;
      if (isReceive.value !== 2 || receiveLoading.value) return;
      receiveLoading.value = true;
      request
        .value({
          url: '/index/Activity/newTaskBankApply',
          method: 'get'
        })
        .then((res: any) => {
          // eslint-disable-next-line eqeqeq
          if (+res.code === 1) {
            isReceive.value = 3;
            Toast.success(`奖金领取成功！`);
          } else {
            Toast(res.msg || res.message);
          }
        })
        .finally(() => {
          receiveLoading.value = false;
        });
    }

    function getStatus() {
      if (!token.value) return (isReceive.value = 1);
      request
        .value({
          url: '/index/Activity/newTaskBankCheck',
          method: 'get'
        })
        .then((res: any) => {
          if (+res.code === 1) {
            isReceive.value = Number(res.data.status) || 1;
          } else {
            isReceive.value = 1;
            // Toast(res.msg || res.message)
          }
        })
        .catch(() => {
          isReceive.value = 1;
        });
    }

    onMounted(() => {
      nextTick(() => {
        getStatus();
      });
    });

    return { toPath, toGetPrice, isReceive, receiveLoading, bankInfo };
  }
});
</script>

<style lang="less" scoped>
.bind-bank {
  flex-shrink: 0;
  padding: 15px 0;
  margin: 10px 0;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  background-color: #2d363d;
  font-size: 13px;
  font-family: PingFang-SC, serif;
  color: #c2cdd5;
  > div {
    height: 38px;
    line-height: 38px;
    text-align: center;
  }
  .button {
    border-radius: 8px;
    background-image: linear-gradient(to right, #12dedf, #07c79c);
    color: #0f1011;
    font-weight: bold;
    font-size: 14px;
    width: 90%;
    margin: auto;
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
</style>
