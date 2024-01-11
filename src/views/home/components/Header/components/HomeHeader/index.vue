<template>
  <div class="v-header">
    <div class="v-header-l">
      <!--      <svg-icon class="personal-menu" icon-class="personal-menu" @click="menuClick" />-->
      <!--      <svg-icon class="logo" icon-class="logo" />-->
      <img class="logo" :src="logo">
    </div>
    <div class="v-header-r">
      <van-badge :dot="stationLetterNum > 0">
        <svg-icon
          class="home-remind"
          icon-class="home-remind"
          @click="goPath('Bulletin')"
        />
      </van-badge>
      <svg-icon
        class="home-customer-service"
        icon-class="home-customer-service"
        @click="goPath('OnlineService')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, nextTick, onActivated } from 'vue'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import { useRouter } from 'vue-router'
import store from '@/store/index.js'
import { unRead } from '@/api/message.js'

export default defineComponent({
  setup() {
    const userInfo = computed(() => store.getters.getUserInfo)
    const logo = require('@/assets/home/logo.png')
    const stationLetterNum = ref(0)
    /**
     * 获取挂载在全局的属性和获取上下文
     */
    const { proxy } = useCurrentInstance()
    /**
     * 使用路由
     */
    const router = useRouter()
    /**
     * 菜单点击事件
     */
    const menuClick = () => {
      proxy.mittBus.emit('homeMenu', true)
    }
    /**
     * 是否有未读站内信
     */
    const getUnRead = async() => {
      const data = await unRead()
      if (+data.code === 1) {
        stationLetterNum.value = data.data.unread
      }
    }
    /**
     * 路由跳转
     */
    const goPath = (name: string) => {
      if (name === 'Bulletin') {
        if (userInfo.value.id) {
          router.push({ name: name, query: { name: 'letter-list' }})
        } else {
          router.push({ name: 'Login' })
        }
      } else {
        router.push({ name: name })
      }
    }
    onActivated(() => {
      nextTick(() => {
        if (userInfo.value.id) {
          getUnRead()
        }
      })
    })
    return {
      menuClick,
      goPath,
      logo,
      userInfo,
      stationLetterNum,
      getUnRead
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/styles/home/header/index.less';
</style>
