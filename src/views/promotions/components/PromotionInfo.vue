<template>
  <div class="list" :class="{ 'is-expired': isExpired }" @click.stop="toActivityBox">
    <div class="list-image">
      <van-image width="100%" height="100%" :src="subItem.app_img">
        <template #error>
          <img :src="pageHeaderDefaultImage" style="width: 100%; height: 114px" alt="">
        </template>
        <template #loading>
          <ImageLoadBox />
        </template>
      </van-image>
    </div>
    <div class="list-info">
      <div class="list-info-title">
        <span>{{ subItem.header }}</span>
        <span>{{ subItem.activity_title }}</span>
      </div>
      <div v-if="+subItem.is_time_limit === 1" class="list-info-time">
        {{ parseTime(subItem.start_time, '{m}-{d}') }} 至
        {{ parseTime(subItem.end_time, '{m}-{d}') }}
      </div>
      <div v-else class="list-info-time">长期活动</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue';
import { getToken, parseTime, getUserInfo } from '@/utils/index.js';
import defaultImages from '@/hooks/defaultImages';
import { useRouter } from 'vue-router';
import ImageLoadBox from '@/components/ImageLoadBox/index.vue';

export default defineComponent({
  name: 'PromotionItem',
  components: { ImageLoadBox },
  props: {
    subItem: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  setup(props) {
    const { pageHeaderDefaultImage } = defaultImages();

    const { proxy }: any = getCurrentInstance();

    const router = useRouter();

    function toActivityBox() {
      isExpired.value = testExpired();
      const token = getToken();
      if (isExpired.value) {
        // Toast('当前活动已过期');
      }
      if (props.subItem.target_url) {
        switch (props.subItem.target_url) {
          case 'vip1':
            return router.push({ name: 'VipClub', query: { tab: '1' }});
          case 'vip2':
            return router.push({ name: 'VipClub', query: { tab: '2' }});
          case 'vip3':
            return router.push({ name: 'VipClub', query: { tab: '3' }});
          default:
            // eslint-disable-next-line no-case-declarations
            const addPath =
              '?token=' + token + '&device=1&activeId=' + props.subItem.id + '&userId=' + getUserInfo()?.id;
            proxy.mittBus.emit('openGameBox', {
              gameUrl: props.subItem.target_url + addPath,
              headerTitle: props.subItem.activity_title,
              show: true
            });
            return;
        }
      }
    }

    const isExpired = ref(false);

    const testExpired = () => {
      const nowDate = new Date().getTime();
      let result: any = false;
      if (+props.subItem.is_time_limit === 1) {
        if (props.subItem.end_time && Number(nowDate) > Number(parseTime(props.subItem.end_time, 'getTime'))) {
          result = true;
        }
      } else {
        result = false;
      }
      return result;
    };

    onMounted(() => {
      isExpired.value = testExpired();
    });

    return { parseTime, pageHeaderDefaultImage, toActivityBox, isExpired };
  }
});
</script>

<style lang="less" scoped>
.list {
  width: 100%;
  border-radius: 8px;
  background-color: #3e4a53;
  margin-bottom: 10px;
  background-size: 100%;
  background-position: center;
  overflow: hidden;

  &-image {
    //display: flex;
    width: 100%;
    height: 114px;
  }

  &-info {
    position: relative;
    display: flex;
    width: 100%;
    height: 36px;
    align-items: center;
    justify-content: space-between;
    background-color: #3e4a53;
    margin: 0 auto;
    overflow: hidden;

    > div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-shrink: 0;
    }

    &-title {
      display: flex;
      align-items: center;
      width: 70%;

      span:nth-child(1) {
        height: 22px;
        line-height: 22px;
        font-size: 12px;
        color: #fff;
        border-radius: 4px;
        background-color: #009928;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 10px;
        margin: 0 7px;
        flex-shrink: 0;
      }

      span:nth-child(2) {
        font-size: 14px;
        color: #b6c1cb;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &-time {
      font-family: PingFang-SC;
      font-size: 12px;
      color: #94a5b1;
      text-align: right;
      padding: 0 7px;
    }
  }
}

.is-expired {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: #00000060;
  }
}
</style>
