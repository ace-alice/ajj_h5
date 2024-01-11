<template>
  <div class="v-information-recharge">
    <PubHeader :right-icon="false" />
    <div class="recharge-main">
      <div class="recharge-main-box">
        <div
          v-if="day_max_amount"
          class="recharge-main-box-discount"
        >
          每日最高可享优惠：{{ day_max_amount }}元
        </div>
        <GlobalLoad v-show="typeLoading" min-height="140px" />
        <div class="recharge-main-tabs">
          <div
            v-for="(item, index) in avidWalletList"
            :key="item.id"
            class="recharge-main-tabs-frame"
            @click="walletChecked(item, index)"
          >
            <div :class="walletActive === index ? 'recharge-active' : ''">
              <van-image width="28" height="28" :src="item.deposit_logo">
                <template #loading>
                  <img
                    style="width: 28px; height: 28px;"
                    :src="errorDefaultImage"
                  >
                </template>
                <template #error>
                  <img
                    style="width: 28px; height: 28px;"
                    :src="errorDefaultImage"
                  >
                </template>
              </van-image>
              <span class="van-ellipsis deposit_name">{{ item.deposit_name }}</span>
            </div>
          </div>
        </div>
        <div class="recharge-main-tab">
          <div
            v-for="(subItem, subIndex) in avidWalletList[walletActive]?.channel"
            :key="subIndex"
            @click="walletSubChecked(subItem, subIndex)"
          >
            <div class="tab-iem" :class="walletSubActive === subIndex ? 'recharge-sub-active' : ''">
              <span
                v-if="subItem.ratio"
              >加送{{ subItem.ratio }}%</span>
              {{ subItem.channel_name }}
            </div>
          </div>
        </div>
      </div>
      <div class="recharge-main-form">
        <van-form
          ref="rechargeFormRef"
          autocomplete="off"
          @submit="rechargeSubmit"
        >
          <van-cell-group inset>
            <van-field
              v-if="isBlockchain === 1"
              v-model="username"
              autocomplete="off"
              name="account_name"
              label="姓名"
              placeholder="请输入存款人姓名"
              :rules="[{ required: true, message: '请输入存款人姓名' }]"
            />
            <van-field
              v-model="price"
              type="number"
              name="amount"
              autocomplete="off"
              maxlength="12"
              :formatter="priceFormatter"
              label="充值金额"
              :placeholder="
                `单笔金额${priceToFixed(walletMinPrice)}元至${priceToFixed(walletMaxPrice)}元`
              "
              :rules="[
                {
                  required: true,
                  message: `单笔金额${priceToFixed(walletMinPrice)}元至${priceToFixed(walletMaxPrice)}元`
                }
              ]"
              @change="rechargeChangePrice"
            />
            <div v-if="isBlockchain === 2" class="recharge-usdt-tip">
              参考
              <span>1</span>
              USDT≈
              <span>{{ priceToFixed(usdtExchangeRate) }}</span>
              CNY，预计支付=
              <span>{{ rmbTransformationUsdt }}</span>
              USDT
            </div>
          </van-cell-group>
          <div class="recharge-main-form-price">
            <div
              v-for="(price, index) in walletPriceList"
              :key="index"
              @click="walletPriceChecked(price)"
            >
              {{ price }}
            </div>
          </div>
          <van-button
            :disabled="!isRechargeSubmit"
            round
            block
            type="primary"
            native-type="submit"
            :loading="rechargeLoading"
            loading-text="充值中..."
          >
            立即充值
          </van-button>
        </van-form>
      </div>
      <div class="recharge-main-footer">
        7X24小时极速到账服务，如果超过15分钟仍未到账，<br>请联系<span
          @click="toPath({ name: 'OnlineService' })"
        >在线客服</span>帮助你处理。
      </div>
    </div>
    <div class="v-recharge-header-r">
      <span
        @click="toPath({ name: 'HelpCenter', query: { accountType: 3 } })"
      >存款教程</span>
    </div>
    <div class="v-recharge-header-dialog">
      <van-dialog
        v-model:show="iosShow"
        title="充值"
        :close-on-click-overlay="true"
        :show-cancel-button="false"
        :show-confirm-button="false"
      >
        <div class="v-recharge-header-dialog-button">
          <a :href="iosUrl">前往充值</a>
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  computed, onActivated
} from 'vue';
import PubHeader from '@/components/PubHeader/index.vue'
import { depositType, doDeposit } from '@/api/recharge.js'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import defaultImageHook from '@/hooks/defaultImages'
import { dictionary } from '@/api/withdraw.js'
import { priceToFixed } from '@/utils/index.js'
import toPathHook from '@/hooks/toPath'
import { priceFormatter } from '@/utils/index.js';
import GlobalLoad from '@/components/Loading/index.vue'

