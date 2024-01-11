<template>
  <div class="v-transfer">
    <GlobalLoading v-show="loading" min-height="200px" />
    <PubHeader :right-icon="false" />
    <div class="v-transfer-main">
      <div class="v-transfer-main-tip">
        <div class="v-transfer-main-tip-title">
          <van-popover v-model:show="transferShowPopover">
            <span>中心钱包和可回收的场馆金额将被带入到进入的场馆中</span>
            <template #reference>
              <svg-icon icon-class="transfer-tip" />
            </template>
          </van-popover>
          <span>进入场馆时自动带入余额</span>
        </div>
        <div class="v-transfer-main-tip-switch">
          <van-switch
            v-model="transferChecked"
            active-color="#07c79c"
            inactive-color="#2d363d"
            @change="updateQuicklyTransfer"
          />
        </div>
      </div>
      <div class="v-transfer-main-info">
        <div class="info-l">
          <span>从</span>
          <span />
          <span>到</span>
        </div>
        <div class="info-m">
          <div class="transfer-address">
            <div
              class="address-title1"
              :class="rotateState ? '' : 'transfer-rotate1'"
            >
              <span>{{ priceAddressFilter(6) }}</span>
              <span>¥{{ priceToFixed(centerWallet) }}</span>
            </div>
          </div>
          <div class="transfer-divider" />
          <div class="transfer-address">
            <div
              class="address-title2"
              :class="rotateState ? '' : 'transfer-rotate2'"
              @click="transferPriceChange"
            >
              <span>{{ priceAddressFilter(priceAddress) }}</span>
              <span
                v-if="priceAddress !== -1"
              >¥{{ priceToFixed(gameSportHandPrice()) }}</span>
            </div>
            <div
              class="address-icon"
              :class="rotateState ? '' : 'transfer-icon'"
            >
              <svg-icon
                class="personal-withdraw-right"
                icon-class="personal-withdraw-right"
              />
            </div>
          </div>
        </div>
        <div class="info-r">
          <svg-icon
            class="transfer-change"
            :class="rotateState ? '' : 'transfer-rotate2'"
            icon-class="transfer-change"
            @click="transferChange"
          />
        </div>
      </div>
      <div class="v-transfer-main-price">
        <div class="price-title">
          转账金额
        </div>
        <div class="price-input">
          <van-cell-group inset>
            <van-field
              v-model="transferAmount"
              center
              clearable
              type="number"
              autocomplete="off"
              :formatter="+priceAddress === 4 ? priceFormatter0 : priceFormatter"
              placeholder="请输入转账金额"
            >
              <template #button>
                <span @click="allAmount">全部金额</span>
              </template>
            </van-field>
          </van-cell-group>
        </div>
      </div>
      <div class="v-transfer-main-button">
        <van-button
          round
          block
          type="primary"
          :loading="transferLoading"
          loading-text="提交中..."
          :disabled="!isTransferSubmit"
          @click="transferSubmit"
        >
          立即转账
        </van-button>
        <div class="v-transfer-main-button-tip">
          如需帮助，请联系
          <span @click="toPath({ name: 'OnlineService' })">在线客服</span>
        </div>
      </div>
    </div>
    <van-popup v-model:show="priceAddressShowPicker" position="bottom">
      <div class="v-popup-header">
        <span @click="priceAddressShowPicker = false">取消</span>
        <span>选择场馆钱包</span>
        <svg-icon
          class="price-refresh"
          icon-class="price-refresh"
          @click="walletRefresh"
        />
      </div>
      <van-radio-group v-model="priceAddress">
        <van-cell-group inset>
          <van-cell
            v-for="(item, index) in priceAddressList"
            :key="index"
            :title="item.title"
            clickable
            @click="priceAddressClick(item.id)"
          >
            <template #label>
              <div class="transfer-group-title">
                <span>{{ priceToFixed(item.price) }}</span>
              </div>
              <!--              <van-collapse v-model="walletActiveNames">-->
              <!--                <van-collapse-item :name="index" @click.stop="transferCollapse">-->
              <!--                  <template #title>-->
              <!--                    <div>参与活动中无法转出</div>-->
              <!--                  </template>-->
              <!--                  <div class="transfer-group-main">-->
              <!--                    <div>-->
              <!--                      <span>活动名称</span>-->
              <!--                      <span>体育优惠</span>-->
              <!--                    </div>-->
              <!--                    <div>-->
              <!--                      <span>所需流水</span>-->
              <!--                      <span>7456.22</span>-->
              <!--                    </div>-->
              <!--                    <div>-->
              <!--                      <span>已完成流水</span>-->
              <!--                      <span>3333.44</span>-->
              <!--                    </div>-->
              <!--                  </div>-->
              <!--                </van-collapse-item>-->
              <!--              </van-collapse>-->
            </template>
            <template #right-icon>
              <van-radio :name="item.id">
                <template #icon="props">
                  <img
                    class="img-icon"
                    :src="props.checked ? walletActiveIcon : walletInactiveIcon"
                  >
                </template>
              </van-radio>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
    <div class="v-transfer-header-r">
      <span @click="selectBalanceRecovery">一键回收</span>
    </div>
    <van-dialog
      v-model:show="transferDialogShow"
      title="提示"
      show-cancel-button
      :style="{ width: '70%' }"
      @confirm="transferDialogConfirm"
      @cancel="transferDialogCancel"
    >
      <div class="transfer-dialog-main">
        是否要{{ transferChecked ? '开启' : '关闭' }}自动转账功能
      </div>
    </van-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { Toast } from 'vant'
