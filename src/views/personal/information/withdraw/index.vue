<template>
  <div class="v-information-withdraw">
    <PubHeader :right-icon="false" :path="backPath" />
    <div class="withdraw-main">
      <van-tabs
        v-model:active="withdrawalTypeActive"
        @click-tab="withdrawClickTab"
      >
        <van-tab title="银行卡取款" />
        <van-tab title="USDT取款" />
      </van-tabs>
      <div class="wallet-information">
        <div class="wallet-information-title">
          <span>钱包信息</span>
        </div>
        <WalletInfo />
        <div
          v-if="withdrawalTypeActive === 0"
          class="wallet-information-card"
          :class="bankCardList.length > 0 ? 'wallet-information-bank' : ''"
        >
          <div v-if="bankCardList[bankCardActive]?.bank_status === 2" class="maintain">
            维护中
          </div>
          <div
            v-if="bankCardList.length > 0"
            class="wallet-information-card-info"
          >
            <div class="wallet-information-card-info-have">
              <img :src="bankCardList[bankCardActive].bank_logo || bankDefaultImage">
              <span class="bank-card-title">{{
                bankCardList[bankCardActive].bank_name
              }}</span>
            </div>
            <div class="wallet-information-card-info-button" :class="bankCardList[bankCardActive]?.bank_status === 2 ? 'maintain-button' : ''">
              <span @click="changeBankCard">更换</span>
            </div>
          </div>
          <div
            v-if="Object.keys(bankCardList).length === 0"
            class="wallet-information-card-add"
            @click="goPath('AddBankCard')"
          >
            <span>
              <van-icon name="add-o" />
            </span>
            <span>请添加银行卡</span>
          </div>
          <div
            v-if="bankCardList.length > 0"
            class="wallet-information-card-number"
          >
            <span>{{
              dealWithCardNumber(bankCardList[bankCardActive].bank_account)
            }}</span>
          </div>
        </div>
        <div
          v-if="withdrawalTypeActive === 1"
          class="wallet-information-card"
          :class="usdtCardList.length > 0 ? 'wallet-information-usdt' : ''"
        >
          <div
            v-if="usdtCardList.length > 0"
            class="wallet-information-card-info"
          >
            <div class="wallet-information-card-info-have">
              <img :src="USDTDefaultImage">
              <span class="bank-card-title">{{
                usdtCardList[usdtCardActive].protocol
              }}</span>
            </div>
            <div class="wallet-information-card-info-button">
              <span
                v-if="usdtCardList.length > 0"
                @click="changeUsdtCard"
              >更换</span>
            </div>
          </div>
          <div
            v-if="Object.keys(usdtCardList).length === 0"
            class="wallet-information-card-add"
            @click="goPath('AddUsdtCard')"
          >
            <span>
              <van-icon name="add-o" />
            </span>
            <span>请添加虚拟币地址</span>
          </div>
          <div
            v-if="usdtCardList.length > 0"
            class="wallet-information-card-number"
          >
            <span>{{
              dealWithCardNumber(
                usdtCardList[usdtCardActive].protocol_address
              )
            }}</span>
          </div>
        </div>
        <p v-if="withdrawalTypeActive === 1" class="bankcard-tip">使用虚拟币提款需至少绑定一张银行卡</p>
      </div>

      <div class="withdraw-main-form">
        <van-form autocomplete="off" @submit="doWithdrawClick">
          <div class="withdraw-main-form-text">取款金额</div>
          <van-field
            v-model="withdrawalAmount"
            class="withdrawal-amount"
            :disabled="+flowingWater > 0"
            type="number"
            autocomplete="off"
            maxlength="12"
            :formatter="priceFormatter"
            name="withdrawalAmount"
            :placeholder="
              +flowingWater <= 0 ? `单笔金额${priceToFixed(minAmount)}元至${priceToFixed(
                maxAmount
              )}元` : `无法提款，流水还需¥${priceToFixed(flowingWater)}元`
            "
            @change="withdrawChangePrice"
          >
            <template #left-icon>
              <svg-icon
                class="personal-withdraw-bank"
                :icon-class="+flowingWater > 0 ? 'agent-gold' : 'withdraw-price'"
              />
            </template>
            <template #right-icon>
              <div v-if="+flowingWater <= 0" class="withdraw-right-icon-text" @click.stop="allAmountWithdraw">
                全部
              </div>
            </template>
          </van-field>
          <div class="withdraw-main-form-tip">
            <div v-show="withdrawalTypeActive === 1">
              参考汇率
              <span>1</span>
              USDT≈
              <span>{{ priceToFixed(exchangeRate) }}</span>
              CNY，预计到账
              <span>{{ priceToFixed(withdrawalAmount / exchangeRate) }}</span>
              USDT
            </div>
            <!--            <div v-if="+flowingWater > 0" class="withdraw-flow">-->
            <!--              取款流水还需:-->
            <!--              <span>¥{{ priceToFixed(flowingWater) }}</span>-->
            <!--            </div>-->
            <div>
              今日可用取款次数
              <span>{{ frequency }}</span>
              次，今日可用取款额度
              <span>{{ priceToFixed(availableQuota) }}</span>
            </div>
          </div>
          <div class="withdraw-main-form-text">验证码</div>
          <div class="withdraw-main-form-code-tip">
            请输入发送至手机尾号{{ phoneHandling(userInfo.phone) }}的验证码
          </div>
          <van-field
            v-model="verificationCode"
            autocomplete="off"
            name="verificationCode"
            maxlength="6"
            type="number"
            placeholder="请输入验证码"
          >
            <template #right-icon>
              <div
                v-if="!countDown"
                class="withdraw-right-icon-code"
                @click="getPhoneCaptcha"
              >
                发送验证码
              </div>
              <div v-else class="withdraw-right-icon-code">
                {{ countDown }}s后重新发送
              </div>
            </template>
          </van-field>
          <div class="withdraw-main-form-text">交易密码</div>
          <van-field
            v-model="transactionPassword"
            :disabled="+userInfo.funds_password === 0"
            type="password"
            autocomplete="off"
            maxlength="20"
            name="transactionPassword"
            :placeholder="`请${+userInfo.funds_password === 0 ? '设置' : '输入'}交易密码`"
            @click="goPath('TransactionPassword')"
          >
            <template #left-icon>
              <svg-icon
                class="personal-withdraw-bank"
                icon-class="withdraw-lock"
              />
            </template>
            <template #right-icon>
              <svg-icon
                v-if="+userInfo.funds_password === 0"
                class="personal-withdraw-right"
                icon-class="personal-withdraw-right"
              />
            </template>
          </van-field>
          <van-button
            :disabled="!isWithdrawSubmit"
            round
            block
            type="primary"
            native-type="submit"
            :loading="withdrawLoading"
            loading-text="取款中..."
          >
            立即取款
          </van-button>
          <div class="withdraw-main-form-help">
            如需帮助，请联系
            <span @click="goPath('OnlineService')">在线客服</span>
          </div>
        </van-form>
      </div>
    </div>
    <van-popup v-model:show="bankCardShowPicker" position="bottom">
      <div class="v-withdraw-popup-header">
        <span @click="bankCardShowPicker = false">取消</span>
        <span>选择银行卡</span>
        <span />
      </div>
      <van-radio-group v-model="bankCardActive">
        <van-cell-group inset>
          <van-cell
            v-for="(item, index) in bankCardList"
            :key="index"
            clickable
            @click.stop="bankCardClick(index)"
          >
            <template #title>
              <span>{{ `${item?.bank_name}（${bankCard4(item?.bank_account)}）` }}</span>
              <span v-if="item.bank_status === 2" class="radio-maintain">维护中</span>
            </template>
            <template #icon>
              <!--              <img class="van-cell-image" :src="item.bank_logo || bankDefaultImage">-->
              <van-image
                height="20"
                width="20"
                style="margin-right:10px"
                :src="item.bank_logo"
              >
                <template #error>
                  <img :src="bankDefaultImage" style="width:20px" alt="">
                </template>
                <template #loading>
                  <img :src="bankDefaultImage" style="width:20px" alt="">
                </template>
              </van-image>
            </template>
            <template #right-icon>
              <van-radio :class="item.id == bankCardActive ? 'van-radio__icon--checked' : ''" :name="index" />
            </template>
          </van-cell>
          <van-cell
            v-if="bankCardList.length < 5"
            class="withdraw-add-icon"
            title="请添加银行卡账户"
            @click="goPath('AddBankCard')"
          >
            <template #icon>
              <van-icon name="add-o" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
    <van-popup v-model:show="usdtCardShowPicker" position="bottom">
      <div class="v-withdraw-popup-header">
        <span @click="usdtCardShowPicker = false">取消</span>
        <span>选择虚拟币</span>
        <span />
      </div>
      <van-radio-group v-model="usdtCardActive">
        <van-cell-group inset>
          <van-cell
            v-for="(item, index) in usdtCardList"
            :key="index"
            :title="`${item?.protocol}（${bankCard4(item?.protocol_address)}）`"
            clickable
            @click.stop="usdtCardClick(index)"
          >
            <template #icon>
              <img class="van-cell-image" :src="USDTDefaultImage">
            </template>
            <template #right-icon>
              <van-radio :class="item.id == usdtCardActive ? 'van-radio__icon--checked' : ''" :name="index" />
            </template>
          </van-cell>
          <van-cell
            v-if="usdtCardList.length < 5"
            class="withdraw-add-icon"
            title="请添加虚拟币账户"
            @click="goPath('AddUsdtCard')"
          >
            <template #icon>
              <van-icon name="add-o" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
    <div class="v-withdraw-header-r">
      <span
        @click="toPath({ name: 'HelpCenter', query: { accountType: 2 } })"
      >取款教程</span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  onMounted,
  onUnmounted,
  computed
} from 'vue'
import PubHeader from '@/components/PubHeader/index.vue'
import WalletInfo from './components/walletInfo/index.vue'
import {
  dictionary,
  todayWithdrawTime,
  phoneCaptcha,
  doWithdraw,
  lackBetAmount
} from '@/api/withdraw.js'
import { useRouter, useRoute } from 'vue-router'
import { getBankList, getUsdtList } from '@/api/accountReceivable.js'
import { Toast } from 'vant'
import defaultImages from '@/hooks/defaultImages'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import { priceToFixed } from '@/utils/index.js'
import toPathHook from '@/hooks/toPath'
import { priceFormatter, phoneHandling } from '@/utils/index.js';
import store from '@/store/index.js'

