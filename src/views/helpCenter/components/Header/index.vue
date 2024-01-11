<template>
  <div class="help-header">
    <div @click.stop="pathChange"><van-icon name="arrow-left" /></div>
    <div>{{ title }}</div>
    <div></div>
  </div>
</template>

<script lang="ts">
import webViewBridgeHook from '@/hooks/webViewBridge'
import { computed, defineComponent, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'HelpHeader',
  props: {
    title: {
      type: String,
      default: '帮助中心'
    },
    child: { type: Boolean, default: false }
  },
  setup(props) {
    const { routeGo } = webViewBridgeHook()

    const route = useRoute()

    const showHeader = computed(() => {
      return !route.query.device
    })

    const router = useRouter()

    const { proxy } = getCurrentInstance() as any

    function pathChange() {
      if (props.child) {
        if (route.query.accountType) {
          routeGo('CloseH5')
          return router.go(-1)
        }
      } else {
        routeGo('CloseH5')
        return router.push({ name: 'Personal' })
      }
      proxy.mittBus.emit('closeHelp', false)
    }

    return { pathChange, showHeader }
  }
})
</script>

<style lang="less" scoped>
.help-header {
  height: 48px;
  width: 100%;
  position: fixed;
  top: 0;
  color: #fff;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // font-weight: bold;
  background-color: #1c2227;
  z-index: 1000;
  > div {
    margin: 0 15px;
  }
}
:deep(.van-icon) {
  font-size: 20px !important;
}
</style>
