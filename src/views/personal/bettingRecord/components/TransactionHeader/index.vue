<template>
  <div class="v-header">
    <div class="v-header-l">
      <svg-icon class="personal-menu" icon-class="user-back" @click="goBack" />
    </div>
    <div class="v-header-m">
      {{ routeTitle }}
    </div>
    <div v-if="showFilter" class="v-header-r">
      <span @click="goFilter(true)">筛选</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useCurrentInstance from '@/hooks/useCurrentInstance'

export default defineComponent({
  props: {
    bulletinStatus: {
      type: Number,
      default: 1
    },
    showFilter: {
      type: Boolean,
      default: true
    }
  },
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
     * 获取挂载在全局的属性和获取上下文
     */
    const { proxy }: any = useCurrentInstance()
    /**
     * 编辑、完成状态
     */
    const editText = ref(false)
    /**
     * 返回
     */
    const goBack = () => {
      router.go(-1)
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
     * 筛选
     */
    const goFilter = (val: boolean) => {
      proxy.mittBus.emit('transactionFilter', val)
    }
    /**
     * 初始化
     */
    onMounted(() => {
      // console.log(route.meta.title)
    })
    return {
      goBack,
      routeTitle,
      routeName,
      editText,
      goFilter
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/styles/home/header/index.less';
</style>
