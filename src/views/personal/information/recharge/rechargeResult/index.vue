<template>
  <div class="v-recharge-result">
    <PubHeader :header-title="title" :right-icon="false" />
    <div v-if="resultType === 1" class="v-recharge-result-main">
      <div class="recharge-amount">
        <span>支付时间还有</span>
        <van-count-down
          :time="rechargeCountDown"
          format="mm:ss"
        />
        <div class="recharge-amount-tip">
          成功付款后，将会自动到账，如超过15分钟仍未到账，请联系
          <span>在线客服</span>
          帮你处理。
        </div>
      </div>
      <div class="recharge-info">
        <div class="recharge-info-name">
          <span>存款金额</span>
          <span>{{ rechargeResultInfo?.amount }}</span>
        </div>
        <div class="recharge-info-name">
          <span>汇率</span>
          <span>{{ rechargeResultInfo?.exchange_price }}</span>
        </div>
        <div class="recharge-info-name">
          <span>协议类型</span>
          <span>{{ rechargeResultInfo?.currency_type }}</span>
        </div>
        <div class="recharge-info-name">
          <span>支付金额</span>
          <span>{{ rechargeResultInfo?.convert_amount }}</span>
          <svg-icon
            class="recharge-info-name-copy"
            icon-class="personal-copy"
            @click="rechargeInfoCopy(rechargeResultInfo?.exchange_price)"
          />
        </div>
        <div class="recharge-info-name">
          <span>订单号</span>
          <span>{{ rechargeResultInfo?.order_no }}</span>
          <svg-icon
            class="recharge-info-name-copy"
            icon-class="personal-copy"
            @click="rechargeInfoCopy(rechargeResultInfo?.order_no)"
          />
        </div>
        <div class="recharge-info-name">
          <span>充币地址</span>
          <span
            class="van-ellipsis"
          >
            {{ rechargeResultInfo?.protocol_address }}
          </span>
          <svg-icon
            class="recharge-info-name-copy"
            icon-class="personal-copy"
            @click="rechargeInfoCopy(rechargeResultInfo?.protocol_address)"
          />
        </div>
        <div class="recharge-info-qr">
          <div>
            <vue-qr :text="rechargeResultInfo?.protocol_address" :size="75" :margin="4" />
          </div>
          <span>充币地址二维码</span>
        </div>
      </div>
      <div class="recharge-illustrate">
        <div class="recharge-illustrate-title">温馨提示</div>
        <div class="recharge-illustrate-main">
          <div>
            1.请注意转账时要考虑到提币手续费因素，确保到账金额为
            <span>{{ rechargeResultInfo?.amount }}</span>
            ,错误金额将导致充值无法自动到账!
          </div>
          <div>
            2.请核对好数字币钱包地址:
            <span>{{ rechargeResultInfo?.protocol_address }}</span>
          </div>
          <div>
            3.请注意转账网络协议为<span>{{ rechargeResultInfo?.currency_type }}</span>,错误的协议类型将导致无法自动到账!
          </div>
          <div>
            4.请勿重复转账,每次充值都要重新发起订单获取最新收款地址!
          </div>
          <div>
            5.订单到账金额参考实时汇率,5分钟不到账请联系<span>在线客服</span>!
          </div>
        </div>
      </div>
    </div>
    <!--    <div v-if="resultType === 2" class="v-recharge-result-iframe">-->
    <!--      <iframe :src="resultUrl" />-->
    <!--    </div>-->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import PubHeader from '@/components/PubHeader/index.vue'
import useClipboard from 'vue-clipboard3'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'

export default defineComponent({
  components: {
    PubHeader,
    vueQr
  },
  setup() {
    const { toClipboard } = useClipboard()
    const router = useRouter()
    const rechargeResultInfo: any = ref()
    const rechargeCountDown = ref(30 * 60 * 1000)
    const resultType = ref(0)
    const resultUrl = ref('')
    const state = reactive({
      title: '存款信息'
    })
    /**
     * 复制功能
     */
    const rechargeInfoCopy = async(msg: any) => {
      try {
        await toClipboard(msg)
        Toast.success({
          message: '复制成功',
          duration: 1500
        })
      } catch (e) {
        // console.log(e)
        Toast.fail(e)
      }
    }
    const getRechargeInfo = () => {
      const infoVal: any = router.currentRoute.value.query.info
      // const urlVal: any = router.currentRoute.value.query.url
      if (infoVal) {
        resultType.value = 1
        rechargeResultInfo.value = JSON.parse(infoVal)
      }
      // if (urlVal) {
      //   resultType.value = 2
      //   resultUrl.value = urlVal
      // }
    }
    onMounted(async() => {
      await getRechargeInfo()
    })
    return {
      ...toRefs(state),
      rechargeCountDown,
      rechargeResultInfo,
      rechargeInfoCopy,
      getRechargeInfo,
      resultType,
      resultUrl
    }
  }
})
</script>

<style lang="less" scoped>
.v-recharge-result {
  &-main {
    margin: 48px 15px 0 15px;
    height: calc(100% - 60px);
    overflow: auto;
    .recharge-amount {
      display: flex;
      padding: 11px 10px;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 90px;
      border-radius: 8px;
      background-color: #2d363d;
      margin-bottom: 10px;
      font-size: 14px;
      color: #b6c1cb;
      :deep(.van-count-down) {
        font-size: 21px;
        color: #fff;
        line-height: 40px;
        font-weight: bold;
      }
      &-tip {
        font-size: 12px;
        color: #c3d0db;
        span {
          color: #10dad4;
        }
      }
    }
    .recharge-info {
      display: flex;
      align-items: center;
      flex-direction: column;
      border-radius: 8px;
      background-color: #2d363d;
      padding: 11px 16px;
      font-size: 12px;
      color: #becddb;
      &-name {
        display: flex;
        width: 100%;
        line-height: 30px;
        align-items: center;
        span:nth-child(1) {
          width: 78px;
        }
        span:nth-child(2) {
          flex: 1;
          color: #fff;
          font-weight: bold;
        }
        &-copy {
          width: 80px;
        }
      }
      &-qr {
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        span {
          line-height: 24px;
        }
      }
    }
    .recharge-illustrate {
      &-title {
        display: flex;
        font-size: 14px;
        color: #fff;
        line-height: 40px;
      }
      &-main {
        font-size: 11px;
        color: #becddb;
        div {
          //line-height: 20px;
        }
        span {
          color: #fff;
        }
      }
    }
  }
  &-iframe {
    width: 100%;
    margin-top: 48px;
    height: calc(100% - 48px);
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
}
</style>
