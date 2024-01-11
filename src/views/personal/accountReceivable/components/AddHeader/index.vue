<template>
  <div class="v-header">
    <div class="v-header-l">
      <svg-icon class="personal-menu" icon-class="user-back" @click="goBack" />
    </div>
    <div class="v-header-m">
      {{ routeTitle }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  props: {
    cardName: {
      type: String,
      default: ''
    },
    step: {
      type: Number,
      default: 1
    }
  },
  emits: ['changeStep'],
  setup(props, { emit }) {
    /**
     * 使用路由
     */
    const router = useRouter()
    /**
     * 返回
     */
    const goBack = () => {
      if (route.query.fromWithDraw && +props.step === 1) {
        router.go(-1)
      } else {
        if (+props.step === 2) return emit('changeStep', 1)
        router.push({
          name: 'AccountReceivable',
          query: { name: props.cardName }
        })
      }
    }

    /**
     * 获取路由
     */
    const route = useRoute()

    /**
     * 获取路由标题
     */
    const routeTitle = computed(() => {
      return route.meta.title
    })

    return {
      goBack,
      routeTitle
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/styles/home/header/index.less';
</style>
