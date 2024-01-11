<template>
  <div class="activity-box">
    <div v-show="!isHorizontal" class="help-header">
      <div @click.stop="closeGameBox">
        <van-icon name="arrow-left" />
      </div>
      <div>{{ headerTitle }}</div>
      <div />
    </div>
    <GlobalLoading v-show="loading" min-height="100%" align-row="flex-start" top="50%" />
    <iframe :src="gameUrl" frameborder="0" width="100%" class="iframe-box" :class="{ 'is-horizontal': isHorizontal }" />
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, nextTick, onMounted, ref } from 'vue';
import toPathHook from '@/hooks/toPath';
import GlobalLoading from '@/components/Loading/index.vue';

export default defineComponent({
  name: 'GameBox',
  components: { GlobalLoading },
  props: {
    gameUrl: {
      type: String,
      default: ''
    },
    headerTitle: {
      type: String,
      default: ''
    }
  },
  setup() {
    const { proxy }: any = getCurrentInstance();

    function closeGameBox() {
      proxy.mittBus.emit('openGameBox', {
        gameUrl: '',
        headerTitle: '',
        show: false
      });
    }

    const { toPath } = toPathHook();

    const loading = ref(true);

    const isHorizontal = ref(false);

    onMounted(() => {
      window.addEventListener('message', eve => {
        const data = eve.data;
        switch (data) {
          case 'AddBankCard':
            closeGameBox();
            toPath({ name: 'AddBankCard' });
            break;
          case 'Home':
            closeGameBox();
            toPath({ name: 'Home' });
            break;
          case 'CustomerService':
            closeGameBox();
            toPath({ name: 'OnlineService' });
            break;
        }
      });
      window.addEventListener(
        'orientationchange',
        () => {
          if (window.orientation === 90) {
            isHorizontal.value = true;
          } else {
            isHorizontal.value = false;
          }
        },
        false
      );
      nextTick(() => {
        if (window.orientation === 90) {
          isHorizontal.value = true;
        } else {
          isHorizontal.value = false;
        }
        setTimeout(() => {
          loading.value = false;
        }, 1000);
      });
      // console.log('1')
    });

    return { closeGameBox, loading, isHorizontal };
  }
});
</script>

<style lang="less" scoped>
.activity-box {
  height: 100%;
  width: 100%;

  .iframe-box {
    margin: 40px 0 0;
    height: calc(100% - 40px);
  }

  .is-horizontal {
    margin: 0 !important;
    height: 100%;
  }
}

.help-header {
  height: 40px;
  width: 100%;
  position: fixed;
  top: 0;
  color: #fff;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // font-weight: bold;
  background-color: #1c2227;
  z-index: 1000;

  > div {
    margin: 0 15px;
  }
}

:deep(.van-icon) {
  font-size: 20px !important;
}
</style>
