<template>
  <div class="app-wrapper">
    <div class="splash-screen" v-show="!!splashShow">
      <div class="timer" @click="closeSplash">
        跳过 {{ splashShow }}S
      </div>
      <div class="top">
        <img src="../assets/other/top-logo.webp">
      </div>
      <div class="center">
        <img src="../assets/other/splash-center.webp">
      </div>
      <div class="bottom">
        <img src="../assets/other/splash-bottom.png">
      </div>
    </div>
    <div class="app-wrapper__content" :class="routeName ? '' : 'v-route-name'">
      <Loading v-show="isPubLoading"/>
      <router-view v-slot="{ Component }" class="v-router-view">
        <transition :name="transitionName" mode="out-in">
          <keep-alive :include="keepAliveRoutes">
            <component :is="Component"/>
          </keep-alive>
        </transition>
      </router-view>
    </div>
    <TabBar v-if="routeName"/>
    <van-popup
        v-model:show="showGameBox"
        position="bottom"
        :style="{ height: '100%' }"
    >
      <GameBox
          v-if="showGameBox"
          :gameUrl="gameInfo.gameUrl"
          :headerTitle="gameInfo.headerTitle"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import {
  computed,
  reactive,
  toRefs,
  ref,
  onMounted,
  onUnmounted,
  getCurrentInstance
} from 'vue'
import {useStore} from 'vuex'
import {useRoute, onBeforeRouteUpdate} from 'vue-router'
import TabBar from '@/components/Tabbar/index.vue'
import Loading from '@/components/Loading/index.vue'
import GameBox from '@/components/gameBox/index.vue'
import SvgIcon from "@/components/SvgIcon/index.vue";

export default {
  name: 'Layout',
  components: {
    SvgIcon,
    TabBar,
    Loading,
    GameBox,
  },
  setup() {
    const isPubLoading = computed(() => store.getters.getIsPubLoading)
    /**
     * 获取路由缓存
     * @type {any}
     */
    const keepAliveRoutes = computed(() => store.getters.cachedViews)
    /**
     * 使用路由
     * @type {RouteLocationNormalizedLoaded}
     */
        // const router = useRouter()
    const route = useRoute()
    const state = reactive({
      transitionName: 'slide'
    })

    const store = useStore()
    const splashShow = computed(() => {
      // return store.getters.splashShow
      return 0
    })

    const routeName = computed(() => route.meta.showFooter)
    /**
     * 给路由加过渡动画
     */
    onBeforeRouteUpdate((to: any, from: any) => {
      if (to.meta.index > from.meta.index) {
        state.transitionName = 'slide-left' // 向左滑动
      } else if (to.meta.index < from.meta.index) {
        // 由次级到主级
        state.transitionName = 'slide-right'
      } else {
        state.transitionName = '' // 同级无过渡效果
      }
    })

    const {proxy} = getCurrentInstance() as any

    const showGameBox = ref(false)

    const gameInfo = reactive({
      gameUrl: '',
      headerTitle: '',
      show: false
    })

    let timer: any = null

    function closeSplash() {
      store.commit('cachedView/REDUCE_SPLASH', 0)
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }

    onMounted(() => {
      proxy.mittBus.on('openGameBox', (game: any) => {
        if (!game.show) {
          showGameBox.value = game.show
          setTimeout(() => {
            Object.assign(gameInfo, game)
          }, 500)
        }
        if (game.show) {
          Object.assign(gameInfo, game)
          showGameBox.value = game.show
        }
      })
      timer = setInterval(() => {
        if (splashShow.value > 0) {
          store.commit('cachedView/REDUCE_SPLASH')
        } else {
          clearInterval(timer)
          timer = null
        }
      }, 1000)
    })

    onUnmounted(() => {
      proxy.mittBus.off('openGameBox')
    })

    return {
      ...toRefs(state),
      keepAliveRoutes,
      routeName,
      isPubLoading,
      showGameBox,
      gameInfo,
      splashShow,
      closeSplash
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/mixin.less';

.splash-screen {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-image: url("./../assets/other/splash-bg.webp");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  & > div {
    flex-shrink: 0;
  }

  .timer {
    position: absolute;
    padding: 0 15px;
    height: 24px;
    line-height: 24px;
    color: #fff;
    top: 20px;
    right: 20px;
    font-size: 12px;
    background-color: #ffffff20;
    border-radius: 12px;
    cursor: pointer;

    &:hover {
      background-color: #ffffff40;
    }

    &:active {
      background-color: rgba(220, 208, 208, 0.25);
    }
  }

  .top {
    img {
      width: 107px;
      height: 73px;
    }
  }

  .center {
    img {
      width: 256px;
      height: 346px;
    }
  }

  .bottom {
    img {
      width: 176px;
      height: 18px;
    }
  }

}

.app-wrapper {
  .clearfix();
  position: relative;
  height: 100%;
  width: 100%;

  .app-wrapper__content {
    position: relative;
    height: 100%;

    .v-router-view {
      height: auto;
      position: absolute;
      top: 0;
      bottom: 48px;
      left: 0;
      right: 0;
      margin: 0 auto;
      -webkit-overflow-scrolling: touch;
      transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
    }
  }

  .v-route-name {
    height: 100%;
    overflow: auto;
    .v-router-view {
      bottom: 0;
    }
  }
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  width: 100%;
  height: 100%;
  will-change: transform;
  transition: all 300ms;
  position: absolute;
  backface-visibility: hidden;
}

.slide-right-enter-from {
  opacity: 1;
  transform: translate3d(-100%, 0, 0);
}

.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(0, 0, 0);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translate3d(0, 0, 0);
}

.slide-left-leave-active {
  opacity: 1;
  transform: translate3d(-100%, 0, 0);
}

:deep(.van-popup) {
  background: #1c2227;
}
</style>