import PubHeader from '@/components/PubHeader/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import {
  getCenterBalance,
  getTripartiteBalance,
  mainToTripartiteWallet,
  tripartiteToMainWallet,
  setQuicklyTransfer,
  balanceRecovery
} from '@/api/wallet.js'
import toPathHook from '@/hooks/toPath'
import { priceToFixed, priceFormatter, priceFormatter0 } from '@/utils/index.js'
import GlobalLoading from '@/components/Loading/index.vue'
import store from '@/store/index.js'
import { getPersonalInfo } from '@/api/user.js'

export default defineComponent({
  components: {
    SvgIcon,
    PubHeader,
    GlobalLoading
  },
  setup() {
    const { toPath } = toPathHook()
    const userInfo = computed(() => store.getters.getUserInfo)
    const transferShowPopover = ref(false)
    const transferChecked = ref(false)
    /**
     * 钱包地址
     */
    const priceAddress = ref(-1)
    /**
     * 钱包地址弹窗状态
     */
    const priceAddressShowPicker = ref(false)
    /**
     * 钱包地址状态
     */
    const rotateState = ref(true)
    /**
     * 钱包余额
     */
    const walletBalance = ref('')
    /**
     * 转账金额
     */
    const transferAmount = ref('')
    /**
     * 转账按钮loading
     */
    const transferLoading = ref(false)
    /**
     * IA电竞钱包是否维护
     */
    const iaIsMaintain = ref(false)
    /**
     * 小艾体育钱包是否维护
     */
    const sbIsMaintain = ref(false)
    /**
     * 平博体育钱包是否维护
     */
    const pbIsMaintain = ref(false)
    const xjIsMaintain = ref(false)
    const agIsMaintain = ref(false)
    /**
     * ia电竞钱包余额
     */
    const iaWallet = ref(0)
    /**
     * 小艾体育钱包余额
     */
    const sbWallet = ref(0)
    /**
     * 平博体育钱包余额
     */
    const pbWallet = ref(0)
    const xjWallet = ref(0)
    const agWallet = ref(0)
    /**
     * 中心钱包余额
     */
    const centerWallet = ref(0)
    /**
     * 场馆钱包选中图标
     */
    const walletActiveIcon = require('@/assets/wallet/wallet-active.png')
    /**
     * 场馆钱包未选中图标
     */
    const walletInactiveIcon = require('@/assets/wallet/wallet-unactive.png')
    /**
     * 场馆钱包折叠面板
     */
    const walletActiveNames = ref([])
    /**
     * 自动带入余额弹窗
     */
    const transferDialogShow = ref(false)
    /**
     * 点击钱包地址状态改变
     */
    const transferChange = () => {
      rotateState.value = !rotateState.value
      transferAmount.value = ''
      walletBalanceFilter()
    }
    /**
     * 钱包地址列表
     */
    const priceAddressList = [
      {
        id: 1,
        title: '小艾电竞',
        price: 0
      },
      {
        id: 4,
        title: '小艾体育',
        price: 0
      },
      {
        id: 5,
        title: 'AG真人',
        price: 0
      },
      {
        id: 3,
        title: '平博体育',
        price: 0
      },
      {
        id: 2,
        title: '沙巴体育',
        price: 0
      }
    ]
    /**
     * 过滤钱包地址
     * @param index (id值)
     */
    const priceAddressFilter = (index: any) => {
      const text = Number(index)
      if (text === -1) {
        return '点击选择'
      } else if (text === 1) {
        return '小艾电竞'
      } else if (text === 2) {
        return '沙巴体育'
      } else if (text === 3) {
        return '平博体育'
      } else if (text === 4) {
        return '小艾体育'
      } else if (text === 5) {
        return 'AG真人'
      } else {
        return '中心钱包'
      }
    }
    /**
     * 过滤钱包地址
     * @param state(状态)
     */
    const priceAddressTextFilter = (state: boolean) => {
      if (state) {
        if (priceAddress.value !== -1) {
          return priceAddressFilter(priceAddress.value)
        }
      } else {
        return '中心钱包'
      }
    }
    /**
     * 钱包地址切换
     */
    const transferPriceChange = () => {
      priceAddressShowPicker.value = true
    }
    /**
     * 获取钱包余额
     */
    const walletBalanceFilter = () => {
      if (priceAddress.value === -1) return
      if (
        priceAddress.value !== -1 &&
        priceAddress.value !== 6 &&
        rotateState.value
      ) {
        return centerWallet.value
      } else {
        for (const i in priceAddressList) {
          if (priceAddressList[i].id === priceAddress.value) {
            return String(priceAddressList[i].price)
          }
        }
      }
    }
    /**
     * 钱包地址选择
     */
    const priceAddressClick = (id: number) => {
      priceAddress.value = id
      transferAmount.value = ''
      priceAddressShowPicker.value = false
    }
    /**
     * 全部金额划转
     */
    const allAmount = () => {
      if (
        (rotateState.value && priceAddress.value !== -1) ||
        !rotateState.value
      ) {
        transferAmount.value = String(walletBalanceFilter())
      }
    }
    /**
     * 获取中心钱包余额
     */
    const getCenterWallet = async() => {
      const amount1 = await getCenterBalance()
      if (Number(amount1.code) === 1) {
        centerWallet.value = +amount1.data.amount
      }
    }
    /**
     * 获取游戏钱包余额
     */
    const getGameSportWallet = async() => {
      getTripartiteBalance({ game_id: 1 })
        .then((res: any) => {
          iaIsMaintain.value = false
          if (Number(res.code) === 1) {
            iaWallet.value = +res.data.amount
            gameSportPrice(1, iaWallet.value)
          }
        })
        .catch((err: any) => {
          if (Number(err.code) === 60002) {
            iaIsMaintain.value = true
          }
        })
      getTripartiteBalance({ game_id: 2 })
        .then((res: any) => {
          sbIsMaintain.value = false
          if (Number(res.code) === 1) {
            sbWallet.value = +res.data.amount
            gameSportPrice(2, sbWallet.value)
          }
        })
        .catch((err: any) => {
          if (Number(err.code) === 60002) {
            sbIsMaintain.value = true
          }
        })
      getTripartiteBalance({ game_id: 3 })
        .then((res: any) => {
          pbIsMaintain.value = false
          if (Number(res.code) === 1) {
            pbWallet.value = +res.data.amount
            gameSportPrice(3, pbWallet.value)
          }
        })
        .catch((err: any) => {
          if (Number(err.code) === 60002) {
            pbIsMaintain.value = true
          }
        })
      getTripartiteBalance({ game_id: 4 })
        .then((res: any) => {
          xjIsMaintain.value = false
          if (Number(res.code) === 1) {
            xjWallet.value = +res.data.amount
            gameSportPrice(4, xjWallet.value)
          }
        })
        .catch((err: any) => {
          if (Number(err.code) === 60002) {
            xjIsMaintain.value = true
          }
        })
      getTripartiteBalance({ game_id: 5 })
        .then((res: any) => {
          agIsMaintain.value = false
          if (Number(res.code) === 1) {
            agWallet.value = +res.data.amount
            gameSportPrice(5, agWallet.value)
          }
        })
        .catch((err: any) => {
          if (Number(err.code) === 60002) {
            agIsMaintain.value = true
          }
        })
    }
    /**
     * 获取单独游戏钱包余额
     */
    const getAloneGameSportWallet = async(index: number) => {
      const walletPrice = await getTripartiteBalance({ game_id: index })
      if (Number(walletPrice.code) === 1) {
        if (index === 1) {
          iaWallet.value = +walletPrice.data.amount
          gameSportPrice(1, iaWallet.value)
        } else if (index === 2) {
          sbWallet.value = +walletPrice.data.amount
          gameSportPrice(2, sbWallet.value)
        } else if (index === 3) {
          pbWallet.value = +walletPrice.data.amount
          gameSportPrice(3, pbWallet.value)
        } else if (index === 4) {
          xjWallet.value = +walletPrice.data.amount
          gameSportPrice(4, xjWallet.value)
        } else {
          agWallet.value = +walletPrice.data.amount
          gameSportPrice(5, agWallet.value)
        }
        await getCenterWallet()
      }
    }
    /**
     * 钱包余额
     */
    const gameSportPrice = (id: number, row: any) => {
      for (const i in priceAddressList) {
        if (priceAddressList[i].id === id) {
          priceAddressList[i].price = row
        }
      }
    }
    /**
     * 匹配金额
     */
    const gameSportHandPrice = () => {
      for (const i in priceAddressList) {
        if (priceAddressList[i].id === priceAddress.value) {
          return priceAddressList[i].price
        }
      }
    }
    const loading = ref(false)
    /**
     * 钱包地址刷新
     */
    const walletRefresh = () => {
      priceAddress.value = -1
      transferAmount.value = ''
      init()
    }
    /**
     * 立即转账
     */
    const transferSubmit = async() => {
      if (
        transferAmount.value &&
        !transferLoading.value &&
        priceAddress.value !== -1
      ) {
        transferLoading.value = true
        const params = {
          game_id: priceAddress.value,
          amount: transferAmount.value
        }
        if (rotateState.value) {
          await mainToTripartiteWallet(params)
            .then((res: any) => {
              if (Number(res.code) === 1) {
                Toast.success({
                  message: '转入成功',
                  duration: 1000
                })
                transferAmount.value = ''
                transferLoading.value = false
                getAloneGameSportWallet(priceAddress.value)
              } else {
                transferLoading.value = false
              }
            })
            .catch((err: any) => {
              Toast.fail(err.msg || err.message)
              transferLoading.value = false
            })
        } else {
          await tripartiteToMainWallet(params)
            .then((res: any) => {
              if (Number(res.code) === 1) {
                Toast.success({
                  message: '转出成功',
                  duration: 1000
                })
                transferAmount.value = ''
                transferLoading.value = false
                getAloneGameSportWallet(priceAddress.value)
              } else {
                transferLoading.value = false
              }
            })
            .catch((err: any) => {
              Toast.fail(err.msg || err.message)
              transferLoading.value = false
            })
        }
      }
    }
    /**
     * 一键回收
     */
    const selectBalanceRecovery = async() => {
      const data = await balanceRecovery()
      if (+data.code === 1) {
        await init()
        Toast.success({
          message: '回收成功',
          duration: 1000
        })
      }
    }
    /**
     * 设置一键转入开关
     */
    const updateQuicklyTransfer = () => {
      transferDialogShow.value = true
    }
    const transferDialogConfirm = async() => {
      const switchState = transferChecked.value ? 1 : 0
      await setQuicklyTransfer({ is_on: switchState }).then((res: any) => {
        if (+res.code === 1) {
          Toast.success('操作成功')
          getUserInfo()
        }
      }).catch((err: any) => {
        Toast.fail(err.msg || err.message)
      })
    }
    const getUserInfo = async() => {
      await getPersonalInfo().then((res: any) => {
        if (+res.code === 1) {
          store.commit('user/SET_USER_INFO', JSON.stringify(res.data))
        }
      }).catch((err: any) => {
        Toast.fail(err.msg || err.message)
      })
    }
    const transferDialogCancel = () => {
      transferChecked.value = !transferChecked.value
    }
    /**
     * 是否可以提交
     */
    const isTransferSubmit = computed(() => {
      if (priceAddress.value !== -1 && +transferAmount.value > 0) {
        return true
      } else {
        return false
      }
    })
    const transferCollapse = () => {
      // console.log(1)
    }
    const init = () => {
      loading.value = true
      getCenterWallet()
      getGameSportWallet()
      setTimeout(() => {
        loading.value = false
      }, 200)
    }
    onMounted(() => {
      init()
      const localQuickly = userInfo.value.is_on
      if (localQuickly === 1) {
        transferChecked.value = true
      }
      if (localQuickly === 0) {
        transferChecked.value = false
      }
    })
    return {
      rotateState,
      transferLoading,
      walletActiveIcon,
      walletInactiveIcon,
      walletActiveNames,
      priceAddressShowPicker,
      priceAddress,
      priceAddressList,
      centerWallet,
      walletBalance,
      transferAmount,
      transferShowPopover,
      transferChecked,
      isTransferSubmit,
      loading,
      transferDialogShow,
      userInfo,
      transferChange,
      priceFormatter,
      priceFormatter0,
      transferPriceChange,
      priceAddressTextFilter,
      priceAddressFilter,
      selectBalanceRecovery,
      priceAddressClick,
      walletBalanceFilter,
      allAmount,
      walletRefresh,
      transferSubmit,
      getGameSportWallet,
      gameSportPrice,
      getCenterWallet,
      gameSportHandPrice,
      getAloneGameSportWallet,
      updateQuicklyTransfer,
      transferCollapse,
      toPath,
      priceToFixed,
      init,
      transferDialogConfirm,
      transferDialogCancel,
      getUserInfo
    }
  }
})
</script>

