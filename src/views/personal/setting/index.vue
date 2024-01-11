<template>
  <div class="v-setting">
    <PubHeader :right-icon="false" path="Personal" />
    <div class="v-setting-main">
      <van-cell-group inset>
        <van-cell is-link @click="goPath('AccountPassword')">
          <template #title>
            <span>账户密码</span>
          </template>
        </van-cell>
        <van-cell is-link @click="goPath('TransactionPassword')">
          <template #title>
            <span>交易密码</span>
          </template>
          <template #value>
            <span v-if="+userInfo.funds_password === 0">未设置</span>
          </template>
        </van-cell>
        <van-cell @click="goPath('ChooseLanguage')">
          <template #title>
            <span>语言</span>
          </template>
          <template #value>
            <span>简体中文</span>
          </template>
        </van-cell>
        <van-cell>
          <template #title>
            <span>版本更新</span>
          </template>
          <template #value>
            <span>当前版本：V1.0.1</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <div class="v-setting-footer">
      <van-button round block type="primary" @click="signOut">
        退出登录
      </van-button>
    </div>
    <div class="v-setting-dialog">
      <van-dialog
        v-model:show="settingDialogShow"
        title="退出登录"
        show-cancel-button
        @confirm="signOutConfirm"
      >
        是否退出登录
      </van-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import PubHeader from '@/components/PubHeader/index.vue'
import { useRouter } from 'vue-router'
import store from '@/store/index.js'
import { signOutUser } from '@/api/user.js'
import { Toast } from 'vant';

export default defineComponent({
  name: 'Setting',
  components: {
    PubHeader
  },
  setup() {
    const userInfo = computed(() => store.getters.getUserInfo)
    /**
     * 使用路由
     */
    const router = useRouter()
    /**
     * 退出登录弹窗状态
     */
    const settingDialogShow = ref(false)
    /**
     * 路由跳转
     * @param name 路由name
     */
    const goPath = (name: string) => {
      if (name === 'ChooseLanguage') return
      router.push({ name: name })
    }
    /**
     * 退出登录弹窗
     */
    const signOut = () => {
      settingDialogShow.value = true
    }
    /**
     * 退出登录弹窗确认按钮事件
     */
    const signOutConfirm = async() => {
      await signOutUser().then((res: any) => {
        if (+res.code === 1) {
          store.commit('user/REMOVE_TOKEN')
          store.commit('user/REMOVE_USER_INFO')
          goPath('Login')
          setTimeout(() => {
            location.reload()
          }, 500)
        }
      }).catch((err: any) => {
        Toast.fail(err.msg || err.message)
      })
    }
    return {
      goPath,
      signOut,
      settingDialogShow,
      signOutConfirm,
      userInfo
    }
  }
})
</script>

<style lang="less" scoped>
.v-setting {
  &-main {
    margin-top: 48px;

    :deep(.van-cell-group--inset) {
      margin: 0 15px 25px 15px;
    }

    :deep(.van-cell) {
      background-color: #2d363d;
      color: #fff;
      margin-bottom: 5px;
      border-radius: 4px;
      font-weight: 300;
      font-size: 12px;
      height: 50px;
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
  }

  &-footer {
    padding: 0 15px;

    :deep(.van-button--round) {
      background-image: linear-gradient(to right, #12dedf, #07c79c);
    }

    :deep(.van-button) {
      border-radius: 8px;
      font-size: 13px;
      color: #fff;
    }
  }

  &-dialog {
    :deep(.van-dialog) {
      height: 154px;
      width: 68%;
      background-color: #2d363d;
    }

    :deep(.van-dialog__header) {
      height: 37px;
      line-height: 37px;
      padding: 0;
      background-color: #3e4a53;
      font-size: 12px;
      color: #fff;
    }

    :deep(.van-dialog__content) {
      line-height: 64px;
      text-align: center;
      font-size: 12px;
      font-weight: 300;
      color: #94a5b1;
    }

    :deep(.van-dialog__footer) {
      justify-content: center;
    }

    :deep(.van-dialog__cancel) {
      flex: none;
      width: 79px;
      height: 28px;
      margin-right: 24px;
      border-radius: 4px;
      background-color: #3e4a53;
      font-size: 12px;
      color: #94a5b1;
    }

    :deep(.van-dialog__confirm) {
      flex: none;
      width: 79px;
      height: 28px;
      margin-left: 24px;
      border-radius: 4px;
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      font-size: 12px;
      color: #fff;
    }

    :deep(.van-hairline--top::after) {
      border-top-width: 0;
    }

    :deep(.van-hairline--left::after) {
      border-left-width: 0;
    }
  }
}
</style>
