<template>
  <div class="v-games">
    <!--    <van-swipe-->
    <!--      :show-indicators="false"-->
    <!--      :loop="false"-->
    <!--      :style="{width: '100%'}"-->
    <!--      :width="141"-->
    <!--      :height="120"-->
    <!--    >-->
    <!--      <van-swipe-item v-for="(item, index) in newGameTabsList" :key="index">-->
    <!--        <div-->
    <!--          class="v-games-l"-->
    <!--          :class="item.maintain ? 'home-game-bg' : ''"-->
    <!--          @click="goGamePath(item.id, item.maintain)"-->
    <!--        >-->
    <!--          <img :src="item.maintain ? item.gameBgUn : item.gameBg">-->
    <!--          <div v-if="!item.maintain" class="v-games-l-text">-->
    <!--            <span>{{ item.title }}</span>-->
    <!--            <span>{{ item.tip }}</span>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </van-swipe-item>-->
    <!--    </van-swipe>-->
    <div class="v-games-tabs">
      <div v-for="(item, index) in newGameTabsList" :key="index" class="v-games-tabs-main">
        <div
          class="v-games-l"
          :class="item.maintain ? 'home-game-bg' : ''"
          @click="goGamePath(item.id, item.maintain)"
        >
          <img :src="item.maintain ? item.gameBgUn : item.gameBg">
          <div v-if="!item.maintain" class="v-games-l-text">
            <span>{{ item.title }}</span>
            <span>{{ item.tip }}</span>
          </div>
        </div>
      </div>
    </div>
    <van-dialog
      v-model:show="gameMaintainShow"
      title="提示"
      :close-on-click-overlay="true"
      :show-cancel-button="false"
      :show-confirm-button="false"
    >
      <span class="game-maintain-content" v-html="pubMaintainText.replace(/\n/g, '<br />')" />
      <div class="game-maintain-button">
        <span @click="gameMaintainShow = false">我知道了</span>
      </div>
    </van-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onActivated, onMounted, getCurrentInstance, onUnmounted, computed } from 'vue';