export default defineComponent({
  components: {
    PubHeader,
    WalletInfo
  },
  setup() {
    /**
     * 获取挂载在全局的属性和获取上下文
     */
    const { proxy } = useCurrentInstance()
    const { toPath } = toPathHook()
    const textTipImage = require('@/assets/bank/text-tip.png')
    const router = useRouter()
    const route = useRoute()
    const userInfo = computed(() => store.getters.getUserInfo)
    /**
     * 取款类型默认
     */
    const withdrawalTypeActive = ref(0)
    /**
     * 交易密码
     */
    const transactionPassword = ref('')
    /**
     * 验证码
     */
    const verificationCode = ref('')
    /**
     * 取款金额
     */
    const withdrawalAmount = ref('')
    /**
     * 最小金额
     */
    const minAmount = ref(0)
    /**
     * 最大金额
     */
    const maxAmount = ref(0)
    const bankMinAmount = ref(0)
    const bankMaxAmount = ref(0)
    const usdtMinAmount = ref(0)
    const usdtMaxAmount = ref(0)
    /**
     * 取款次数
     */
    const frequency = ref(0)
    /**
     * 可用取款额度
     */
    const availableQuota = ref(0)
    const walletVal = ref(0)
    const exchangeRate = ref(0)
    /**
     * 银行卡号
     */
    const bankCardNumber = ref(9247365812453698)
    /**
     * 银行卡列表弹窗
     */
    const bankCardShowPicker = ref(false)
    const usdtCardShowPicker = ref(false)
    /**
     * 银行列表默认
     */
    const bankCardActive = ref(0)
    const usdtCardList = ref([])
    const usdtCardActive = ref(0)
    const tipShowPopover = ref(false)
    /**
     * 银行列表数据
     */
    const bankCardList = ref([])
    const countDown = ref(0)
    /**
     * 所需流水
     */
    const flowingWater = ref('')
    const { bankDefaultImage, USDTDefaultImage } = defaultImages()
    const withdrawLoading = ref(false)
    const state = reactive({
      bank: '',
      price: ''
    })
    const onConfirm = (value: any) => {
      state.bank = value.text
    }
    /**
     * 处理银行卡号
     * @param row
     */
    const dealWithCardNumber = (row: string | number) => {
      const str = String(row)
      const str1 = str.substring(0, 4)
      const str2 = str.substring(str.length - 4, str.length)
      return str1 + ' **** **** ' + str2
    }
    /**
     * 取银行卡后四位
     */
    const bankCard4 = (row: string | number) => {
      let str = String(row)
      str = str.substring(str.length - 4, str.length)
      return str
    }
    const backPath = computed(() => {
      if (route.query.home) {
        return 'Home'
      } else if (route.query.personal) {
        return 'Personal'
      } else if (route.query.wallet) {
        return 'Wallet'
      } else {
        return ''
      }
    })
    /**
     * 选择银行卡
     */
    const bankCardClick = (id: number) => {
      bankCardActive.value = id
    }
    /**
     * 选择虚拟币
     */
    const usdtCardClick = (id: number) => {
      usdtCardActive.value = id
    }
    /**
     * 更换银行卡
     */
    const changeBankCard = () => {
      bankCardShowPicker.value = true
    }
    /**
     * 更换虚拟币
     */
    const changeUsdtCard = () => {
      usdtCardShowPicker.value = true
    }
    /**
     * 获取限额
     */
    const getDictionary = async() => {
      const data = await dictionary({ primary_key: 'withdraw_limit' })
      if (Number(data.code) === 1) {
        bankMinAmount.value = data.data.data.minimum_limit
        bankMaxAmount.value = data.data.data.maximum_limit
      }
      const uAmount = await dictionary({ primary_key: 'usdt_withdraw_limit' })
      if (+uAmount.code === 1) {
        usdtMinAmount.value = uAmount.data.data.minimum_limit
        usdtMaxAmount.value = uAmount.data.data.maximum_limit
      }
      const uData = await dictionary({ primary_key: 'exchange_rate' })
      if (Number(uData.code) === 1) {
        exchangeRate.value = uData.data.data.usdt
      }
    }
    /**
     * 获取提现信息
     */
    const getTodayWithdrawTime = async() => {
      const data = await todayWithdrawTime()
      if (Number(data.code) === 1) {
        // console.log(data.data)
        frequency.value = data.data.withdrawals
        availableQuota.value = data.data.withdrawals_limit
      }
    }
    /**
     * 获取银行卡列表
     */
    const getBankInfo = async() => {
      const data = await getBankList()
      if (Number(data.code) === 1) {
        bankCardList.value = data.data
        minAmount.value = bankMinAmount.value
        maxAmount.value = bankMaxAmount.value
      }
    }
    /**
     * 获取流水
     */
    const getLackBetAmount = async() => {
      const data = await lackBetAmount()
      if (Number(data.code) === 1) {
        flowingWater.value = data.data.unfinished_flow
      }
    }
    /**
     * 获取USDT列表
     */
    const getUsdtInfo = async() => {
      const data = await getUsdtList()
      if (Number(data.code) === 1) {
        usdtCardList.value = data.data
        minAmount.value = usdtMinAmount.value
        maxAmount.value = usdtMaxAmount.value
      }
    }
    const withdrawClickTab = () => {
      if (withdrawalTypeActive.value === 0) {
        getBankInfo()
      } else {
        getUsdtInfo()
      }
    }
    /**
     * 全部金额取款
     */
    const allAmountWithdraw = () => {
      if (+flowingWater.value > 0) return
      const strVal: any = Number(flowingWater.value) > 0 ? 0 : walletVal
      withdrawalAmount.value = strVal
    }
    /**
     * 去款金额改变事件
     */
    const withdrawChangePrice = () => {
      if (+withdrawalAmount.value > +maxAmount.value) {
        withdrawalAmount.value = maxAmount.value + ''
      }
    }
    /**
     * 获取验证码
     */
    let timer: any = null
    const getPhoneCaptcha = () => {
      phoneCaptcha().then((res: any) => {
        if (+res.code === 1) {
          if (Number(res.code) === 1) {
            countDown.value = 60
            timer = setInterval(() => {
              countDown.value--
              if (Number(countDown.value) === 0) {
                clearInterval(timer)
                timer = null
              }
            }, 1000)
          }
        }
      }).catch((err: any) => {
        Toast.fail(err.msg || err.message)
      })
    }
    const isWithdrawSubmit = computed(() => {
      if (withdrawalTypeActive.value === 0) {
        if (
          bankCardList.value.length > 0 &&
          verificationCode.value &&
          transactionPassword.value &&
          withdrawalAmount.value
        ) {
          return true
        } else {
          return false
        }
      } else {
        if (
          usdtCardList.value.length > 0 &&
          verificationCode.value &&
          transactionPassword.value &&
          withdrawalAmount.value
        ) {
          return true
        } else {
          return false
        }
      }
    })
    const goPath = (row: any) => {
      if (row === 'TransactionPassword' && +userInfo.value.funds_password !== 0) return
      router.push({ name: row, query: { fromWithDraw: 1 }})
    }
    /**
     * 取款
     */
    const doWithdrawClick = async() => {
      if (withdrawLoading.value) return
      const bankArr: any = bankCardList.value
      const usdtArr: any = usdtCardList.value
      const bankActiveId: any = bankCardList.value[bankCardActive.value]
      const usdtActiveId: any = usdtCardList.value[usdtCardActive.value]
      if (bankArr.length === 0) {
        Toast.fail('请先绑定银行卡')
        router.push({ path: '/addBankCard', query: { fromWithDraw: 1 }})
        return
      }
      if (usdtArr.length === 0 && withdrawalTypeActive.value === 1) return Toast.fail('请先绑定虚拟币地址')
      if (+withdrawalAmount.value < +priceToFixed(minAmount.value)) {
        return Toast.fail(`提款金额最小为${priceToFixed(minAmount.value)}元`)
      }
      if (+withdrawalAmount.value > +priceToFixed(maxAmount.value)) {
        return Toast.fail(`提款金额最大为${priceToFixed(maxAmount.value)}元`)
      }
      if (verificationCode.value.length < 6) {
        return Toast.fail('请输入6位短信验证码')
      }
      if (transactionPassword.value.length < 6 || transactionPassword.value.length > 20) {
        return Toast.fail('交易密码请输入6-20位数字和字母')
      }
      const params = {
        currency: withdrawalTypeActive.value === 0 ? 1 : 2,
        bank_id:
          withdrawalTypeActive.value === 0 ? bankActiveId.id : usdtActiveId.id,
        password: transactionPassword.value,
        money: withdrawalAmount.value,
        terminal: 2,
        domain: window.location.href,
        captcha_code: verificationCode.value
      }
      doWithdraw(params).then((res: any) => {
        if (+res.code === 1) {
          Toast('取款成功')
          verificationCode.value = ''
          transactionPassword.value = ''
          withdrawalAmount.value = ''
          withdrawLoading.value = false
          getDictionary()
          getTodayWithdrawTime()
          getLackBetAmount()
        }
      }).catch((err: any) => {
        Toast.fail(err.msg || err.message)
        withdrawLoading.value = false
      })
    }
    onMounted(() => {
      getDictionary()
      getTodayWithdrawTime()
      getBankInfo()
      getLackBetAmount()
      proxy.mittBus.on('center-wallet', (val: any) => {
        walletVal.value = val
      })
    })
    onUnmounted(() => {
      proxy.mittBus.off('center-wallet')
    })
    return {
      ...toRefs(state),
      onConfirm,
      dealWithCardNumber,
      priceFormatter,
      userInfo,
      countDown,
      withdrawLoading,
      tipShowPopover,
      textTipImage,
      withdrawalTypeActive,
      transactionPassword,
      verificationCode,
      withdrawalAmount,
      bankCardNumber,
      bankCardShowPicker,
      usdtCardShowPicker,
      bankCardActive,
      bankCardList,
      minAmount,
      maxAmount,
      bankMinAmount,
      bankMaxAmount,
      usdtMinAmount,
      usdtMaxAmount,
      frequency,
      availableQuota,
      flowingWater,
      walletVal,
      exchangeRate,
      backPath,
      withdrawChangePrice,
      toPath,
      getLackBetAmount,
      getUsdtInfo,
      bankCardClick,
      usdtCardClick,
      changeBankCard,
      changeUsdtCard,
      bankCard4,
      getDictionary,
      getTodayWithdrawTime,
      allAmountWithdraw,
      getPhoneCaptcha,
      goPath,
      getBankInfo,
      doWithdrawClick,
      bankDefaultImage,
      USDTDefaultImage,
      usdtCardList,
      withdrawClickTab,
      usdtCardActive,
      priceToFixed,
      isWithdrawSubmit,
      phoneHandling
    }
  }
})
</script>
<style>
.van-popover__arrow {
  color: #151a1e !important;
}
.van-popover__content {
  height: 26px;
  line-height: 28px;
  font-size: 12px;
  color: #94a5b1;
  padding: 0 10px;
  background: #151a1e !important;
}
</style>
<style lang="less" scoped>
.v-information-withdraw {
  .withdraw-main {
    margin: 48px 15px 20px 15px;
    height: calc(100% - 48px);
    overflow: auto;
    :deep(.van-tabs--line .van-tabs__wrap) {
      height: 30px;
    }
    :deep(.van-tabs__nav) {
      background: transparent;
      font-size: 14px;
    }
    :deep(.van-tab--line) {
      color: #8f9fab;
      font-weight: 500;
    }
    :deep(.van-tab--active) {
      color: #fff;
      font-weight: 500;
    }
    :deep(.van-tabs__line) {
      width: 80px;
      height: 1px;
      background-image: linear-gradient(to right, #12dedf, #07c79c);
    }
    .wallet-information {
      display: flex;
      flex-direction: column;
      &-title {
        display: flex;
        height: 30px;
        line-height: 30px;
        color: #fff;
        font-size: 14px;
      }
      &-card {
        position: relative;
        display: flex;
        flex-direction: column;
        width: calc(100% - 58px);
        padding: 14px 13px 0 45px;
        height: 96px;
        margin: 10px 0;
        background-color: #2d363d;
        border-radius: 8px;
        overflow: hidden;
        &-info {
          display: flex;
          justify-content: space-between;
          &-have {
            position: relative;
            display: flex;
            //flex-direction: column;
            img {
              position: absolute;
              top: 0;
              left: -24px;
              width: 20px;
              height: 16px;
            }
            .bank-card-title {
              font-size: 14px;
              font-weight: 500;
              color: #fff;
              margin-right: 5px;
            }
            .bank-card-type {
              font-size: 12px;
              font-weight: 300;
              color: #eae1ff;
              margin-top: 5px;
            }
          }
          &-button {
            display: flex;
            justify-content: center;
            width: 50px;
            height: 22px;
            line-height: 22px;
            background-color: #7e6dfc;
            border-radius: 11px;
            position: absolute;
            right: 12px;
            top: 12px;
            z-index: 101;
            span {
              color: #fff;
              font-size: 11px;
            }
          }
          .maintain-button {
            opacity: .5;
          }
        }
        &-add {
          display: flex;
          padding-right: 32px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 110px;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-color: #2d363d;
          border-radius: 8px;
          span:nth-child(1) {
            color: #fff;
            margin-bottom: 10px;
            font-size: 32px;
            color: #07c79c;
          }
          span:nth-child(2) {
            font-size: 11px;
            color: #94a5b1;
          }
        }
        &-number {
          display: flex;
          margin-top: 36px;
          span {
            font-size: 26px;
            color: #fff;
          }
        }
      }
      &-bank {
        background-image: url('../../../../assets/bank/bank-bg1.png');
        background-repeat: no-repeat;
        background-size: cover;
      }
      &-usdt {
        background-image: url('../../../../assets/bank/bank-bg2.png');
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
    &-form {
      margin-bottom: 20px;
      .personal-withdraw-bank {
        width: 20px;
        height: 15px;
      }
      .personal-withdraw-right {
        width: 5px;
        height: 8px;
      }
      .withdraw-right-icon-text {
        font-size: 12px;
        font-weight: 300;
        color: #b6c1cb;
      }
      .withdraw-right-icon-code {
        font-size: 12px;
        font-weight: 300;
        background-image: linear-gradient(to right, #12dedf, #07c79c),
          linear-gradient(to bottom, #94a5b1, #94a5b1);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
      .withdraw-popup {
        .header {
          height: 40px;
          line-height: 40px;
          background-color: #3e4a53;
          text-align: center;
          font-size: 12px;
          color: #fff;
          font-weight: bold;
        }
        .content {
          :deep(.van-cell__title) {
            color: #fff;
          }
          :deep(.van-cell) {
            background-color: transparent;
          }
        }
      }
      &-text {
        display: flex;
        height: 24px;
        align-items: center;
        font-size: 12px;
        color: #fff;
      }
      .withdraw-main-form-code-tip {
        font-family: PingFang-SC;
        font-size: 12px;
        font-weight: 300;
        color: #94a5b1;
        margin-bottom: 10px;
      }
      &-tip {
        margin-bottom: 5px;
        div {
          display: flex;
          align-items: center;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          color: #94a5b1;
          span {
            color: #fff;
            margin: 0 5px;
          }
        }
        .withdraw-flow {
          color: #e9b11b;
          font-family: PingFang-SC;
          font-size: 12px;
          font-weight: bold;
          span {
            color: #e9b11b;
          }
        }
        div:nth-child(2) {
          margin-top: 5px;
        }
        img {
          display: flex;
          width: 12px;
          height: 12px;
          margin-left: 5px;
          margin-top: -2px;
        }
      }
      &-help {
        margin-top: 12px;
        font-size: 12px;
        color: #fff;
        span {
          color: #0fd7cb;
        }
      }
      :deep(.van-popup) {
        background: #2d363d;
      }
      :deep(.van-popup--bottom.van-popup--round) {
        border-radius: 8px;
      }
      :deep(.van-popup__close-icon--top-right) {
        top: 12px;
        right: 12px;
        color: #07c79c;
        font-size: 18px;background: #2d363d;
        margin: 0;
      }
      :deep(.van-cell-group) {
        background: transparent;
      }
      :deep(.van-cell-group--inset) {
        margin: 0;
      }
      :deep(.van-cell) {
        height: 36px;
        line-height: 36px;
        background-color: #2d363d;
        padding: 0;
        margin-bottom: 10px;
        align-items: center;
        border-radius: 8px;
      }
      :deep(.van-cell::after) {
        border-bottom: 0;
      }
      :deep(.withdrawal-amount.van-field--disabled) {
        background: rgba(148, 165, 177, 1);
        .van-field__control {
          background: rgba(148, 165, 177, 1);
          -webkit-text-fill-color: #fff;
        }
        .withdraw-right-icon-text {
          color: #fff;
        }
      }
      :deep(.van-field__left-icon) {
        margin-right: 0;
        display: flex;
        width: 34px;
        align-items: center;
        justify-content: flex-end;
      }
      :deep(.van-field__right-icon) {
        margin-right: 0;
        display: flex;
        width: auto;
        align-items: center;
        justify-content: flex-end;
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
        margin-top: 24px;
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
  }
  .maintain {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
  }
  .v-withdraw-popup-header {
    display: flex;
    width: calc(100% - 32px);
    padding: 0 16px;
    height: 40px;
    line-height: 40px;
    background-color: #3e4a53;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 14px;
    span:nth-child(1) {
      color: #b6c1cb;
    }
    .price-refresh {
      width: 19px;
      height: 19px;
    }
  }
  .radio-maintain {
    height: 18px;
    line-height: 18px;
    padding: 3px 10px;
    border-radius: 9px;
    background-color: #999;
    font-size: 10px;
    color: #fff;
  }
  :deep(.van-popup) {
    background: #2d363d;
  }
  :deep(.van-cell-group) {
    background: #2d363d;
    margin: 0;
    border-radius: 0;
  }
  :deep(.van-cell) {
    background: transparent;
    color: #fff;
    font-size: 14px;
    align-items: center;
    .van-cell-image {
      width: 13px;
      height: 13px;
      margin-right: 5px;
    }
    .van-cell__label {
      margin-top: 0;
      line-height: 20px;
      color: #6c7984;
      font-size: 12px;
    }
  }
  :deep(.withdraw-add-icon) {
    font-size: 12px;
    color: #94a5b1;
    .van-icon {
      font-size: 16px;
      color: #07c79c;
      margin-right: 3px;
    }
  }
  :deep(.van-cell::after) {
    border-bottom: 1px solid #6c7984;
  }
  :deep(.van-radio__icon .van-icon) {
    border: 0;
    background-color: transparent;
  }
  :deep(.van-radio__icon--checked .van-icon) {
    color: #12dedf;
    background-image: linear-gradient(to right, #12dedf, #07c79c);
    -webkit-background-clip: text;
    background-clip: text;
  }
  .v-withdraw-header-r {
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
}
.bankcard-tip {
  color: #94a5b1;
  margin: 0 0 10px;
  font-size: 12px;
}
</style>
