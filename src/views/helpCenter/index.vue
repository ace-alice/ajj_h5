<template>
  <div class="help-center">
    <HelpHeader title="帮助中心" />
    <!--    v-if="!isDevice"-->
    <!--    :class="{ marginType: isDevice }"-->
    <div class="box-group">
      <div
        v-for="help in helpLists"
        :key="help.code"
        class="box-item"
        @click.stop="showHelpBox(help)"
      >
        <div>{{ help.name }}</div>
        <div class="icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <van-popup
      v-model:show="showComponent"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <component
        :is="currentComponent"
        v-if="showComponent"
        :key="currentComponent"
        @closeHelp="showComponent = false"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref
} from 'vue'
import { useRoute } from 'vue-router'
import HelpHeader from './components/Header/index.vue'
import HowRegister from './components/HowRegister/index.vue'
import HowBindAccount from './components/HowBindAccount/index.vue'
import HowBet from './components/HowBet/index.vue'
import HowUpgradeVIP from './components/HowUpgradeVIP/index.vue'
import HowRetrievePassword from './components/HowRetrievePassword/index.vue'
import HowWithdrawal from './components/HowWithdrawal/index.vue'
import HowRecharge from './components/HowRecharge/index.vue'
import webViewBridgeHook from '@/hooks/webViewBridge'
import OtherQuestion from './components/OtherQuestion/index.vue'

export default defineComponent({
  name: 'HelpCenter',
  components: {
    HelpHeader,
    HowRegister,
    HowBindAccount,
    HowBet,
    HowUpgradeVIP,
    HowRetrievePassword,
    HowWithdrawal,
    HowRecharge,
    OtherQuestion
  },
  setup() {
    const route = useRoute()

    const { routeGo } = webViewBridgeHook()
    // console.log(route.query.accountType)
    const currentComponent = ref(
      route.query.accountType === '3'
        ? 'HowRecharge'
        : route.query.accountType
          ? 'HowWithdrawal'
          : ''
    )

    const showComponent = ref(!!route.query.accountType)

    const helpLists = [
      { name: '如何注册', code: 'HowRegister' },
      { name: '如何充值', code: 'HowRecharge' },
      { name: '如何提款', code: 'HowWithdrawal' },
      { name: '如何绑定虚拟币账户', code: 'HowBindAccount' },
      { name: '如何参与赛事投注', code: 'HowBet' },
      { name: '如何提升VIP等级', code: 'HowUpgradeVIP' },
      { name: '如何找回密码', code: 'HowRetrievePassword' },
      { name: '其他问题', code: 'OtherQuestion' }
    ]

    function showHelpBox(help: any) {
      currentComponent.value = help.code
      showComponent.value = true
    }

    const { proxy } :any = getCurrentInstance()

    const isDevice = computed(() => {
      return route.query.device || route.query.accountType
    })

    onMounted(() => {
      routeGo('HelpSuccess')
      proxy.mittBus.on('closeHelp', (value: boolean) => {
        showComponent.value = value
      })
    })

    onUnmounted(() => {
      proxy.mittBus.off('closeHelp')
    })

    return {
      helpLists,
      currentComponent,
      showComponent,
      showHelpBox,
      isDevice
    }
  }
})
</script>

<style lang="less" scoped>
.help-center {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;

  .marginType {
    margin: 10px auto 0 !important;
  }

  .box-group {
    width: calc(100% - 30px);

    margin: 48px auto 0;

    .box-item {
      width: 100%;
      height: 50px;
      border-radius: 4px;
      background-color: #2d363d;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      font-size: 14px;

      &:hover {
        background-color: #2c3942;
      }

      &:active {
        background-color: #23313a;
      }

      .icon {
        color: #94a5b1;
      }

      > div {
        margin: 0 15px;
        color: #fff;
      }

      & + .box-item {
        margin-top: 5px;
      }
    }
  }
}

:deep(.van-popup) {
  background: #1c2227 !important;
}
</style>