import { iaGameEntrance, sbGameEntrance, pbGameEntrance, xjGameEntrance, agGameEntrance, maintainStatus } from '@/api/home.js';
import store from '@/store/index.js';
import { Toast } from 'vant';
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    // ios终端
    // eslint-disable-next-line no-case-declarations
    const isiOS = computed(() => {
      return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
    });
    /**
     * IA游戏背景图
     */
    const iaGameSports = require('@/assets/home/game-sport1.png');
    /**
     * IA游戏背景图（维护）
     */
    const iaGameSportsUn = require('@/assets/home/game-sport1-un.png');
    /**
     * IA游戏是否维护
     */
    const iaGameSportsMaintain = ref(false);
    /**
     * IA游戏路径
     */
    const iaGameUrl = ref('');
    /**
     * IA游戏维护文字
     */
    const iaGameText = ref('');
    /**
     * IA游戏是否锁定
     */
    const iaGameLock = ref(false);
    /**
     * 沙巴游戏背景图
     */
    const sbGameSports = require('@/assets/home/game-sport4.png');
    /**
     * 沙巴游戏背景图（维护）
     */
    const sbGameSportsUn = require('@/assets/home/game-sport4-un.png');
    /**
     * 沙巴游戏是否维护
     */
    const sbGameSportsMaintain = ref(false);
    /**
     * 沙巴游戏路径
     */
    const sbGameUrl = ref('');
    /**
     * 沙巴游戏维护文字
     */
    const sbGameText = ref('');
    /**
     * 沙巴游戏是否锁定
     */
    const sbGameLock = ref(false);
    /**
     * 平博游戏背景图
     */
    const pbGameSports = require('@/assets/home/game-sport3.png');
    /**
     * 平博游戏背景图（维护）
     */
    const pbGameSportsUn = require('@/assets/home/game-sport3-un.png');
    /**
     * 平博游戏是否维护
     */
    const pbGameSportsMaintain = ref(false);
    /**
     * 平博游戏路径
     */
    const pbGameUrl = ref('');
    /**
     * 平博游戏维护文字
     */
    const pbGameText = ref('');
    /**
     * 平博游戏是否锁定
     */
    const pbGameLock = ref(false);
    /**
     * 小金体育背景图
     */
    const xjGameSports = require('@/assets/home/game-sport2.png');
    /**
     * 小金体育背景图（维护）
     */
    const xjGameSportsUn = require('@/assets/home/game-sport2-un.png');
    /**
     * 小金体育是否维护
     */
    const xjGameSportsMaintain = ref(false);
    /**
     * 小金体育路径
     */
    const xjGameUrl = ref('');
    /**
     * 小金体育维护文字
     */
    const xjGameText = ref('');
    /**
     * 小金体育是否锁定
     */
    const xjGameLock = ref(false);
    /**
     * ag真人是否维护
     */
    const agGameSportsMaintain = ref(false)
    /**
     * ag真人路径
     */
    const agGameUrl = ref('')
    /**
     * ag真人维护文字
     */
    const agGameText = ref('')
    /**
     * ag真人是否锁定
     */
    const agGameLock = ref(false)
    /**
     * 弹窗显示维护文字
     */
    const pubMaintainText = ref('');
    /**
     * 维护弹窗状态
     */
    const gameMaintainShow = ref(false);
    const newGameTabsList: any = ref([])
    const gameTabsList = [
      {
        id: 1,
        title: '小艾电竞',
        maintain: false,
        gameBg: require('@/assets/home/game-sport1.png'),
        gameBgUn: require('@/assets/home/game-sport1-un.png'),
        tip: '最佳电竞滚球赛事',
        msg: '',
        lock: false
      },
      {
        id: 4,
        title: '小艾体育',
        maintain: false,
        gameBg: require('@/assets/home/game-sport2.png'),
        gameBgUn: require('@/assets/home/game-sport2-un.png'),
        tip: '结算快 水位高 金牌体育',
        msg: '',
        lock: false
      },
      {
        id: 5,
        title: 'AG真人',
        maintain: false,
        gameBg: require('@/assets/home/game-sport5.png'),
        gameBgUn: require('@/assets/home/game-sport5-un.png'),
        tip: '创新玩法 顶级体验',
        msg: '',
        lock: false
      },
      {
        id: 3,
        title: '平博体育',
        maintain: false,
        gameBg: require('@/assets/home/game-sport4.png'),
        gameBgUn: require('@/assets/home/game-sport4-un.png'),
        tip: '超多赛事更多玩法',
        msg: '',
        lock: false
      },
      {
        id: 2,
        title: '沙巴体育',
        maintain: false,
        gameBg: require('@/assets/home/game-sport3.png'),
        gameBgUn: require('@/assets/home/game-sport3-un.png'),
        tip: '专业体育赛事投注',
        msg: '',
        lock: false
      }
    ]

    function getMaintainStatus(num: number) {
      return new Promise(resolve => {
        maintainStatus({ game_id: num })
          .then((res: any) => {
            if (+res.code === 1) {
              for (const i in gameTabsList) {
                if (gameTabsList[i].id === num) {
                  gameTabsList[i].maintain = false
                }
              }
              newGameTabsList.value = { ...gameTabsList }
            }
          })
          .catch((err: any) => {
            if (+err.code === 60001) {
              for (const i in gameTabsList) {
                if (gameTabsList[i].id === num) {
                  gameTabsList[i].msg = err.msg
                  gameTabsList[i].maintain = true
                }
              }
              newGameTabsList.value = { ...gameTabsList }
            }
            if ([60003, 50005, 50009].includes(+err.code)) {
              for (const i in gameTabsList) {
                if (gameTabsList[i].id === num) {
                  gameTabsList[i].msg = err.msg
                  gameTabsList[i].lock = true
                }
              }
              newGameTabsList.value = { ...gameTabsList }
            }
          })
          .finally(() => resolve(true));
      });
    }

    /**
     * 获取所有游戏入口
     */
    const allGameEntrance = () => {
      getIaGameEntrance();
      for (let i = 0; i < gameTabsList.length; i++) {
        getMaintainStatus(i + 1);
      }
    };
    /**
     * 获取ia游戏数据
     */
    const getIaGameEntrance = () => {
      iaGameLock.value = false;
      return new Promise(resolve => {
        iaGameEntrance()
          .then((res: any) => {
            if (Number(res.code) === 1) {
              iaGameSportsMaintain.value = false;
              iaGameUrl.value = res.data.url;
              store.commit('user/GET_GAME_URL', iaGameUrl.value);
            }
          })
          .catch((err: any) => {
            if (err.code === 60001) {
              iaGameText.value = err.msg;
              iaGameSportsMaintain.value = true;
            } else if (err.code === 60003 || err.code === 50005 || err.code === 50009) {
              iaGameText.value = err.msg;
              iaGameLock.value = true;
            }
            store.commit('user/GET_GAME_URL', '');
          })
          .finally(() => resolve(true));
      });
    };
    /**
     * 获取沙巴游戏数据
     */
    const getSbGameEntrance = () => {
      sbGameLock.value = false;
      return new Promise(resolve => {
        sbGameEntrance()
          .then((res: any) => {
            if (Number(res.code) === 1) {
              sbGameSportsMaintain.value = false;
              sbGameUrl.value = res.data.url;
            }
          })
          .catch((err: any) => {
            if (err.code === 60001) {
              sbGameText.value = err.msg;
              sbGameSportsMaintain.value = true;
            } else if (err.code === 60003 || err.code === 50005 || err.code === 50009) {
              sbGameText.value = err.msg;
              sbGameLock.value = true;
            }
          })
          .finally(() => resolve(true));
      });
    };
    /**
     * 获取平博游戏数据
     */
    const getPbGameEntrance = () => {
      pbGameLock.value = false;
      return new Promise(resolve => {
        pbGameEntrance()
          .then((res: any) => {
            if (Number(res.code) === 1) {
              pbGameSportsMaintain.value = false;
              pbGameUrl.value = res.data.url;
            }
          })
          .catch((err: any) => {
            if (err.code === 60001) {
              pbGameText.value = err.msg;
              pbGameSportsMaintain.value = true;
            } else if (err.code === 60003 || err.code === 50005 || err.code === 50009) {
              pbGameText.value = err.msg;
              pbGameLock.value = true;
            }
          })
          .finally(() => resolve(true));
      });
    };
    /**
     * 获取小金体育数据
     */
    const getXjGameEntrance = () => {
      xjGameLock.value = false;
      return new Promise(resolve => {
        xjGameEntrance()
          .then((res: any) => {
            if (Number(res.code) === 1) {
              xjGameSportsMaintain.value = false;
              xjGameUrl.value = res.data.url;
            }
          })
          .catch((err: any) => {
            if (err.code === 60001) {
              xjGameText.value = err.msg;
              xjGameSportsMaintain.value = true;
            } else if (err.code === 60003 || err.code === 50005 || err.code === 50009) {
              xjGameText.value = err.msg;
              xjGameLock.value = true;
            }
          })
          .finally(() => resolve(true));
      });
    }
    /**
     * 获取ag真人数据
     */
    const getAgGameEntrance = () => {
      agGameLock.value = false;
      return new Promise(resolve => {
        agGameEntrance()
          .then((res: any) => {
            if (Number(res.code) === 1) {
              agGameSportsMaintain.value = false;
              agGameUrl.value = res.data.url;
            }
          })
          .catch((err: any) => {
            if (err.code === 601) {
              router.push({ name: 'Login' })
              setTimeout(() => {
                location.reload()
              }, 100)
            }
            if (err.code === 60001) {
              agGameText.value = err.msg;
              agGameSportsMaintain.value = true;
            } else if (err.code === 60003 || err.code === 50005 || err.code === 50009) {
              agGameText.value = err.msg;
              agGameLock.value = true;
            }
          })
          .finally(() => resolve(true));
      });
    }
    /**
     * 游戏跳转
     */
    const goGamePath = async(index: number, isClick: boolean, addPath = '') => {
      for (const i in newGameTabsList.value) {
        if (newGameTabsList.value[i].id === index) {
          if (index === 1) {
            await getIaGameEntrance();
            if (newGameTabsList.value[i].maintain) {
              gameMaintainShow.value = true;
              pubMaintainText.value = iaGameText.value;
            } else if (iaGameLock.value) {
              Toast(iaGameText.value);
            } else {
              // window.open(iaGameUrl.value, '_blank')
              proxy.mittBus.emit('openGameBox', {
                gameUrl: iaGameUrl.value + addPath,
                headerTitle: '小艾电竞',
                show: true
              });
            }
          }
          if (index === 2) {
            await getSbGameEntrance();
            if (newGameTabsList.value[i].maintain) {
              gameMaintainShow.value = true;
              pubMaintainText.value = sbGameText.value;
            } else if (sbGameLock.value) {
              Toast(sbGameText.value);
            } else {
              // window.open(sbGameUrl.value, '_blank')
              proxy.mittBus.emit('openGameBox', {
                gameUrl: sbGameUrl.value,
                headerTitle: '沙巴体育',
                show: true
              });
            }
          }
          if (index === 3) {
            await getPbGameEntrance();
            if (newGameTabsList.value[i].maintain) {
              gameMaintainShow.value = true;
              pubMaintainText.value = pbGameText.value;
            } else if (pbGameLock.value) {
              Toast(pbGameText.value);
            } else {
              if (isiOS.value) {
                Toast.success('即将跳转平博体育');
                // window.open(pbGameUrl.value, '_blank');
                location.href = pbGameUrl.value;
                return;
              }
              // window.open(pbGameUrl.value, '_blank')
              proxy.mittBus.emit('openGameBox', {
                gameUrl: pbGameUrl.value,
                headerTitle: '平博体育',
                show: true
              });
            }
          }
          if (index === 4) {
            await getXjGameEntrance();
            if (newGameTabsList.value[i].maintain) {
              gameMaintainShow.value = true;
              pubMaintainText.value = xjGameText.value;
            } else if (xjGameLock.value) {
              Toast(xjGameText.value);
            } else {
              proxy.mittBus.emit('openGameBox', {
                gameUrl: xjGameUrl.value,
                headerTitle: '小艾体育',
                show: true
              });
            }
          }
          if (index === 5) {
            await getAgGameEntrance();
            if (newGameTabsList.value[i].maintain) {
              gameMaintainShow.value = true;
              pubMaintainText.value = agGameText.value;
            } else if (agGameLock.value) {
              Toast(agGameText.value);
            } else {
              proxy.mittBus.emit('openGameBox', {
                gameUrl: agGameUrl.value,
                headerTitle: 'AG真人',
                show: true
              });
            }
          }
        }
      }
    };

    const { proxy }: any = getCurrentInstance();

    onMounted(() => {
      proxy.mittBus.on('allGameEntrance', () => {
        for (let i = 0; i < gameTabsList.length; i++) {
          getMaintainStatus(i + 1);
        }
      });
      proxy.mittBus.on('toJumpBClent', ({ code, addPath }: any) => {
        switch (code) {
          case 'game_id_1':
            return goGamePath(1, iaGameSportsMaintain.value, addPath);
          case 'game_id_2':
            return goGamePath(2, sbGameSportsMaintain.value);
          case 'game_id_3':
            return goGamePath(3, pbGameSportsMaintain.value);
          case 'game_id_4':
            return goGamePath(4, xjGameSportsMaintain.value);
          case 'game_id_5':
            return goGamePath(5, agGameSportsMaintain.value);
          default:
            return;
        }
      });
    });

    onUnmounted(() => {
      proxy.mittBus.off('allGameEntrance');
      proxy.mittBus.on('toJumpBClent');
    });

    onActivated(() => {
      // allGameEntrance();
      for (let i = 0; i < gameTabsList.length; i++) {
        getMaintainStatus(i + 1);
      }
    });
    return {
      iaGameSports,
      sbGameSports,
      pbGameSports,
      xjGameSports,
      iaGameSportsUn,
      sbGameSportsUn,
      pbGameSportsUn,
      xjGameSportsUn,
      iaGameSportsMaintain,
      sbGameSportsMaintain,
      pbGameSportsMaintain,
      xjGameSportsMaintain,
      agGameSportsMaintain,
      gameTabsList,
      iaGameUrl,
      sbGameUrl,
      pbGameUrl,
      xjGameUrl,
      agGameUrl,
      iaGameText,
      sbGameText,
      pbGameText,
      xjGameText,
      agGameText,
      iaGameLock,
      sbGameLock,
      pbGameLock,
      xjGameLock,
      agGameLock,
      gameMaintainShow,
      allGameEntrance,
      goGamePath,
      isiOS,
      newGameTabsList,
      pubMaintainText
    };
  }
});
</script>

