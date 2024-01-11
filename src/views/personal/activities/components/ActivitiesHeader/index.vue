<template>
  <div class="v-header v-bulletin-header">
    <div class="v-header-l">
      <svg-icon class="personal-menu" icon-class="user-back" @click="goBack" />
    </div>
    <div class="v-header-m">
      {{ routeTitle }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    /**
     * 获取路由
     */
    const route = useRoute()
    /**
     * 使用路由
     */
    const router = useRouter()
    /**
     * 返回
     */
    const goBack = () => {
      if (getQuery.value) {
        router.push({ name: 'Home' })
      } else {
        router.push({ name: 'Personal' })
      }
    }
    /**
     * 获取路由标题
     */
    const routeTitle = computed(() => {
      return route.meta.title
    })
    /**
     * 获取query参数
     */
    const getQuery = computed(() => {
      return route.query.name
    })
    /**
     * 获取路由Name
     */
    const routeName = computed(() => {
      return route.name
    })

    return {
      goBack,
      routeTitle,
      getQuery,
      routeName
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/styles/home/header/index.less';
</style>
