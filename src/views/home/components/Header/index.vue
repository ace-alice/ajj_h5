<template>
  <HomeHeader v-if="routerName == 'Home'" :class="{ hasBack: hasBack }" />
  <PersonalHeader v-if="['Personal', 'Wallet'].includes(routerName)" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import HomeHeader from './components/HomeHeader/index.vue'
import PersonalHeader from './components/PersonalHeader/index.vue'
import useCurrentInstance from '@/hooks/useCurrentInstance'

export default defineComponent({
  props: {
    hasBack: {
      type: Boolean,
      default: false
    }
  },
  components: {
    HomeHeader,
    PersonalHeader
  },
  setup() {
    /**
     * 获取挂载在全局的属性和获取上下文
     */
    const { proxy } = useCurrentInstance()
    /**
     * 使用路由
     */
    const router = useRouter()
    /**
     * 左侧菜单是否显示
     */
    const menuShow = ref(false)
    /**
     * 是否展示vip
     */
    const userInfoVip = ref(true)
    /**
     * 获取路由Name
     */
    const routerName = computed(() => {
      return router.currentRoute.value.name
    })

    onMounted(() => {
      /**
       * 接收菜单点击
       */
      proxy.mittBus.on('homeMenu', (val: boolean) => {
        // console.log(val)
        menuShow.value = val
      })
    })
    return {
      routerName,
      menuShow,
      userInfoVip
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/styles/home/header/index.less';
.hasBack {
  background-color: #1c2227;
}
</style>
