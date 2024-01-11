<template>
  <div class="v-header">
    <div class="v-header-l">
      <svg-icon class="personal-menu" icon-class="user-back" @click="goBack" />
    </div>
    <div class="v-header-m">
      {{ routeTitle }}
    </div>
    <!-- <div class="v-header-r">
      <span>锁定</span>
    </div> -->
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
    const { proxy } = useCurrentInstance()
    /**
     * 编辑、完成状态
     */
    const editText = ref(false)
    /**
     * 返回
     */
    const goBack = () => {
      router.push({ name: 'Personal' })
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
     * 编辑
     */
    const bulletinEdit = (val: boolean) => {
      proxy.mittBus.emit('bulletinEdit', val)
      editText.value = val
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
      bulletinEdit
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/styles/home/header/index.less';
</style>
