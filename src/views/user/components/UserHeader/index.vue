<template>
  <div class="v-header">
    <div class="v-header-l">
      <svg-icon
        class="personal-menu"
        icon-class="user-back"
        @click="goPath()"
      />
    </div>
    <div class="v-header-r">
      <svg-icon
        class="home-customer-service"
        icon-class="home-customer-service"
        @click.stop="toPath"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()
    const routeName = computed(() => {
      return route.name
    })
    /**
     * 路由跳转
     */
    const goPath = () => {
      if (routeName.value === 'Register') {
        router.push({ name: 'Login' })
      } else {
        router.push({ name: 'Home' })
      }
    }

    function toPath() {
      router.push({ name: 'OnlineService' })
    }
    return {
      goPath,
      routeName,
      toPath
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/styles/home/header/index.less';
</style>
