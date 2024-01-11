<template>
  <div class="v-userlogin">
    <!--    <div class="v-userlogin-logo">-->
    <!--      <svg-icon class="v-userlogin-logo-svg" icon-class="logo" />-->
    <!--    </div>-->
    <div class="v-userlogin-main">
      <van-form @submit="onRegisterSubmit">
        <van-cell-group inset>
          <van-field
            v-model="username"
            name="username"
            label="用户名"
            maxlength="32"
            autocomplete="off"
            placeholder="请输入6-32位数字和字母"
            :rules="[{validator: registerNameValidator}]"
          />
          <van-field
            v-model="phone"
            name="phone"
            label="手机号"
            type="number"
            maxlength="11"
            autocomplete="off"
            placeholder="请输入手机号"
            :rules="[{validator: registerPhoneValidator}]"
          />
          <van-field
            v-model="password"
            :type="!passwordStatus ? 'password' : 'text'"
            :right-icon="!passwordStatus ? 'closed-eye' : 'eye-o'"
            name="password"
            label="密码"
            autocomplete="off"
            maxlength="20"
            placeholder="请输入6-20位数字和字母"
            :rules="[{validator: registerPwdValidator}]"
            @click-right-icon="passwordStatus = !passwordStatus"
          />
          <van-field
            v-model="captcha_code"
            name="captcha_code"
            label="验证码"
            maxlength="6"
            type="number"
            placeholder="请输入验证码"
            :rules="[{ validator: registerCodeValidator }]"
          >
            <template #button>
              <div
                v-if="!countDown"
                style="color:#07c79c"
                @click.stop="registerSendCode"
              >
                发送验证码
              </div>
              <div v-else>
                <span style="color:#07c79c">{{ countDown }}s</span>后重新发送
              </div>
            </template>
          </van-field>
          <van-field
            v-model="invitation_code"
            name="invitation_code"
            label="推广码"
            :disabled="invitationStatus"
            placeholder="请输入推广码（非必填）"
          />
        </van-cell-group>
        <div class="v-userlogin-protocol">
          <img
            class="img-icon"
            :src="registerCheck ? registerActiveIcon : registerInactiveIcon"
            @click="registerStatus"
          >
          我已阅读并同意
          <span @click="goPath('TermsOfService')">服务条款</span>
          和
          <span @click="goPath('PrivacyPolicy')">隐私政策</span>
        </div>
        <div class="v-userlogin-submit">
          <van-button
            round
            block
            :disabled="!registerCheck"
            type="primary"
            native-type="submit"
          >
            注册
          </van-button>
        </div>
      </van-form>
    </div>
    <div class="v-userlogin-footer">
      <div class="v-userlogin-footer-jump">
        <div class="v-userlogin-footer-jump-svg" @click="goPath('Login')">
          <svg-icon icon-class="user-avatar" />
        </div>
        <div class="v-userlogin-footer-jump-text">
          返回登录
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  phoneRegister,
  getPersonalInfo,
  registerPhoneCaptcha
} from '@/api/user.js'
import store from '@/store/index.js'
import { Toast } from 'vant'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default defineComponent({
  components: {
    SvgIcon
  },
  setup() {
    const registerCheck = ref(false)
    const registerActiveIcon = require('@/assets/wallet/wallet-active.png')
    const registerInactiveIcon = require('@/assets/wallet/wallet-unactive.png')
    const router = useRouter()
    const route = useRoute()
    /**
     * 用户名
     */
    const username = ref('')
    /**
     * 手机号
     */
    const phone = ref('')
    /**
     * 密码
     */
    const password = ref('')
    /**
     * 验证码
     */
    const captcha_code = ref('')
    /**
     * 推广码
     */
    const invitation_code = ref('')
    const countDown = ref(0)
    /**
     * 密码是否显示
     */
    const passwordStatus = ref(false)
    /**
     * 协议弹窗状态
     */
    const protocolShow = ref(false)
    const invitationStatus = ref(false)

    const invitationCodeUrl = () => {
      const invitationCode: any = route.query.invitation_code
      if (invitationCode) {
        invitationStatus.value = true
        invitation_code.value = invitationCode
      } else {
        invitationStatus.value = false
      }
    }

    const registerPwdValidator = (value: any) => {
      const reg = /(\w)*(\w)\2{2}(\w)*/g
      const reg1 = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
      const reg2 = /^(?!.*([!-~])\1{2,})(?!.*(?:012|210|123|321|234|432|345|543|456|654|567|765|678|876|789|987)).+$/i
      if (value === '') {
        return '请输入密码'
      } else if (reg.test(value)) {
        return '密码不可使用超过3个相同的字母或数字'
      } else if (!reg1.test(value)) {
        return '密码必须包含字母和数字'
      } else if (phone.value && value.indexOf(phone.value) !== -1) {
        return '密码不可包含用户手机号'
      } else if (!reg2.test(value)) {
        return '密码不可使用超过3个连续数字'
      } else {
        return true
      }
    }
    /**
     * 账号验证
     */
    const registerPhoneValidator = (value: any) => {
      const reg = /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/
      if (value === '') {
        return '请输入手机号'
      } else if (!reg.test(value)) {
        return '请输入正确的手机号'
      } else {
        return true
      }
    }
    /**
     * 验证码验证
     */
    const registerCodeValidator = (value: any) => {
      const reg = /^\d{6}$/
      if (value === '') {
        return '请输入验证码'
      } else if (!reg.test(value)) {
        return '请输入6位短信验证码'
      } else {
        return true
      }
    }
    /**
     * 验证用户名
     */
    const registerNameValidator = (value: any) => {
      const reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,32}$/
      if (value === '') {
        return '请输入用户名'
      } else if (!reg.test(value)) {
        return '用户名请输入6-32位数字和字母'
      } else {
        return true
      }
    }
    /**
     * 用户注册事件
     */
    const onRegisterSubmit = async(values: any) => {
      if (route.query.invite_id) {
        values.invite_id = route.query.invite_id
      }
      if (route.query.code || localStorage.getItem('requestCode')) {
        values.code = route.query.code || localStorage.getItem('requestCode')
      }
      await phoneRegister(values).then((res: any) => {
        if (+res.code === 1) {
          store.commit('user/SET_TOKEN', res.data.token)
          Toast.success({
            message: '注册成功',
            duration: 100,
            onClose: () => {
              getPersonalInfo({ member_id: res.data.id })
                .then((resp: any) => {
                  if (+resp.code === 1) {
                    store.commit('user/SET_USER_INFO', JSON.stringify(resp.data))
                    router.push('/')
                  }
                })
                .catch((error: any) => {
                  Toast.fail(error.msg || error.message)
                })
            }
          })
        }
      }).catch((err: any) => {
        Toast.fail(err.msg || err.message)
      })
    }
    const registerStatus = () => {
      registerCheck.value = !registerCheck.value
    }
    /**
     * 跳转到忘记密码
     */
    const goPath = (row: string) => {
      router.push({ name: row })
    }
    let timer: any = null
    const registerSendCode = async() => {
      await registerPhoneCaptcha({ phone: phone.value }).then((res: any) => {
        if (+res.code === 1) {
          countDown.value = 60
          timer = setInterval(() => {
            countDown.value--
            if (Number(countDown.value) === 0) {
              clearInterval(timer)
              timer = null
            }
          }, 1000)
        }
      }).catch((err: any) => {
        Toast.fail(err.msg || err.message)
      })
    }
    onMounted(() => {
      invitationCodeUrl()
    })
    return {
      username,
      registerCheck,
      registerActiveIcon,
      registerInactiveIcon,
      phone,
      password,
      passwordStatus,
      protocolShow,
      countDown,
      invitation_code,
      invitationStatus,
      registerNameValidator,
      registerPhoneValidator,
      onRegisterSubmit,
      registerStatus,
      captcha_code,
      registerPwdValidator,
      goPath,
      registerSendCode,
      registerCodeValidator,
      invitationCodeUrl
    }
  }
})
</script>

<style lang="less" scoped>
.v-userlogin {
  height: calc(100% - 174px);
  overflow: auto;
  margin-top: -27px;
  background: #1c2227 url('../../../../assets/home/login-footer-bg.png') no-repeat 13px -6px;
  background-size: 154px 48px;
  &-main {
    margin: 45px 15px 0 15px;
  }
  &-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px 0;
    &-svg {
      width: 149px;
      height: 35px;
    }
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
  &-protocol {
    display: flex;
    margin-bottom: 15px;
    font-size: 12px;
    color: #707d88;
    line-height: 16px;
    img {
      width: 15px;
      height: 15px;
      margin: 0 5px 0 15px;
    }
    span {
      color: #0dd4c1;
    }
  }
  &-submit {
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
  &-footer {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
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
