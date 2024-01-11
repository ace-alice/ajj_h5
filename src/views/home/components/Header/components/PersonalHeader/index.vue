<template>
  <div class="v-header">
    <div class="v-header-l" />
    <div class="v-header-m">
      {{ routeTitle }}
    </div>
    <div class="v-header-r">
      <svg-icon
        v-if="routeName == 'Wallet'"
        class="personal-edit"
        icon-class="personal-transfer-record"
      />
      <svg-icon
        v-if="routeName == 'Personal'"
        class="personal-edit"
        icon-class="personal-edit"
        @click="goPath('PersonalInfo')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useCurrentInstance from '@/hooks/useCurrentInstance'

export default defineComponent({
  setup() {
    /**
     * 获取挂载在全局的属性和获取上下文
     */
    const { proxy } = useCurrentInstance()
    /**
     * 使用路由
     */
    const route = useRoute()
    const router = useRouter()
    /**
     * 菜单点击事件
     */
    const menuClick = () => {
      proxy.mittBus.emit('homeMenu', true)
    }
    /**
     * 获取路由标题
     */
    const routeTitle = computed(() => {
      return route.meta.title
    })
    /**
     * 获取路由Name
     */
    const routeName = computed(() => {
      return route.name
    })
    /**
     * 路由跳转
     */
    const goPath = (row: string) => {
      router.push({ name: row })
    }
    /**
     * 初始化
     */
    onMounted(() => {
      // console.log(route.meta.title)
    })
    return {
      menuClick,
      routeTitle,
      routeName,
      goPath
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/styles/home/header/index.less';
</style>
