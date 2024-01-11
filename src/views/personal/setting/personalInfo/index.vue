<template>
  <div class="v-personal-info">
    <PubHeader :right-icon="false" path="Personal" />
    <div class="v-personal-info-main">
      <van-cell-group inset>
        <van-cell is-link @click="goPath('EditAvatar')">
          <template #title>
            <span>头像</span>
          </template>
          <template #value>
            <span class="v-personal-info-main-img">
              <van-image :src="userInfo.avatar_url">
                <template #loading>
                  <img style="width: 32px; height: 32px;" :src="defaultImage" />
                </template>
                <template #error>
                  <img style="width: 32px; height: 32px;" :src="defaultImage" />
                </template>
              </van-image>
            </span>
          </template>
        </van-cell>
        <van-cell :is-link="!userInfo.birthday" @click="goPath('EditBirthday')">
          <template #title>
            <span>生日</span>
          </template>
          <template #value>
            <span :class="{ 'bind-phone': userInfo.birthday }">{{ timeHandling(userInfo.birthday) }}</span>
          </template>
        </van-cell>
        <van-cell>
          <template #title>
            <span>用户名</span>
          </template>
          <template #value>
            <span class="bind-phone">{{ userInfo.username }}</span>
          </template>
        </van-cell>
        <van-cell>
          <template #title>
            <span>绑定手机号</span>
          </template>
          <template #value>
            <span class="phone">{{ phoneHandling(userInfo.phone) }}</span>
            <span class="change" @click="visiable = !visiable">更换</span>
          </template>
        </van-cell>
      </van-cell-group>
      <van-dialog
        v-model:show="visiable"
        title="更换手机号"
        :close-on-click-overlay="true"
        :show-cancel-button="false"
        :show-confirm-button="false"
      >
        <editPhone @cancel="visiable = false"></editPhone>
      </van-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import PubHeader from '@/components/PubHeader/index.vue';
import { useRouter } from 'vue-router';
import store from '@/store/index.js';
import { parseTime, phoneHandling } from '@/utils/index.js';
import editPhone from './editPhone/index.vue';

export default defineComponent({
  name: 'PersonalInfo',
  components: {
    PubHeader,
    editPhone
  },
  setup() {
    const router = useRouter();
    /**
     * 个人头像
     */
    const userInfo = computed(() => store.getters.getUserInfo);
    const defaultImage = require('@/assets/home/defaultImage.png');
    const visiable = ref(false);
    /**
     * 用户昵称
     */
    const nickname = ref('');
    /**
     * 用户生日
     */
    const birthday = ref('');
    /**
     * 修改个人资料
     */
    const personalInfoSubmit = (values: any) => {
      // console.log('submit', values)
    };
    /**
     * 时间处理
     */
    const timeHandling = (time: string | number) => {
      if (time) {
        return parseTime(time, '{y}-{m}-{d}');
      }
    };
    const goPath = (row: string) => {
      if (row === 'EditBirthday' && userInfo.value.birthday) return;
      router.push({ name: row });
    };
    return {
      userInfo,
      nickname,
      birthday,
      defaultImage,
      visiable,
      personalInfoSubmit,
      goPath,
      timeHandling,
      phoneHandling
    };
  }
});
</script>

<style lang="less" scoped>
.v-personal-info {
  &-main {
    margin-top: 48px;
    &-img {
      display: flex;
      justify-content: flex-end;
    }
    :deep(.van-image) {
      width: 34px;
      height: 34px;
      border-radius: 34px;
      overflow: hidden;
    }
    :deep(.van-cell-group--inset) {
      margin: 0 15px 25px 15px;
    }
    :deep(.van-cell) {
      height: 50px;
      background-color: #2d363d;
      color: #fff;
      margin-bottom: 5px;
      border-radius: 4px;
      font-weight: 300;
      font-size: 12px;
      align-items: center;
    }
    :deep(.van-cell::after) {
      border-bottom: 0;
    }
    :deep(.van-cell-group) {
      background-color: #1c2227;
      border-radius: 0;
    }
    :deep(.van-cell__right-icon) {
      font-size: 12px;
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
      padding: 10px 0;
      // height: 200px;
      font-size: 12px;
      color: #94a5b1;
    }
    .bind-phone {
      padding-right: 15px;
    }
    .phone {
      margin-right: 12px;
    }
    .change {
      background-color: #0fd7cb;
      border-radius: 36px;
      display: inline-block;
      padding: 2px 15px;
      color: #000;
    }
  }
}
</style>