<style lang="less" scoped>
.v-games {
  display: flex;
  //margin: 0 10px 0 15px;
  width: 100%;
  justify-content: space-between;
  color: #fff;
  :deep(.van-swipe) {
    overflow: visible;
  }
  &-tabs {
    display: -webkit-box;
    width: 100%;
    height: 120px;
    padding: 0 10px 0 15px;
    overflow-x: auto;
    overflow-y: hidden;
    &-main {
      width: 135px;
      height: 100%;
    }
  }
  img {
    width: 100%;
    height: 100%;
  }
  &-l {
    position: relative;
    height: 100%;
    width: calc(100% - 6px);
  }
  &-m {
    position: relative;
    height: 100%;
    width: calc(100% - 6px);
  }
  &-r {
    position: relative;
    height: 100%;
    width: calc(100% - 6px);
    .is-ios {
      position: absolute;
      display: block;
      bottom: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
  }
  .home-game-bg::before {
    content: '维护中';
    position: absolute;
    left: 0;
    right: 0;
    top: 20px;
    bottom: 0;
    background: url('../../../../assets/wallet/wallet-maintain.png') rgba(0, 0, 0, 0) no-repeat;
    background-position-x: center;
    background-position-y: 30px;
    background-size: 24px 25px;
    text-align: center;
    padding-top: 60px;
    font-size: 12px;
  }
  .v-games-l-text {
    position: absolute;
    display: flex;
    flex-direction: column;
    bottom: 10px;
    left: 5px;
    span:nth-child(1) {
      font-size: 12px;
      color: #fff;
      font-weight: bold;
    }
    span:nth-child(2) {
      margin-top: 3px;
      font-size: 10px;
      color: #d9caf7;
      font-weight: 300;
    }
  }
  :deep(.van-dialog) {
    background: transparent;
    border-radius: 8px;
  }
  :deep(.van-dialog__header) {
    height: 40px;
    line-height: 40px;
    background-color: #3e4a53;
    padding: 0;
    font-size: 14px;
    color: #fff;
  }
  :deep(.van-dialog__content) {
    background-color: #2d363d;
    padding: 10px 10px;
    height: 170px;
    font-size: 14px;
    color: #94a5b1;
  }
  .game-maintain-content {
    display: flex;
    height: 120px;
    overflow: hidden;
  }
  .game-maintain-button {
    display: flex;
    justify-content: center;
    span {
      display: flex;
      width: 110px;
      height: 40px;
      line-height: 40px;
      justify-content: center;
      border-radius: 8px;
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      font-family: PingFang-SC;
      font-size: 14px;
      color: #1a242c;
    }
  }
}
</style>
