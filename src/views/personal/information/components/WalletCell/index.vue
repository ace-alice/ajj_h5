<template>
  <div class="v-wallet-cell">
    <div class="v-wallet-cell-header">
      <span>我的钱包</span>
      <svg-icon v-if="!loading" icon-class="price-refresh" @click="init" />
      <svg-icon v-else style="font-size: 32px;margin-right: -8px;" icon-class="refresh-loading" />
    </div>
    <div class="v-wallet-cell-total">
      <div class="v-wallet-cell-total-t">
        <div class="t-main-header">
          <div>
            <svg-icon icon-class="wallet-money" />
            <span>钱包总余额</span>
          </div>
          <div>
            <span @click="goRecharge">存款</span>
            <span @click="goWithdraw">取款</span>
          </div>
        </div>
        <div class="t-main-number">
          <span>¥{{ priceToFixed(allAmountTotal) }}</span>
        </div>
      </div>
      <div class="v-wallet-cell-total-b">
        <div class="b-main-left">
          <span>中心钱包</span>
          <span>¥{{ priceToFixed(centerWallet) }}</span>
        </div>
        <div class="b-main-center">
          <span @click="oneClickRecycling">一键回收</span>
        </div>
        <div class="b-main-right">
          <span>场馆钱包合计</span>
          <span>¥{{ priceToFixed(gameWalletTotal) }}</span>
        </div>
      </div>
    </div>
    <div class="v-wallet-cell-game">
      <div class="v-wallet-cell-game-title">
        <span>游戏场馆</span>
      </div>
      <div class="v-wallet-cell-game-main">
        <div
          class="wallet-ia-sports"
          :class="iaIsMaintain ? 'wallet-maintain-bg' : ''"
        >
          <div><img :src="iaSportIcon">小艾电竞钱包</div>
          <div>¥{{ priceToFixed(iaWallet) }}</div>
          <div>
            <span @click="transferDialog(1, 1)">转入</span>
            <span>|</span>
            <span @click="transferDialog(1, 2)">转出</span>
          </div>
          <van-loading v-show="iaLoading" />
        </div>
        <div
          class="wallet-xj-sports"
          :class="xjIsMaintain ? 'wallet-maintain-bg' : ''"
        >
          <div><img :src="xjSportIcon">小艾体育钱包</div>
          <div>¥{{ priceToFixed(xjWallet) }}</div>
          <div>
            <span @click="transferDialog(4, 1)">转入</span>
            <span>|</span>
            <span @click="transferDialog(4, 2)">转出</span>
          </div>
          <van-loading v-show="xjLoading" />
        </div>
        <div
          class="wallet-pb-sports"
          :class="pbIsMaintain ? 'wallet-maintain-bg' : ''"
        >
          <div><img :src="pbSportIcon">平博体育钱包</div>
          <div>¥{{ priceToFixed(pbWallet) }}</div>
          <div>
            <span @click="transferDialog(3, 1)">转入</span>
            <span>|</span>
            <span @click="transferDialog(3, 2)">转出</span>
          </div>
          <van-loading v-show="pbLoading" />
        </div>
        <div
          class="wallet-sb-sports"
          :class="sbIsMaintain ? 'wallet-maintain-bg' : ''"
        >
          <div><img :src="sbSportIcon">沙巴体育钱包</div>
          <div>¥{{ priceToFixed(sbWallet) }}</div>
          <div>
            <span @click="transferDialog(2, 1)">转入</span>
            <span>|</span>
            <span @click="transferDialog(2, 2)">转出</span>
          </div>
          <van-loading v-show="sbLoading" />
        </div>
        <div
          class="wallet-ag-sports"
          :class="agIsMaintain ? 'wallet-maintain-bg' : ''"
        >
          <div><img :src="agSportIcon">AG真人钱包</div>
          <div>¥{{ priceToFixed(agWallet) }}</div>
          <div>
            <span @click="transferDialog(5, 1)">转入</span>
            <span>|</span>
            <span @click="transferDialog(5, 2)">转出</span>
          </div>
          <van-loading v-show="agLoading" />
        </div>
      </div>
    </div>
    <van-popup v-model:show="transferShow" @closed="onClose">
      <div class="transfer-show-header">
        <span>{{ transferType === 1 ? '转入' : '转出' }}金额</span>
      </div>
      <div class="transfer-show-main">
        <div class="transfer-show-main-text">
          {{ transferType === 1 ? '中心钱包' : titleHandling }}金额：
          <span>{{ transferType === 1 ? centerWallet : amountHandling }}</span>
        </div>
        <div class="transfer-show-main-input">
          <van-field
            v-model="transferAmount"
            type="number"
            autocomplete="off"
            maxlength="12"
            :formatter="gameIndex === 4 ? priceFormatter0 : priceFormatter"
            placeholder="请输入转账金额"
            @change="transferAmountChange(+transferAmount, +transferType === 1 ? +centerWallet : +amountHandling)"
          />
        </div>
        <div class="transfer-show-main-all">
          <span @click="allAmountHandling">全部金额</span>
        </div>
      </div>
      <div class="transfer-show-footer">
        <span @click.stop="transferHide">取消</span>
        <span
          v-if="walletButtonDialogType"
          @click.stop="transferConfirm"
        >确定</span>
        <span v-else>确定</span>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onActivated, ref } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '@/components/SvgIcon/index.vue'
