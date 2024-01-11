<template>
  <div class="v-banner">
    <GlobalLoading v-show="loading" />
    <van-swipe :autoplay="3000" lazy-render>
      <van-swipe-item v-for="(item, index) in bannerList" :key="index" @click.stop="clickSwipeHandler(item)">
        <van-image width="100%" height="56vw" :src="item.banner_path">
          <template #error>
            <img :src="pageHeaderDefaultImage" style="width:100%;height:100%" alt="">
          </template>
          <template #loading>
            <ImageLoadBox />
          </template>
        </van-image>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue';
import { homeBanner } from '@/api/home.js';
import GlobalLoading from '@/components/Loading/index.vue';
import { useRouter } from 'vue-router';
import { getToken, getUserInfo } from '@/utils/index.js';
import ImageLoadBox from '@/components/ImageLoadBox/index.vue';

export default defineComponent({
  components: { GlobalLoading, ImageLoadBox },
  setup() {
    /**
     * 首页banner列表
     */
    const bannerList = ref(['']);

    const loading = ref(false);

    /**
     * 获取首页banner图列表
     */
    const getHomeBanner = async() => {
      loading.value = true;
      const data = await homeBanner();
      if (Number(data.code) === 1 && data.data instanceof Array && data.data.length > 0) {
        bannerList.value = data.data;
      }
      setTimeout(() => {
        loading.value = false;
      }, 100);
    };

    const { proxy }: any = getCurrentInstance();

    const router = useRouter();

    function clickSwipeHandler(banner: any) {
      if (+banner.target_type === 1) {
        if (+banner.target_url === 1) {
          // console.log(banner.target_content)
          proxy.mittBus.emit('toJumpBClent', {
            code: banner.target_content,
            addPath: ''
          });
        }
        if (+banner.target_url === 2) {
          switch (banner.target_content) {
            case 'vip1':
              return router.push({ name: 'VipClub', query: { tab: '1' }});
            case 'vip2':
              return router.push({ name: 'VipClub', query: { tab: '2' }});
            case 'vip3':
              return router.push({ name: 'VipClub', query: { tab: '3' }});
            default:
              proxy.mittBus.emit('openGameBox', {
                gameUrl:
                  banner.target_content.indexOf('?') === -1
                    ? `${banner.target_content}?token=${getToken()}&device=1&userId=${getUserInfo()?.id || ''}`
                    : `${banner.target_content}&token=${getToken()}&device=1&userId=${getUserInfo()?.id || ''}`,
                headerTitle: banner.name,
                show: true
              });
          }
        }
      }
    }

    onMounted(() => {
      getHomeBanner();
    });
    return {
      bannerList,
      getHomeBanner,
      loading,
      clickSwipeHandler
    };
  }
});
</script>

<style lang="less" scoped>
.v-banner {
  margin: 5px 15px 10px;
  height: 56vw;
  border-radius: 16px;
  overflow: hidden;
  transform: rotate(0deg);
  position: relative;
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 2px;
    left: -2px;
    top: 0;
    background-color: #1c2227;
    z-index: 100;
  }
  :deep(.van-swipe) {
    transform: rotate(0deg);
  }
}
</style>
