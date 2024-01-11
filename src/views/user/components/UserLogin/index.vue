<template>
  <div class="v-user-login">
    <div class="v-user-login-logo">
      <!--      <svg-icon class="v-user-login-logo-svg" icon-class="logo" />-->
      <img :src="logo" alt="">
    </div>
    <div class="v-user-login-form">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="account"
            autocomplete="off"
            maxlength="32"
            name="account"
            label="账号"
            placeholder="请输入手机号/用户名"
            :rules="[{ required: true, message: '请输入账号' }]"
          />
          <van-field
            v-model="password"
            :type="!passwordStatus ? 'password' : 'text'"
            :right-icon="!passwordStatus ? 'closed-eye' : 'eye-o'"
            name="password"
            label="密码"
            maxlength="20"
            placeholder="请输入密码"
            autocomplete="off"
            :rules="[{ required: true, message: '请输入密码' }]"
            @click-right-icon="passwordStatus = !passwordStatus"
          />
          <van-field
            v-model="captcha_code"
            name="captcha_code"
            label="验证码"
            maxlength="4"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <template #button>
              <van-image class="login-code" :src="codeImg" @click="getLoginCodeImg">
                <template #loading>
                  <img style="width: 80px; height: 30px;" :src="errCodeImage" alt="">
                </template>
                <template #error>
                  <img style="width: 80px; height: 30px;" :src="errCodeImage" alt="">
                </template>
              </van-image>
            </template>
          </van-field>
        </van-cell-group>
        <div class="v-user-login-submit">
          <van-button :loading="loginLoading" loading-text="登录中..." round block type="primary" native-type="submit">
            登录
          </van-button>
        </div>
        <div class="v-user-login-keep">
          <div class="v-user-login-keep-forgot">
            <span @click="goPath('ForgotPassword')">找回密码</span>
          </div>
        </div>
      </van-form>
    </div>
    <div class="v-user-login-footer">
      <div class="v-user-login-footer-jump">
        <div class="v-user-login-footer-jump-svg" @click="goPath('Register')">
          <svg-icon icon-class="user-avatar" />
        </div>
        <div class="v-user-login-footer-jump-text">
          用户注册
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, getPersonalInfo, loginCodeImg } from '@/api/user.js';
import store from '@/store/index.js';
import { Toast } from 'vant';

export default defineComponent({
  components: {},
  setup() {
    const logo = require('@/assets/home/logo.png');
    const router = useRouter();
    /**
     * 用户名
     */
    const account = ref('');
    /**
     * 密码
     */
    const password = ref('');
    /**
     * 验证码
     */
    const captcha_code = ref('');
    /**
     * 密码是否显示
     */
    const passwordStatus = ref(false);
    /**
     * 验证码图片
     */
    const codeImg = ref('');
    /**
     * 验证码id
     */
    const codeId = ref('');
    /**
     * 登录按钮loading
     */
    const loginLoading = ref(false);
    /**
     * 验证码错误图片
     */
    const errCodeImage = require('@/assets/home/login-code-err.png');
    /**
     * 用户登录事件
     */
    const onSubmit = async(values: any) => {
      if (loginLoading.value) return;
      if (values.account.length < 6 || values.account.length > 32) {
        return Toast.fail('账号请输入6-32位手机号/用户名');
      }
      if (values.password.length < 6 || values.password.length > 20) {
        return Toast.fail('密码请输入6-20位数字和字母');
      }
      const obj = {
        captcha_id: codeId.value
      };
      const params = { ...obj, ...values };
      loginLoading.value = true;
      login(params)
        .then((res: any) => {
          if (+res.code === 1) {
            store.commit('user/SET_TOKEN', res.data.token);
            loginSuccess();
          }
        })
        .catch((err: any) => {
          Toast.fail(err.msg || err.message);
          loginLoading.value = false;
        });
    };
    /**
     * 登录成功
     */
    const loginSuccess = async() => {
      const userInfoData = await getPersonalInfo();
      if (userInfoData.data) {
        store.commit('user/SET_USER_INFO', JSON.stringify(userInfoData.data));
        Toast.success({
          message: '登录成功',
          duration: 100,
          onClose: () => {
            loginLoading.value = false;
            router.push('/');
          }
        });
      }
    };
    /**
     * 获取验证码图片
     */
    const getLoginCodeImg = async() => {
      const data = await loginCodeImg();
      await loginCodeImg()
        .then((res: any) => {
          if (+res.code === 1) {
            codeImg.value = data.data.captcha_src;
            codeId.value = data.data.captcha_id;
          }
        })
        .catch((err: any) => {
          Toast.fail(err.msg || err.message);
        });
    };
    /**
     * 跳转到忘记密码
     */
    const goPath = (row: string) => {
      router.push({ name: row });
    };
    onMounted(() => {
      getLoginCodeImg();
    });
    return {
      logo,
      loginLoading,
      errCodeImage,
      account,
      password,
      passwordStatus,
      captcha_code,
      codeId,
      codeImg,
      onSubmit,
      getLoginCodeImg,
      goPath,
      loginSuccess
    };
  }
});
</script>