import {
  getCenterBalance,
  getTripartiteBalance,
  tripartiteToMainWallet,
  mainToTripartiteWallet,
  balanceRecovery
} from '@/api/wallet.js'
import { Toast } from 'vant'
import { priceToFixed, priceFormatter, priceFormatter0 } from '@/utils/index.js'

export default defineComponent({
  components: { SvgIcon },
  setup() {
    /**
     * 使用路由
     */
    const router = useRouter()
    /**
     * 转账弹窗状态
     */
    const transferShow = ref(false)
    /**
     * 转账金额
     */
    const transferAmount = ref('')
    /**
     * ia电竞钱包余额
     */
    const iaWallet = ref('')
    /**
     * 小艾体育钱包余额
     */
    const sbWallet = ref('')
    /**
     * 平博体育钱包余额
     */
    const pbWallet = ref('')
    /**
     * ag真人钱包余额
     */
    const agWallet = ref('')
    /**
     * 小金体育钱余额
     */
    const xjWallet = ref('')
    /**
     * 中心钱包余额
     */
    const centerWallet = ref('')
    /**
     * ia电竞钱包状态
     */
    const iaWalletStatus = ref(false)
    /**
     * 小艾体育钱包状态
     */
    const sbWalletStatus = ref(false)
    /**
     * 平博体育钱包状态
     */
    const pbWalletStatus = ref(false)
    /**
     * 小金体育钱包状态
     */
    const xjWalletStatus = ref(false)
    /**
     * ag真人钱包状态
     */
    const agWalletStatus = ref(false)
    /**
     * 游戏钱包index
     */
    const gameIndex = ref(0)
    /**
     * 转账类型
     */
    const transferType = ref(0)
    /**
     * 弹窗确定按钮是否可以点击
     */
    const walletButtonDialogType = ref(true)
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
    const iaSportIcon = require('@/assets/wallet/wallet-icon1.png')
    const pbSportIcon = require('@/assets/wallet/wallet-icon2.png')
    const sbSportIcon = require('@/assets/wallet/wallet-icon3.png')
    const xjSportIcon = require('@/assets/wallet/wallet-icon4.png')
    const agSportIcon = require('@/assets/wallet/wallet-icon5.png')
    const iaLoading = ref(false)
    const xjLoading = ref(false)
    const sbLoading = ref(false)
    const pbLoading = ref(false)
    const agLoading = ref(false)
    const recyclingLoading = ref(true)
    /**
     * 跳转到充值界面
     */
    const goRecharge = () => {
      router.push({ name: 'Recharge', query: { wallet: 1 }})
    }
    /**
     * 跳转到提现界面
     */
    const goWithdraw = () => {
      router.push({ name: 'Withdraw', query: { wallet: 1 }})
    }
    /**
     * 转账弹窗
     */
    const transferDialog = (index: number, type: number) => {
      if (iaWalletStatus.value && index === 1) {
        return Toast('小艾电竞钱包异常')
      }
      if (sbWalletStatus.value && index === 2) {
        return Toast('沙巴体育钱包异常')
      }
      if (pbWalletStatus.value && index === 3) {
        return Toast('平博体育钱包异常')
      }
      if (xjWalletStatus.value && index === 3) {
        return Toast('小艾体育钱包异常')
      }
      transferShow.value = true
      walletButtonDialogType.value = true
      gameIndex.value = index
      transferType.value = type
    }
    /**
     * 三方转账确定
     */
    const transferConfirm = async() => {
      if (+transferAmount.value <= 0) return Toast.fail('转账金额不能为空')
      if (walletButtonDialogType.value) {
        walletButtonDialogType.value = false
        transferShow.value = false
        const params = {
          game_id: gameIndex.value,
          amount: transferAmount.value
        }
        if (transferType.value === 1) {
          mainToTripartiteWallet(params).then((res: any) => {
            if (+res.code === 1) {
              Toast.success({
                message: '转入成功',
                duration: 2000
              })
              getAloneGameSportWallet(gameIndex.value)
              setTimeout(() => {
                walletButtonDialogType.value = true
              }, 500)
            }
          }).catch((err: any) => {
            Toast.fail(err.msg || err.message)
          })
          // const data = await mainToTripartiteWallet(params)
          // if (Number(data.code) === 1) {
          //   Toast.success({
          //     message: '转入成功',
          //     duration: 2000
          //   })
          //   await getAloneGameSportWallet(gameIndex.value)
          // }
          // setTimeout(() => {
          //   walletButtonDialogType.value = true
          // }, 500)
        } else {
          tripartiteToMainWallet(params).then((res: any) => {
            if (+res.code === 1) {
              Toast.success({
                message: '转出成功',
                duration: 2000
              })
              getAloneGameSportWallet(gameIndex.value)
              setTimeout(() => {
                walletButtonDialogType.value = true
              }, 500)
            }
          }).catch((err: any) => {
            Toast.fail(err.msg || err.message)
          })
          // const data = await tripartiteToMainWallet(params)
          // if (Number(data.code) === 1) {
          //   Toast.success({
          //     message: '转出成功',
          //     duration: 2000
          //   })
          //   await getAloneGameSportWallet(gameIndex.value)
          // }
          // setTimeout(() => {
          //   walletButtonDialogType.value = true
          // }, 500)
        }
      }
    }
    /**
     * 三方转账取消
     */
    const transferHide = () => {
      transferShow.value = false
    }
    /**
     * 获取游戏钱包余额
     */
    const getGameSportWallet = async() => {
      iaLoading.value = true
      sbLoading.value = true
      pbLoading.value = true
      xjLoading.value = true
      agLoading.value = true
      getTripartiteBalance({ game_id: 1 })
        .then((res: any) => {
          iaWalletStatus.value = false
          iaIsMaintain.value = false
          if (+res.code === 1) {
            iaWallet.value = res.data.amount
            iaLoading.value = false
          }
        })
        .catch((err: any) => {
          if (+err.code === 60002) {
            iaIsMaintain.value = true
          }
          if (+err.code === 50005 || +err.code === 50009 || +err.code === 50014) {
            iaWalletStatus.value = true
            iaWallet.value = '--'
          }
          iaLoading.value = false
        })
      getTripartiteBalance({ game_id: 2 })
        .then((res: any) => {
          sbIsMaintain.value = false
          sbWalletStatus.value = false
          if (+res.code === 1) {
            sbWallet.value = res.data.amount
            sbLoading.value = false
          }
        })
        .catch((err: any) => {
          if (+err.code === 60002) {
            sbIsMaintain.value = true
          }
          if (+err.code === 50005 || +err.code === 50009 || +err.code === 50014) {
            sbWalletStatus.value = true
            sbWallet.value = '--'
          }
          sbLoading.value = false
        })
      getTripartiteBalance({ game_id: 3 })
        .then((res: any) => {
          pbIsMaintain.value = false
          pbWalletStatus.value = false
          if (+res.code === 1) {
            pbWallet.value = res.data.amount
            pbLoading.value = false
          }
        })
        .catch((err: any) => {
          if (+err.code === 60002) {
            pbIsMaintain.value = true
          }
          if (+err.code === 50005 || +err.code === 50009 || +err.code === 50014) {
            pbWalletStatus.value = true
            pbWallet.value = '--'
          }
          pbLoading.value = false
        })
      getTripartiteBalance({ game_id: 4 })
        .then((res: any) => {
          xjIsMaintain.value = false
          xjWalletStatus.value = false
          if (+res.code === 1) {
            xjWallet.value = res.data.amount
            xjLoading.value = false
          }
        })
        .catch((err: any) => {
          if (+err.code === 60002) {
            xjIsMaintain.value = true
          }
          if (+err.code === 50005 || +err.code === 50009 || +err.code === 50014) {
            xjWalletStatus.value = true
            xjWallet.value = '--'
          }
          xjLoading.value = false
        })
      getTripartiteBalance({ game_id: 5 })
        .then((res: any) => {
          agIsMaintain.value = false
          agWalletStatus.value = false
          if (+res.code === 1) {
            agWallet.value = res.data.amount
            agLoading.value = false
          }
        })
        .catch((err: any) => {
          if (+err.code === 60002) {
            agIsMaintain.value = true
          }
          if (+err.code === 50005 || +err.code === 50009 || +err.code === 50014) {
            agWalletStatus.value = true
            agWallet.value = '--'
          }
          agLoading.value = false
        })
    }
    /**
     * 获取单独游戏钱包余额
     */
    const getAloneGameSportWallet = async(index: number) => {
      const walletPrice = await getTripartiteBalance({ game_id: index })
      if (Number(walletPrice.code) === 1) {
        if (index === 1) {
          iaWallet.value = walletPrice.data.amount
        } else if (index === 2) {
          sbWallet.value = walletPrice.data.amount
        } else if (index === 3) {
          pbWallet.value = walletPrice.data.amount
        } else if (index === 4) {
          xjWallet.value = walletPrice.data.amount
        } else {
          agWallet.value = walletPrice.data.amount
        }
        await getCenterWallet()
      }
    }
    /**
     * 获取中心钱包余额
     */
    const getCenterWallet = async() => {
      const amount1 = await getCenterBalance()
      if (Number(amount1.code) === 1) {
        centerWallet.value = amount1.data.amount
      }
    }
    /**
     * 游戏钱包合计
     */
    const gameWalletTotal = computed(() => {
      let total = 0
      if (+iaWallet.value >= 0) {
        total += +iaWallet.value * 100
      }
      if (+sbWallet.value >= 0) {
        total += +sbWallet.value * 100
      }
      if (+pbWallet.value >= 0) {
        total += +pbWallet.value * 100
      }
      if (+xjWallet.value >= 0) {
        total += +xjWallet.value * 100
      }
      if (+agWallet.value >= 0) {
        total += +agWallet.value * 100
      }
      return total / 100
    })
    /**
     * 总金额合计
     */
    const allAmountTotal = computed(() => {
      return (
        (gameWalletTotal.value * 100 + Number(centerWallet.value) * 100) / 100
      )
    })
    /**
     * 标题处理
     */
    const titleHandling = computed(() => {
      if (gameIndex.value === 1) {
        return '小艾电竞钱包'
      } else if (gameIndex.value === 2) {
        return '沙巴体育钱包'
      } else if (gameIndex.value === 3) {
        return '平博体育钱包'
      } else if (gameIndex.value === 4) {
        return '小艾体育钱包'
      } else {
        return 'AG真人钱包'
      }
    })
    /**
     * 一键回收
     */
    const oneClickRecycling = async() => {
      if (recyclingLoading.value) {
        recyclingLoading.value = false
        await balanceRecovery().then((res: any) => {
          if (+res.code === 1) {
            init()
            Toast.success('回收成功')
            setTimeout(() => {
              recyclingLoading.value = true
            }, 2000)
          }
        }).catch((err: any) => {
          Toast.fail(err.msg || err.message)
          setTimeout(() => {
            recyclingLoading.value = true
          }, 2000)
        })
      }
    }
    /**
     * 游戏余额处理
     */
    const amountHandling = computed(() => {
      if (gameIndex.value === 1) {
        return iaWallet.value
      } else if (gameIndex.value === 2) {
        return sbWallet.value
      } else if (gameIndex.value === 3) {
        return pbWallet.value
      } else if (gameIndex.value === 4) {
        return xjWallet.value
      } else {
        return agWallet.value
      }
    })
    /**
     * 全部金额处理
     */
    const allAmountHandling = () => {
      if (transferType.value === 1) {
        transferAmount.value = String(centerWallet.value)
      } else {
        if (gameIndex.value === 1) {
          transferAmount.value = String(iaWallet.value)
        } else if (gameIndex.value === 2) {
          transferAmount.value = String(sbWallet.value)
        } else if (gameIndex.value === 3) {
          transferAmount.value = String(pbWallet.value)
        } else if (gameIndex.value === 4) {
          transferAmount.value = String(xjWallet.value)
        } else {
          transferAmount.value = String(agWallet.value)
        }
      }
    }

    const transferAmountChange = (price: number, total: number) => {
      if (price >= total) {
        transferAmount.value = total + ''
      }
    }
    /**
     * 弹窗关闭触发
     */
    const onClose = () => {
      transferAmount.value = ''
    }

    const loading = ref(false)
    /**
     * 初始化
     */
    const init = async() => {
      loading.value = true
      await getGameSportWallet()
      await getCenterWallet()
      setTimeout(() => {
        loading.value = false
      }, 1800)
    }
    onActivated(async() => {
      await getGameSportWallet()
      await getCenterWallet()
    })
    return {
      transferAmountChange,
      goRecharge,
      goWithdraw,
      transferDialog,
      transferShow,
      transferAmount,
      transferConfirm,
      transferHide,
      getGameSportWallet,
      getCenterWallet,
      getAloneGameSportWallet,
      priceFormatter,
      iaWallet,
      sbWallet,
      pbWallet,
      xjWallet,
      agWallet,
      centerWallet,
      gameIndex,
      transferType,
      gameWalletTotal,
      allAmountTotal,
      iaWalletStatus,
      sbWalletStatus,
      pbWalletStatus,
      xjWalletStatus,
      agWalletStatus,
      priceToFixed,
      init,
      titleHandling,
      amountHandling,
      walletButtonDialogType,
      iaIsMaintain,
      sbIsMaintain,
      pbIsMaintain,
      xjIsMaintain,
      agIsMaintain,
      onClose,
      allAmountHandling,
      oneClickRecycling,
      loading,
      xjSportIcon,
      iaSportIcon,
      pbSportIcon,
      sbSportIcon,
      agSportIcon,
      iaLoading,
      xjLoading,
      pbLoading,
      sbLoading,
      agLoading,
      recyclingLoading,
      priceFormatter0
    }
  }
})
</script>

