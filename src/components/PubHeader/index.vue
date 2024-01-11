<template>
  <div :key="routeTitle" class="v-header">
    <div class="v-header-l">
      <svg-icon class="personal-menu" icon-class="user-back" @click="goBack" />
    </div>
    <transition name="van-fade" appear>
      <div class="v-header-m">
        {{ headerTitle ? headerTitle + routeTitle : '' + routeTitle }}
      </div>
    </transition>
    <div v-if="rightIcon" class="v-header-r">
      <span
        v-if="routeName === 'EditNickname' || 'EditAvatar'"
        @click="saveNickname"
      >保存</span>
      <svg-icon
        v-else
        class="home-customer-service"
        icon-class="home-customer-service"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useCurrentInstance from '@/hooks/useCurrentInstance'

export default defineComponent({
  props: {
    rightIcon: {
      type: Boolean,
      default: true
    },
    headerTitle: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    /**
     * 获取挂载在全局的属性和获取上下文
     */
    const { proxy } = useCurrentInstance()
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
      if (props.path) return router.push({ name: props.path })
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
     * 修改昵称/头像
     */
    const saveNickname = () => {
      proxy.mittBus.emit('updateAvatar-bus', routeName)
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
      saveNickname
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/styles/home/header/index.less';
</style>
