<template>
  <div class="v-benefits">
    <div
      class="v-benefits-text v-benefits-deposit"
      @click="goPath('Recharge')"
    >
      <img :src="depositIcon">
      <span>存款</span>
    </div>
    <div
      class="v-benefits-text v-benefits-withdraw"
      @click="goPath('Withdraw')"
    >
      <img :src="withdrawIcon">
      <span>取款</span>
    </div>
    <div
      class="v-benefits-text v-benefits-transfer"
      @click="goPath('Transfer')"
    >
      <img :src="transferIcon">
      <span>转账</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    /**
     * 存款图标
     */
    const depositIcon = require('@/assets/personal/deposit-icon.png')
    /**
     * 取款图标
     */
    const withdrawIcon = require('@/assets/personal/withdraw-icon.png')
    /**
     * 转账图标
     */
    const transferIcon = require('@/assets/personal/transfer-icon.png')
    /**
     * 路由跳转
     */
    const goPath = (row: string) => {
      router.push({ name: row, query: { personal: 1 }})
    }
    return {
      depositIcon,
      withdrawIcon,
      transferIcon,
      goPath
    }
  }
})
</script>

<style lang="less" scoped>
.v-benefits {
  display: flex;
  height: 40px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 0 5px 10px 5px;
  justify-content: space-between;
  align-items: center;
  &-text {
    display: flex;
    flex: 1;
    height: 22px;
    line-height: 22px;
    align-items: center;
    span {
      margin-left: 8px;
      font-size: 13px;
      color: #fff;
    }
  }
  &-deposit {
    padding-left: 10px;
    img {
      width: 29px;
    }
  }
  &-withdraw {
    justify-content: center;
    img {
      width: 24px;
    }
  }
  &-transfer {
    padding-right: 10px;
    justify-content: flex-end;
    img {
      width: 28px;
    }
  }
}
</style>