<style lang="less" scoped>
.v-wallet-cell {
  // margin: 48px 15px 25px 15px;
  width: calc(100% - 30px);
  margin: 48px auto 25px;
  &-header {
    display: flex;
    height: 30px;
    align-items: center;
    padding: 0 5px;
    justify-content: space-between;
    span {
      color: #fff;
    }
    .price-loading {
      animation: rotating 2s infinite;
    }
    @keyframes rotating{
      0% {
        transform: rotate(0) translate3d(0, 0, 0);
      }
      100% {
        transform: rotate(360deg) translate3d(0, 0, 0);
      }
    }
  }
  &-total {
    display: flex;
    margin-top: 18px;
    width: 100%;
    height: 150px;
    border-radius: 12px;
    background-image: url('../../../../../assets/wallet/wallet-bg-glass.webp');
    background-size: 100%;
    background-repeat: no-repeat;
    background-color: #2d363d;
    color: #fff;
    flex-direction: column;
    &-t {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 87px;
      .t-main-header {
        display: flex;
        align-items: center;
        div {
          display: flex;
          flex: 1 0 50%;
          height: 30px;
          align-items: center;
        }
        div:nth-child(1) {
          flex: 1 0 calc(50% - 20px);
          padding-left: 20px;
          span {
            margin-left: 5px;
          }
        }
        div:nth-child(2) {
          span {
            display: flex;
            width: 71px;
            height: 26px;
            line-height: 26px;
            justify-content: center;
            border-radius: 13px;
            font-size: 13px;
          }
          span:nth-child(1) {
            border: 1px solid #fff;
          }
          span:nth-child(2) {
            background: rgba(255, 255, 255, 0.3);
            margin-left: 10px;
          }
        }
      }
      .t-main-number {
        display: flex;
        height: 30px;
        align-items: center;
        padding-left: 20px;
        span {
          font-size: 24px;
          font-weight: bold;
        }
      }
    }
    &-b {
      display: flex;
      align-items: center;
      height: 62px;
      .b-main-left {
        display: flex;
        flex-direction: column;
        width: calc(35% - 20px);
        padding-left: 20px;
        span:nth-child(1) {
          font-size: 12px;
        }
        span:nth-child(2) {
          font-size: 15px;
          font-weight: bold;
          margin-top: 5px;
        }
      }
      .b-main-center {
        display: flex;
        width: 30%;
        span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 78px;
          height: 27px;
          border-radius: 13px;
          border: 1px solid #0cd1ba;
          font-size: 12px;
        }
      }
      .b-main-right {
        display: flex;
        flex-direction: column;
        width: 35%;
        span:nth-child(1) {
          font-size: 12px;
        }
        span:nth-child(2) {
          font-size: 15px;
          font-weight: bold;
          margin-top: 5px;
        }
      }
    }
  }
  &-game {
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    color: #fff;
    &-title {
      display: flex;
      height: 40px;
      align-items: center;
    }
    &-main {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      :deep(.van-loading) {
        position: absolute;
        top:50%;
        left:50%;
        transform:translate(-50%, -50%);
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, .4);
      }
      .wallet-ia-sports {
        display: flex;
        flex-direction: column;
        //flex: 1;
        width: calc(50% - 5px);
        height: 100px;
        background-image: url('../../../../../assets/wallet/wallet-icon-bg1.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-bottom: 10px;
      }
      .wallet-sb-sports {
        display: flex;
        flex-direction: column;
        //flex: 1;
        width: calc(50% - 5px);
        height: 100px;
        background-image: url('../../../../../assets/wallet/wallet-icon-bg2.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-bottom: 10px;
      }
      .wallet-pb-sports {
        display: flex;
        flex-direction: column;
        width: calc(50% - 5px);
        height: 100px;
        background-image: url('../../../../../assets/wallet/wallet-icon-bg3.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .wallet-xj-sports {
        display: flex;
        flex-direction: column;
        //flex: 1;
        width: calc(50% - 5px);
        height: 100px;
        background-image: url('../../../../../assets/wallet/wallet-icon-bg4.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .wallet-ag-sports {
        display: flex;
        flex-direction: column;
        width: calc(50% - 5px);
        height: 100px;
        background-image: url('../../../../../assets/wallet/wallet-icon-bg5.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-bottom: 10px;
      }
      .wallet-ia-sports,
      .wallet-sb-sports,
      .wallet-pb-sports,
      .wallet-xj-sports,
      .wallet-ag-sports{
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        div {
          display: flex;
        }
        div:nth-child(1) {
          height: 30px;
          line-height: 36px;
          //align-items: center;
          margin-left: 13px;
          font-size: 14px;
          img {
            width: 22px;
            height: 22px;
            margin-right: 5px;
            margin-top: 7px;
          }
        }
        div:nth-child(2) {
          height: 30px;
          margin-left: 13px;
          font-size: 18px;
          font-weight: bold;
          text-indent: 27px;
        }
        div:nth-child(3) {
          height: 40px;
          align-items: center;
          span:nth-child(1),
          span:nth-child(3) {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 49%;
            font-size: 13px;
          }
          span:nth-child(2) {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 2%;
            font-size: 13px;
          }
        }
        :deep(.van-loading) {
          background: rgba(0, 0, 0, 0);
          padding-left: 260px;
          padding-top: 18px;
          justify-content: flex-start;
          align-items: flex-start;
          color: #fff;
        }
        :deep(.van-loading__spinner) {
          width: 20px;
          height: 20px;
        }
      }
      .wallet-maintain-bg::before {
        content: '维护中';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: url('../../../../../assets/wallet/wallet-maintain.png')
          rgba(0, 0, 0, 0.8) no-repeat;
        background-position-x: center;
        background-position-y: 30px;
        background-size: 24px 25px;
        text-align: center;
        padding-top: 60px;
        font-size: 12px;
      }
    }
  }
  :deep(.van-popup) {
    width: 70%;
    border-radius: 5px;
    background-color: #2d363d;
  }
  .transfer-show-header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
    background-color: #3e4a53;
    color: #fff;
    font-size: 14px;
  }
  .transfer-show-main {
    display: flex;
    flex-direction: column;
    width: calc(100% - 30px);
    padding: 0 15px;
    &-text {
      display: flex;
      align-items: center;
      height: 60px;
      color: #fff;
      font-size: 12px;
    }
    &-input {
      display: flex;
      height: 40px;
      :deep(.van-cell) {
        display: flex;
        align-items: center;
        height: 40px;
        background-color: #3e4a53;
        border-radius: 8px;
        input {
          color: #fff;
        }
      }
      ::placeholder {
        color: #707d88;
        font-size: 12px;
      }
    }
    &-all {
      display: flex;
      height: 40px;
      align-items: center;
      justify-content: flex-end;
      span {
        font-size: 12px;
        color: transparent;
        background-image: linear-gradient(to right, #12dedf, #07c79c),
          linear-gradient(to bottom, #8f9fab, #8f9fab);
        background-clip: text;
        -webkit-background-clip: text;
      }
    }
  }
  .transfer-show-footer {
    display: flex;
    height: 40px;
    span {
      display: flex;
      flex: 1 0 50%;
      align-items: center;
      justify-content: center;
    }
    span:nth-child(1) {
      background-color: #3e4a53;
      color: #94a5b1;
      font-size: 14px;
    }
    span:nth-child(2) {
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      font-size: 14px;
      color: #1a242c;
    }
  }
}
</style>
