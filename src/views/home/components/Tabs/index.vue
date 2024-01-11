<template>
  <div class="v-tabs-main">
    <GlobalLoading v-show="loading" min-height="400px" align-row="flex-start" top="50px" />
    <div v-for="(item, index) in hotGameList" :key="index" class="v-tabs-main-col" @click="goGamePath(item)">
      <div class="col-header">
        <div class="col-header-name">
          <span>
            <van-image width="14" height="14" :src="item.game_logo">
              <template #loading>
                <img :src="errorLogo" style="width: 14px; height: 14px;">
              </template>
              <template #error>
                <img :src="errorLogo" style="width: 14px; height: 14px;">
              </template>
            </van-image>
          </span>
          <span>{{ item.event_name }}</span>
        </div>
        <div class="col-header-time">
          {{ timeHandling(item.game_show_end_time) }}
        </div>
      </div>
      <div class="col-main">
        <div class="col-main-info">
          <div class="col-main-info-l">
            <van-image width="30" height="30" :src="item.team_logo_1">
              <template #loading>
                <img :src="errorLogo" style="width: 30px; height: 30px;">
              </template>
              <template #error>
                <img :src="errorLogo" style="width: 30px; height: 30px;">
              </template>
            </van-image>
          </div>
        </div>
        <div class="col-main-vs">
          <div class="col-main-vs-odds">
            <span>{{ oddsHandling(item.points, 0) }}</span>
            <span>VS</span>
            <span>{{ oddsHandling(item.points, 1) }}</span>
          </div>
        </div>
        <div class="col-main-info">
          <div class="col-main-info-r">
            <van-image width="30" height="30" :src="item.team_logo_2">
              <template #loading>
                <img :src="errorLogo" style="width: 30px; height: 30px;">
              </template>
              <template #error>
                <img :src="errorLogo" style="width: 30px; height: 30px;">
              </template>
            </van-image>
          </div>
        </div>
      </div>
      <div class="col-footer">
        <span class="van-ellipsis">{{ item.team_name_1 }}</span>
        <span v-show="Number(item.category_id) === 3">滚球中</span>
        <span class="van-ellipsis">{{ item.team_name_2 }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onActivated, onMounted, getCurrentInstance, onUnmounted } from 'vue';
import { hotGame } from '@/api/home.js';
import { parseTime } from '@/utils/index.js';
import store from '@/store/index.js';
import GlobalLoading from '@/components/Loading/index.vue';

export default defineComponent({
  components: { GlobalLoading },
  setup() {
    /**
     * 热门游戏列表
     */
    const hotGameList = ref([]);
    const errorLogo = require('@/assets/other/default_company_logo.png');
    const gameUrl = computed(() => store.getters.getGameUrl);

    const loading = ref(false);
    /**
     * 获取热门游戏列表
     */
    const getHotGame = async() => {
      // loading.value = true;
      const data = await hotGame();
      if (Number(data.code) === 1) {
        hotGameList.value = data.data;
      }
      // setTimeout(() => {
      //   loading.value = false;
      // }, 10);
    };
    /**
     * 处理赔率
     */
    const oddsHandling = (arr: any, index: number) => {
      if (arr.team_points) {
        return arr.team_points[index].point;
      } else {
        return '';
      }
      // console.log(arr.team_points)
      // return arr[index].point
    };
    /**
     * 时间处理
     */
    const timeHandling = (time: string | number) => {
      return parseTime(time, '{m}-{d} {h}:{i}');
    };
    /**
     * 跳转游戏
     */
    const goGamePath = (row: any) => {
      const addPath = '&id=' + row.id + '&category_id=' + row.category_id;
      proxy.mittBus.emit('toJumpBClent', { code: 'game_id_1', addPath });
    };

    const pubImg = require('@/assets/home/pub-loading.png');

    const { proxy }: any = getCurrentInstance();

    onMounted(() => {
      // getHotGame();
      proxy.mittBus.on('getHotGame', () => {
        getHotGame();
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off('getHotGame');
    });

    onActivated(() => {
      getHotGame();
    });
    return {
      hotGameList,
      errorLogo,
      getHotGame,
      timeHandling,
      oddsHandling,
      goGamePath,
      gameUrl,
      loading,
      pubImg
    };
  }
});
</script>

<style lang="less" scoped>
.v-tabs-loading {
  position: absolute;
  width: 100%;
  height: 100%;
  min-height: 400px;
  top: 0;
  left: 0;
  background-color: #1c222760;
  backdrop-filter: blur(5px);
  z-index: 1;
  border-radius: 8px;
}
.v-tabs-main {
  width: calc(100% - 30px);
  margin: 15px auto;
  position: relative;
  &-col {
    width: 100%;
    height: 100px;
    border-radius: 8px;
    background-color: #2d363d;
    margin-bottom: 10px;
    overflow: hidden;
    .col-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      width: calc(100% - 28px);
      height: 30px;
      padding: 0 14px;
      &-name {
        display: flex;
        color: #b6c1cb;
        font-size: 12px;
        align-items: center;
        span:nth-child(2) {
          margin-left: 5px;
        }
      }
      &-time {
        color: #a1abb5;
        font-size: 12px;
      }
    }
    .col-main {
      display: flex;
      position: relative;
      padding: 0 14px;
      color: #fff;
      height: 44px;
      align-items: center;
      justify-content: space-between;
      &-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 25%;
        height: 44px;
        font-size: 12px;
        text-align: center;
        &-l {
          display: flex;
          position: absolute;
          left: 14px;
          width: 30%;
          margin-left: -5px;
          height: 44px;
          justify-content: center;
          align-items: center;
        }
        &-r {
          display: flex;
          position: absolute;
          right: 14px;
          width: 30%;
          margin-right: -5px;
          height: 44px;
          justify-content: center;
          align-items: center;
        }
      }
      &-vs {
        width: 50%;
        text-align: center;
        &-odds {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          span:nth-child(2) {
            font-size: 16px;
          }
        }
      }
    }
    .col-footer {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 0 14px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      span {
        width: 30%;
      }
      span:nth-child(2) {
        width: 40%;
        font-size: 12px;
        color: #0ed6c8;
      }
    }
  }
}
</style>
