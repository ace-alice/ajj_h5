<template>
  <div class="v-init">
    <van-swipe
      :loop="false"
      :show-indicators="swiperIndex === 3 ? false : true"
      lazy-render
      @change="swiperChange"
    >
      <van-swipe-item v-for="image in images" :key="image">
        <img :src="image" />
        <span v-if="swiperIndex === 3" class="v-init-button" @click="goHome"
          >立即体验</span
        >
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const images = [
      require('@/assets/init/init1.webp'),
      require('@/assets/init/init2.webp'),
      require('@/assets/init/init3.webp'),
      require('@/assets/init/init4.webp')
    ]
    const swiperIndex = ref(0)
    const swiperChange = (index: number) => {
      swiperIndex.value = index
    }
    const goHome = () => {
      router.push({ name: 'Home' })
    }
    return {
      images,
      swiperChange,
      swiperIndex,
      goHome
    }
  }
})
</script>

<style lang="less" scoped>
.v-init {
  :deep(.van-swipe) {
    height: 100%;
    background-color: #1c2227;
  }
  img {
    display: flex;
    width: calc(100% - 55px);
    margin: 115px auto 0 auto;
    object-fit: cover;
  }
  &-button {
    position: absolute;
    bottom: 35px;
    left: 50%;
    margin-left: -65px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 130px;
    height: 38px;
    border-radius: 19px;
    background-image: linear-gradient(to right, #12dedf, #07c79c);
    color: #181a1e;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 2.6px;
  }
}
</style>
