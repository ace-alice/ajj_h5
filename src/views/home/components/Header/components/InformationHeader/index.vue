<template>
  <div class="v-menu-header">
    <div class="v-menu-header-image">
      <van-image width="73" height="73" :src="userInfo.avatar_url">
        <template #loading>
          <img style="width: 73px; height: 73px;" :src="defaultImage" alt="">
        </template>
        <template #error>
          <img style="width: 73px; height: 73px;" :src="defaultImage" alt="">
        </template>
      </van-image>
    </div>
    <div v-if="userInfo.id">
      <div class="v-menu-header-name">
        <span>{{ userInfo.username }}</span>
        <span v-if="userInfoVip" class="userinfo-vip">
          <span>V{{ vipInfo.vip_current_level }}</span>
        </span>
        <svg-icon icon-class="personal-copy" @click="copy(userInfo.username)" />
      </div>
      <div class="v-menu-header-phone">{{ phoneHandling(userInfo.phone) }}</div>
      <div class="v-menu-header-vip">
        <span>{{ 'VIP' + (vipInfo.vip_current_level || '') }}</span>
        <van-progress color="#07c79c" stroke-width="3" :show-pivot="false" :percentage="vipInfo.upgrade_percentage" />
        <span @click="goPath('VipClub')">
          升级福利
          <svg-icon icon-class="personal-withdraw-right" />
        </span>
      </div>
    </div>
    <div v-if="!userInfo.id" class="v-un-login-header">
      <span>欢迎来到小艾竞技</span>
      <span @click="goPath('Login')">去登录</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onActivated, ref } from 'vue';
import store from '@/store/index.js';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { useRouter } from 'vue-router';
import { getPersonalInfo } from '@/api/user.js';
import { phoneHandling } from '@/utils/index.js';
import { Toast } from 'vant';
import useClipboard from 'vue-clipboard3';
import { vipCurrent } from '@/api/vip.js';
export default defineComponent({
  components: { SvgIcon },
  props: {
    userInfoVip: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const { toClipboard } = useClipboard();
    const defaultImage = require('@/assets/home/defaultImage.png');
    const router = useRouter();
    const userInfo = computed(() => store.getters.getUserInfo);
    const vipInfo = ref({});
    const goPath = (row: string) => {
      router.push({ name: row });
    };
    const getUserInfo = async() => {
      const userInfoData = await getPersonalInfo();
      if (userInfoData.data) {
        store.commit('user/SET_USER_INFO', JSON.stringify(userInfoData.data));
      }
    };
    const getVipCurrent = async() => {
      const data = await vipCurrent();
      if (+data.code === 1) {
        // console.log(data.data)
        vipInfo.value = data.data;
      }
    };
    /**
     * 复制功能
     * @param msg
     */
    const copy = async(msg: any) => {
      try {
        await toClipboard(msg);
        Toast.success({
          message: '复制成功',
          duration: 1500
        });
      } catch (e) {
        // console.log(e)
      }
    };
    onActivated(() => {
      if (userInfo.value.id) {
        getUserInfo();
        getVipCurrent();
      }
    });
    return {
      copy,
      userInfo,
      defaultImage,
      phoneHandling,
      goPath,
      getUserInfo,
      getVipCurrent,
      vipInfo
    };
  }
});
</script>

<style lang="less" scoped>
@import '~@/styles/home/header/index.less';
.v-menu-header-image {
  .van-image {
    border-radius: 73px;
    overflow: hidden;
    background: #fff;
  }
}
.v-un-login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  span:nth-child(1) {
    font-size: 14px;
    color: #fff;
  }
  span:nth-child(2) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 74px;
    height: 30px;
    border-radius: 15px;
    background-image: linear-gradient(to right, #12dedf, #07c79c);
    font-size: 13px;
    color: #1a242c;
  }
}
</style>