<style>
.van-popover {
  left: 18px !important;
}
.van-popover__arrow {
  left: 12px !important;
  color: #151a1e !important;
}
.van-popover__content {
  display: flex;
  line-height: 1;
  background: #151a1e !important;
  color: #94a5b1 !important;
  border-radius: 4px !important;
  padding: 10px 10px;
  font-size: 12px;
}
</style>
<style lang="less" scoped>
.v-transfer {
  &-main {
    margin: 48px 15px 25px 15px;
    &-tip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      &-title {
        font-size: 12px;
        color: #aec1d0;
        padding-left: 10px;
        span {
          margin-left: 5px;
        }
      }
      &-switch {
        :deep(.van-switch) {
          width: 40px;
          height: 20px;
        }
        :deep(.van-switch__node) {
          width: 18px;
          height: 18px;
          top: 1px;
          left: 1px;
        }
      }
    }
    &-info {
      display: flex;
      width: 100%;
      height: 120px;
      border-radius: 8px;
      background-color: #2d363d;
      .info-l {
        display: flex;
        width: 20%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #8f9fab;
        font-size: 12px;
        span:nth-child(2) {
          width: 1px;
          height: 36px;
          background-color: #8f9fab;
          margin: 3px 0;
        }
      }
      .info-m {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 60%;
        color: #fff;
        .transfer-address {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 50px;
          .address-title1 {
            display: flex;
            flex-direction: column;
            font-size: 14px;
            color: #fff;
            flex: 1;
            transition: all 0.5s;
            span:nth-child(2) {
              font-size: 12px;
              color: #6c7984;
            }
          }
          .address-title2 {
            display: flex;
            flex-direction: column;
            font-size: 14px;
            color: #fff;
            flex: 1;
            transition: all 0.5s;
            span:nth-child(2) {
              font-size: 12px;
              color: #6c7984;
            }
          }
          .transfer-rotate1 {
            transition: all 0.5s;
            margin-top: 100px;
            -webkit-transfrom-origin: 50% 51%;
          }
          .transfer-rotate2 {
            transition: all 0.5s;
            margin-bottom: 100px;
            -webkit-transfrom-origin: 50% 51%;
          }
          .transfer-icon {
            transition: all 0.5s;
            margin-bottom: 106px;
            -webkit-transfrom-origin: 50% 51%;
          }
          .address-icon {
            transition: all 0.5s;
            .personal-withdraw-right {
              width: 5px;
              height: 8px;
            }
          }
        }
        .transfer-divider {
          display: flex;
          width: 100%;
          height: 1px;
          background-color: #8f9fab;
        }
      }
      .info-r {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20%;
        .transfer-change {
          width: 22px;
          height: 22px;
          transition: all 0.5s;
        }
        .transfer-rotate2 {
          transition: all 0.5s;
          transform: rotate(180deg);
          -ms-transform: rotate(180deg); /* IE 9 */
          -moz-transform: rotate(180deg); /* Firefox */
          -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
          -o-transform: rotate(180deg); /* Opera */
        }
      }
    }
    .v-transfer-main-price {
      display: flex;
      flex-direction: column;
      margin-top: 30px;
      .price-title {
        display: flex;
        height: 30px;
        align-items: center;
        font-size: 14px;
        color: #fff;
      }
      .price-input {
        :deep(.van-cell-group--inset) {
          margin: 0;
          border-radius: 0;
        }
        :deep(.van-cell-group) {
          background: transparent;
        }
        :deep(.van-cell) {
          height: 40px;
          align-items: center;
          background-color: #2d363d;
          border-radius: 8px;
          font-size: 12px;
          color: #fff;
        }
        ::placeholder {
          color: #6c7984;
        }
        :deep(.van-field__control) {
          color: #fff;
        }
        :deep(.van-cell__value) {
          color: #fff;
        }
        &-tip {
          display: flex;
          height: 30px;
          align-items: center;
          font-size: 12px;
          color: #6c7984;
          margin-left: 16px;
          span {
            color: #fff;
          }
        }
      }
    }
    .v-transfer-main-button {
      display: flex;
      flex-direction: column;
      margin-top: 40px;
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
      &-tip {
        display: flex;
        margin-top: 40px;
        justify-content: center;
        color: #fff;
        font-size: 12px;
        span {
          color: #0fd7cb;
        }
      }
    }
  }
  .v-popup-header {
    position: absolute;
    top: 0;
    left: 0;
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
  :deep(.van-popup) {
    font-family: PingFang-SC;
    background: #2d363d;
    .van-dialog__header {
      height: 40px;
      line-height: 40px;
      padding: 0;
      font-size: 14px;
      color: #fff;
      background-color: #3e4a53;
    }
    .transfer-dialog-main {
      display: flex;
      justify-content: center;
      height: 110px;
      align-items: center;
      font-size: 12px;
      color: #94a5b1;
    }
    .van-dialog__cancel {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #94a5b1;
      background-color: #3e4a53;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .van-dialog__confirm {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #1a242c;
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .van-hairline--top::after {
      border-top-width: 0;
    }
    .van-hairline--left::after {
      border-left-width: 0;
    }
  }
  :deep(.van-cell-group) {
    background: #2d363d;
    margin: 0;
    border-radius: 0;
  }
  :deep(.van-collapse-item) {
    .van-cell {
      padding: 0;
    }
    .van-cell::after {
      border-bottom: 0;
    }
    .van-cell__title {
      color: #6c7984;
      font-size: 12px;
    }
  }
  :deep(.van-radio-group) {
    height: calc(100% - 40px);
    margin-top: 40px;
    .van-cell-group--inset {
      height: calc(100% - 40px);
      overflow: auto;
    }
  }
  :deep(.van-cell) {
    background: transparent;
    color: #fff;
    font-size: 14px;
    .van-cell__label {
      width: calc(100% + 16px);
      margin-top: 0;
      line-height: 20px;
      color: #6c7984;
      font-size: 12px;
      .van-collapse-item__content {
        padding: 0;
        border-radius: 8px;
        background-color: #20272d;
      }
      .transfer-group-main {
        display: flex;
        width: calc(100% - 22px);
        flex-direction: column;
        background-color: #20272d;
        border-radius: 8px;
        padding: 9px 11px;
        div {
          display: flex;
          height: 20px;
          line-height: 20px;
          justify-content: space-between;
          font-size: 12px;
          color: #adbfcf;
        }
        div:nth-child(3) {
          span:nth-child(2) {
            color: #fff;
          }
        }
      }
      .van-hairline--top-bottom::after {
        border: 0;
      }
    }
  }
  :deep(.van-cell::after) {
    border-bottom: 1px solid #6c7984;
  }
  :deep(.van-radio) {
    align-items: flex-start;
  }
  :deep(.van-radio__icon) {
    img {
      width: 16px;
      height: 16px;
      margin-top: 14px;
    }
  }
  :deep(.van-radio__icon .van-icon) {
    border: 0;
    background-color: transparent;
  }
  :deep(.van-radio__icon--checked .van-icon) {
    color: transparent;
    background-image: linear-gradient(to right, #12dedf, #07c79c);
    -webkit-background-clip: text;
  }
  .transfer-group-title {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    span:nth-child(1) {
      color: #adbfcf;
    }
  }
  .v-transfer-header-r {
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
</style>
