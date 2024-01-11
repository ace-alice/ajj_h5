<template>
  <div class="v-account-receivable">
    <AccountHeader />
    <div class="v-account-receivable-main">
      <div
        v-for="item in accountTabsList"
        :key="item.component"
        :class="accountTabsActive == item.component ? 'account-active' : ''"
        @click="accountChange(item)"
      >
        {{ item.title }}
      </div>
    </div>
    <component :is="accountTabsActive" :key="accountTabsActive" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import AccountHeader from './components/AccountHeader/index.vue'
import { useRoute } from 'vue-router'
import BankList from './components/BankList/index.vue'
import UsdtList from './components/UsdtList/index.vue'

export default defineComponent({
  components: {
    AccountHeader,
    BankList,
    UsdtList
  },
  setup() {
    const route = useRoute()
    /**
     * 银行卡、虚拟币默认选中
     */
    const accountTabsActive = ref(route.query.name || 'bank-list')

    const state = reactive({
      /**
       * 公告列表
       */
      accountTabsList: [
        {
          id: 1,
          title: '银行卡',
          component: 'bank-list'
        },
        {
          id: 2,
          title: '虚拟币',
          component: 'usdt-list'
        }
      ]
    })
    /**
     * 银行卡、虚拟币切换事件
     * @param row
     */
    const accountChange = (row: any) => {
      accountTabsActive.value = row.component
    }

    return {
      ...toRefs(state),
      accountTabsActive,
      accountChange
    }
  }
})
</script>

<style lang="less" scoped>
.v-account-receivable {
  &-main {
    position: fixed;
    top: 48px;
    height: 40px;
    width: calc(100% - 30px);
    left: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      height: 30px;
      width: calc(50% - 8px);
      text-align: center;
      line-height: 30px;
      background-color: #3e4a53;
      border-radius: 15px;
      color: #b6c1cb;
      font-size: 12px;
    }
    .account-active {
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      color: #fff;
    }
  }
}
</style>