<style lang="less" scoped>
.v-user-login {
  //height: 100%;
  margin-top: -27px;
  background: #1c2227;
  //margin: 0 15px;
  &-logo {
    display: flex;
    background-image: url('../../../../assets/home/login-footer-bg.png');
    background-size: 154px 48px;
    background-repeat: no-repeat;
    background-position: 13px -6px;
    align-items: center;
    justify-content: center;
    padding: 70px 0 30px 0;
    img {
      width: 149px;
      height: 35px;
    }
  }
  &-form {
    padding: 0 15px;
  }
  :deep(.van-cell-group) {
    background-color: transparent;
  }
  :deep(.van-cell) {
    height: 40px;
    background: #2d363d;
    border-radius: 8px;
    margin-bottom: 18px;
    align-items: center;
    overflow: visible;
    .van-field__error-message {
      position: absolute;
      top: 29px;
    }
  }
  :deep(.van-cell::after) {
    border-bottom: 0;
  }
  :deep(.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after) {
    border-width: 0;
  }
  :deep(.van-field__control) {
    color: #fff;
  }
  :deep(.van-cell-group--inset) {
    margin: 0;
  }
  :deep(.van-field__label) {
    width: 50px;
    border-right: 1px solid #707d88;
    color: #b6c1cb;
    font-size: 12px;
    font-weight: 300;
  }
  :deep(input::-webkit-input-placeholder) {
    font-size: 12px;
    color: #707d88;
    font-weight: 300;
  }
  :deep(.van-popup) {
    background: #1c2227;
    color: #fff;
  }
  &-submit {
    margin-top: 5px;
    :deep(.van-button) {
      height: 40px;
      border-radius: 8px;
      font-size: 13px;
      color: #1a242c;
    }
    :deep(.van-button--primary) {
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      border: none;
    }
  }
  &-keep {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    &-forgot {
      font-size: 12px;
      font-weight: 300;
      color: #b6c1cb;
      background-image: linear-gradient(to right, #12dedf, #07c79c), linear-gradient(to bottom, #b6c1cb, #b6c1cb);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .login-code {
    position: absolute;
    top: -3px;
    right: 0;
    width: 80px;
    height: 30px;
  }
  &-footer {
    display: flex;
    flex-direction: column;
    div {
      text-align: center;
    }
    &-jump {
      font-size: 12px;
      font-weight: 300;
      &-svg {
        width: 37px;
        height: 37px;
        line-height: 37px;
        border-radius: 37px;
        background-color: #234fdc;
        margin: 0 auto;
      }
      &-text {
        color: #b6c1cb;
        line-height: 30px;
      }
    }
  }
}
</style>
