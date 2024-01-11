<template>
  <div class="v-information">
    <!--    <Header />-->
    <WalletCell />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import Header from '@/views/home/components/Header/index.vue'
import WalletCell from './components/WalletCell/index.vue'

export default defineComponent({
  name: 'Wallet',
  components: {
    // Header,
    WalletCell
  },
  setup() {
    return {}
  }
})
</script>

<style lang="less" scoped>
.v-information {
  background-image: url('../../../assets/wallet/wallet-bg.webp');
  background-size: 100%;
  background-repeat: no-repeat;
}
</style>
