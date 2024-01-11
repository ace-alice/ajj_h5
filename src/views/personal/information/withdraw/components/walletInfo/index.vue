<template>
  <div class="wallet-information-price">
    <div>
      <span>中心钱包</span>
      <span>¥{{ priceToFixed(centerWallet) }}</span>
    </div>
    <div>
      <span @click="oneClickRecycling">一键回收</span>
    </div>
    <div>
      <span>场馆钱包合计</span>
      <span>¥{{ priceToFixed(gameWalletTotal) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { balanceRecovery, getCenterBalance, getTripartiteBalance } from '@/api/wallet.js'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import { priceToFixed } from '@/utils/index.js'
import { Toast } from 'vant';

export default defineComponent({
  setup() {
    /**
     * 获取挂载在全局的属性和获取上下文
     */
    const { proxy } = useCurrentInstance()
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
    /**
     * 小金体育钱包余额
     */
    const xjWallet = ref(0)
    /**
     * ag真人钱包余额
     */
    const agWallet = ref(0)
    /**
     * 中心钱包余额
     */
    const centerWallet = ref(0)
    /**
     * 游戏钱包总余额
     */
    const allGameWallet = ref(0)
    /**
     * 获取游戏钱包余额
     */
    const getGameSportWallet = async() => {
      getTripartiteBalance({ game_id: 1 }).then((res: any) => {
        if (+res.code === 1) {
          iaWallet.value = +res.data.amount
        }
      })
      getTripartiteBalance({ game_id: 2 }).then((res: any) => {
        if (+res.code === 1) {
          sbWallet.value = +res.data.amount
        }
      })
      getTripartiteBalance({ game_id: 3 }).then((res: any) => {
        if (+res.code === 1) {
          pbWallet.value = +res.data.amount
        }
      })
      getTripartiteBalance({ game_id: 4 }).then((res: any) => {
        if (+res.code === 1) {
          xjWallet.value = +res.data.amount
        }
      })
      getTripartiteBalance({ game_id: 5 }).then((res: any) => {
        if (+res.code === 1) {
          agWallet.value = +res.data.amount
        }
      })
    }
    /**
     * 获取中心钱包余额
     */
    const getCenterWallet = async() => {
      const amount1 = await getCenterBalance()
      if (Number(amount1.code) === 1) {
        centerWallet.value = +amount1.data.amount
        proxy.mittBus.emit('center-wallet', centerWallet.value)
      }
    }
    /**
     * 游戏钱包合计
     */
    const gameWalletTotal = computed(() => {
      return iaWallet.value + sbWallet.value + pbWallet.value + xjWallet.value + agWallet.value
    })
    /**
     * 一键回收
     */
    const oneClickRecycling = async() => {
      const data = await balanceRecovery()
      if (Number(data.code) === 1) {
        await init()
      }
    }
    /**
     * 初始化
     */
    const init = async() => {
      await getGameSportWallet()
      await getCenterWallet()
    }
    onMounted(async() => {
      await init()
    })
    return {
      centerWallet,
      iaWallet,
      sbWallet,
      pbWallet,
      xjWallet,
      agWallet,
      allGameWallet,
      getGameSportWallet,
      getCenterWallet,
      gameWalletTotal,
      init,
      oneClickRecycling,
      priceToFixed
    }
  }
})
</script>

<style lang="less" scoped>
.wallet-information-price {
  display: flex;
  align-items: center;
  width: calc(100% - 22px);
  padding-left: 22px;
  height: 64px;
  border-radius: 8px;
  background-color: #2d363d;
  color: #fff;
  div {
    display: flex;
    flex-direction: column;
  }
  div:nth-child(1) {
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
  div:nth-child(2) {
    width: 30%;
    span {
      display: flex;
      width: 76px;
      height: 26px;
      line-height: 28px;
      justify-content: center;
      border: 1px solid #0cd1ba;
      border-radius: 14px;
      font-size: 12px;
    }
  }
  div:nth-child(3) {
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
</style>
