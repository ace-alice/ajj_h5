<template>
  <div class="v-personal-currency" @click="goPath('Wallet')">
    <div class="v-personal-currency-col">
      <div class="v-personal-currency-col-info">
        <div>
          <svg-icon icon-class="personal-wallet1" />
          <span>中心钱包余额</span>
        </div>
        <div>
          <span>¥{{ userInfo.id ? priceToFixed(centerWallet) : '****' }}</span>
        </div>
      </div>
      <div class="v-personal-currency-col-button">
        <span>进入钱包</span>
        <svg-icon icon-class="personal-withdraw-right" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onActivated, ref } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import store from '@/store/index.js'
import { getCenterBalance } from '@/api/wallet.js'
import { useRouter } from 'vue-router'
import { priceToFixed } from '@/utils/index.js'

export default defineComponent({
  components: { SvgIcon },
  setup() {
    const userInfo = computed(() => store.getters.getUserInfo)
    const centerWallet = ref(0)
    const router = useRouter()
    /**
     * 获取中心钱包余额
     */
    const getCenterWallet = async() => {
      const amount1 = await getCenterBalance()
      if (Number(amount1.code) === 1) {
        centerWallet.value = +amount1.data.amount
      }
    }
    const goPath = (row: any) => {
      router.push({ name: row })
    }
    onActivated(() => {
      if (userInfo.value.id) {
        getCenterWallet()
      }
    })
    return {
      goPath,
      priceToFixed,
      userInfo,
      centerWallet,
      getCenterWallet
    }
  }
})
</script>

<style lang="less" scoped>
.v-personal-currency {
  display: flex;
  margin: 20px 0 10px 0;
  color: #fff;
  background-image: url('../../../../assets/personal/personal-icon.png');
  background-repeat: no-repeat;
  background-size: 100%;
  &-col {
    display: flex;
    width: calc(100% - 30px);
    height: 60px;
    border-radius: 8px;
    padding: 15px 10px;
    &-info {
      display: flex;
      flex: 1;
      padding-left: 30px;
      justify-content: center;
      flex-direction: column;
      div {
        display: flex;
        height: 26px;
        color: #dedff6;
        font-size: 13px;
      }
      div:nth-child(1) {
        span {
          margin-left: 5px;
        }
      }
      div:nth-child(2) {
        span {
          color: #fff;
          font-size: 24px;
          font-weight: bold;
        }
      }
    }
    &-button {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      color: #dedff6;
      font-size: 12px;
      span {
        display: flex;
        height: 20px;
        margin-right: 5px;
      }
    }
  }
}
</style>