export default defineComponent({
  name: 'Recharge',
  components: {
    PubHeader,
    GlobalLoad
  },
  setup() {
    const router = useRouter()
    const { errorDefaultImage } = defaultImageHook()
    /**
     * usdt汇率
     */
    const usdtExchangeRate = ref(0)
    const { toPath } = toPathHook()
    const iosShow = ref(false)
    const iosUrl = ref('')
    const state = reactive({
      /**
       * 充值方式列表
       */
      walletList: [],
      /**
       * 充值金额列表
       */
      walletPriceList: [],
      /**
       * 充值方式默认选中
       */
      walletActive: 0,
      /**
       * 虚拟币充值方式默认选中
       */
      walletUsdtActive: 1,
      /**
       * 充值方式线路默认选中
       */
      walletSubActive: 0,
      /**
       * 支付宝姓名
       */
      username: '',
      /**
       * 充值金额
       */
      price: '',
      /**
       * 渠道ID
       */
      channelId: '',
      /**
       * 最大限额
       */
      walletMaxPrice: '',
      /**
       * 最小限额
       */
      walletMinPrice: '',
      /**
       * 是否是USDT充值
       */
      isBlockchain: 0,
      /**
       * 充值loading
       */
      rechargeLoading: false,
      day_max_amount: ''
    })

    // const { proxy }: any = getCurrentInstance();

    const avidWalletList = computed(() => {
      return state.walletList.filter((list: any) => {
        return list.channel.length > 0
      })
    })

    /**
     * 充值金额改变事件
     */
    const rechargeChangePrice = () => {
      if (+state.price > +state.walletMaxPrice) {
        state.price = state.walletMaxPrice
      }
    }

    /**
     * 充值方式选中事件
     */
    const walletChecked = (row: any, index: number) => {
      state.walletActive = index
      if (row.channel[0]) {
        walletSubChecked(row.channel[0], 0)
      }
    }
    /**
     * 充值方式线路选中事件
     */
    const walletSubChecked = (subRow: any, index: number) => {
      state.walletSubActive = index
      state.channelId = subRow.id
      state.walletMaxPrice = subRow.terminal_h5_max_quota
      state.walletMinPrice = subRow.terminal_h5_min_quota
      state.isBlockchain = subRow.is_blockchain
      state.day_max_amount = subRow.day_max_amount
      state.price = ''
      getExpressAmount()
    }
    /**
     * 计算rmb换算成USDT
     */
    const rmbTransformationUsdt = computed(() => {
      if (+state.isBlockchain === 2) {
        return priceToFixed(Number(state.price) / usdtExchangeRate.value)
      } else {
        return 0
      }
    })
    /**
     * 充值金额选中事件
     */
    const walletPriceChecked = (priceRow: any) => {
      state.price = priceRow
    }

    const typeLoading = ref(false)
    /**
     * 获取充值线路
     */
    const getDepositType = async() => {
      typeLoading.value = true
      const data = await depositType({ terminal: 2 })
      if (Number(data.code) === 1) {
        state.walletList = data.data
      }
      setTimeout(() => {
        typeLoading.value = false
      }, 300)
    }
    /**
     * 获取usdt汇率
     */
    const getDictionary = async() => {
      const data = await dictionary({ primary_key: 'exchange_rate' })
      if (Number(data.code) === 1) {
        usdtExchangeRate.value = data.data.data.usdt
      }
    }
    /**
     * 获取快捷金额列表
     */
    const getExpressAmount = async() => {
      let num0 = 0
      let num1 = 0
      let num2 = 0
      let num3 = 0
      let num4 = 0
      let num5 = 0
      num0 = Math.floor(Math.max(100, +state.walletMinPrice))
      num5 = Math.floor(Math.min(50000, +state.walletMaxPrice))
      const numx = num5 - num0
      if (numx > 0) {
        const numy = numx / 5
        let numb = 10
        if (numy >= 10000) {
          numb = 100000
        }
        if (numy >= 1000) {
          numb = 10000
        }
        if (numy >= 100) {
          numb = 1000
        }
        num1 = Math.floor(Math.round(((numy + num0) / numb) * numb))
        num2 = Math.floor(Math.round(((numy * 2 + num0) / numb) * numb))
        num3 = Math.floor(Math.round(((numy * 3 + num0) / numb) * numb))
        num4 = Math.floor(Math.round(((numy * 4 + num0) / numb) * numb))
      }
      const totalPriceList: any = []
      totalPriceList.push(num0, num1, num2, num3, num4, num5)
      state.walletPriceList = totalPriceList
    }
    const isRechargeSubmit = computed(() => {
      if (state.isBlockchain === 2) {
        if (state.price) {
          return true
        } else {
          return false
        }
      } else {
        if (state.price && state.username) {
          return true
        } else {
          return false
        }
      }
    })
    const isiOS = computed(() => {
      return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    });
    /**
     * 立即充值
     */
    const rechargeSubmit = async(values: any) => {
      if (state.rechargeLoading) return
      if (+values.amount < +priceToFixed(state.walletMinPrice)) {
        return Toast.fail(`充值金额最小为${priceToFixed(state.walletMinPrice)}元`)
      }
      if (+values.amount > +priceToFixed(state.walletMaxPrice)) {
        return Toast.fail(`充值金额最大为${priceToFixed(state.walletMaxPrice)}元`)
      }
      state.rechargeLoading = true
      const pub = {
        terminal: 2,
        channel_id: state.channelId
      }
      const params = { ...pub, ...values }
      doDeposit(params).then((res: any) => {
        if (Number(res.code) === 1) {
          if (+res.data.getway === 3) {
            if (isiOS.value) {
              iosShow.value = true
              iosUrl.value = res.data.redirect_url
              // proxy.mittBus.emit('openGameBox', {
              //   gameUrl: res.data.redirect_url,
              //   headerTitle: '充值',
              //   show: true
              // });
            } else {
              window.open(res.data.redirect_url)
            }
          } else if (+res.data.getway === 2) {
            router.push({
              name: 'RechargeResult',
              query: { info: JSON.stringify(res.data.info) }
            })
          } else {
            Toast.success({ message: '充值成功' })
          }
          state.username = ''
          state.price = ''
          state.rechargeLoading = false
        }
      }).catch((err: any) => {
        Toast.fail(err.msg || err.message)
        state.rechargeLoading = false
      })
    }

    onActivated(async() => {
      await getDepositType()
      await walletChecked(state.walletList[0], 0)
      await getDictionary()
    })
    return {
      ...toRefs(state),
      errorDefaultImage,
      usdtExchangeRate,
      toPath,
      getDictionary,
      rechargeChangePrice,
      rmbTransformationUsdt,
      defaultImageHook,
      walletChecked,
      walletSubChecked,
      walletPriceChecked,
      rechargeSubmit,
      getDepositType,
      getExpressAmount,
      priceToFixed,
      isRechargeSubmit,
      priceFormatter,
      avidWalletList,
      typeLoading,
      isiOS,
      iosShow,
      iosUrl
    }
  }
})
</script>

