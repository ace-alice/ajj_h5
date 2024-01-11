<template>
  <div class="v-user">
    <UserHeader />
    <div class="v-user-bg" />
    <Login v-if="routeName === 'Login'" />
    <Register v-if="routeName === 'Register'" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import UserHeader from './components/UserHeader/index.vue'
import Login from './components/UserLogin/index.vue'
import Register from './components/UserRegister/index.vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    UserHeader,
    Login,
    Register
  },
  setup() {
    const route = useRoute()
    /**
     * 获取路由Name
     */
    const routeName = computed(() => {
      return route.name
    })
    return {
      routeName
    }
  }
})
</script>

<style lang="less" scoped>
.v-user {
  height: 100%;
  overflow: auto;
  &-bg {
    width: 100%;
    height: 200px;
    background: url('../../assets/home/login-bg.webp') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