<style lang="less" scoped>
.v-information-recharge {
  .recharge-main {
    height: calc(100% - 48px);
    margin: 48px 15px 0 15px;
    overflow: auto;

    .recharge-main-box {
      position: relative;
      padding: 5px 0 0;
      &-discount {
        font-size: 12px;
        font-weight: bold;
        color: #db541f;
        height: 30px;
      }
    }

    &-tabs {
      display: flex;
      color: #fff;
      flex-wrap: wrap;

      &-frame {
        width: 33.3%;
        height: 80px;

        & > div {
          display: flex;
          height: 70px;
          width: calc(100% - 10px);
          margin: 0 auto !important;
          flex-flow: column;
          border-radius: 8px;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #b6c1cb;
          background-color: #2d363d;

          .deposit_name {
            margin-top: 6px;
          }
        }
      }

      .recharge-active {
        position: relative;
        color: #fff;
      }

      .recharge-active::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border: 1px solid #0cd2bd;
        border-radius: 8px;
      }

      div:first-child {
        margin-left: 0;
      }

      div:last-child {
        margin-right: 0;
      }
    }

    &-tab {
      display: flex;
      width: calc(100% - 30px);
      flex-wrap: wrap;
      margin: auto;

      > div {
        display: flex;
        width: 33.3%;

        .tab-iem {
          position: relative;
          width: calc(100% - 10px);
          margin: 10px auto 0;
          height: 30px;
          border-radius: 16px;
          line-height: 30px;
          text-align: center;
          color: #b6c1cb;
          font-size: 12px;
          border: 1px solid #3e4a53;
          background-color: #3e4a53;
          span {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            width: 32px;
            height: 28px;
            line-height: 12px;
            top: -16px;
            right: -16px;
            background-image: url("../../../../assets/personal/discount-bg.png");
            background-size: 32px 28px;
            background-repeat: no-repeat;
            font-size: 9px;
            //word-break: break-all;
            word-wrap: break-word;
            white-space: pre-wrap;
            color: #fff;
          }
        }
      }

      .recharge-sub-active {
        border: 1px solid #0cd2bd !important;
      }
    }

    &-form {
      &-price {
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        padding: 20px 15px;

        div {
          display: flex;
          box-sizing: border-box;
          flex: 0 0 calc(33.33% - 10px);
          height: 30px;
          line-height: 30px;
          margin: 5px 5px;
          background-color: #3e4a53;
          border-radius: 15px;
          align-items: center;
          justify-content: center;
          color: #b6c1cb;
          font-size: 12px;
          border: 1px solid #3e4a53;
        }

        .recharge-sub-active {
          border: 1px solid #0cd2bd;
        }
      }

      .recharge-usdt-tip {
        font-family: PingFang-SC;
        font-size: 12px;
        color: #94a5b1;
        margin-top: 8px;

        span {
          color: #fff;
        }
      }

      :deep(.van-cell-group) {
        background: transparent;
      }

      :deep(.van-cell-group--inset) {
        margin: 0;
      }

      :deep(.van-cell) {
        flex-flow: column;
        background: transparent;
        padding: 0;
      }

      :deep(.van-cell::after) {
        border-bottom: 0;
      }

      :deep(.van-field__label) {
        color: #fff;
        font-size: 12px;
        margin-top: 12px;
        margin-bottom: 6px;
      }

      :deep(input::-webkit-input-placeholder) {
        color: #94a5b1;
        font-weight: 300;
        font-size: 12px;
      }

      :deep(.van-field__control) {
        height: 36px;
        color: #fff;
        font-size: 12px;
        background-color: #2d363d;
        border-radius: 8px;
        padding: 0 18px;
      }

      :deep(.van-button) {
        font-family: PingFang-SC;
        height: 40px;
        line-height: 40px;
        background-image: linear-gradient(to right, #12dedf, #07c79c);
        font-size: 14px;
        color: #1a242c;
        font-weight: bold;
      }

      :deep(.van-button--disabled) {
        color: #fff;
        background: #94a5b1;
        border-color: transparent;
        opacity: 1;
      }

      :deep(.van-button--round) {
        border-radius: 8px;
      }
    }

    &-footer {
      font-size: 12px;
      font-weight: 300;
      color: #94a5b1;
      margin-top: 20px;

      span {
        background-image: linear-gradient(to right, #12dedf, #07c79c),
        linear-gradient(to bottom, #b6c1cb, #b6c1cb);
        color: #b6c1cb;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  .v-recharge-header-r {
    z-index: 2001;
    position: fixed;
    top: 0;
    right: 0;
    height: 48px;
    line-height: 48px;
    padding: 0 20px;

    span {
      background-image: linear-gradient(to right, #12dedf, #07c79c),
      linear-gradient(to bottom, #fff, #fff);
      font-size: 12px;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .v-recharge-header-dialog {
    :deep(.van-dialog__header) {
      height: 40px;
      line-height: 40px;
      background-color: #3e4a53;
      padding: 0;
      font-size: 14px;
      color: #fff;
    }
    :deep(.van-dialog__content) {
      background-color: #2d363d;
      padding: 25px 10px 10px 10px;
      height: 60px;
      font-size: 12px;
      color: #94a5b1;
    }
    &-button {
      display: flex;
      justify-content: center;
      a {
        display: flex;
        width: 110px;
        height: 40px;
        line-height: 40px;
        justify-content: center;
        border-radius: 8px;
        background-image: linear-gradient(to right, #12dedf, #07c79c);
        font-family: PingFang-SC;
        font-size: 14px;
        color: #1a242c;
      }
    }
  }
}
</style>
