<template>
  <div class="v-account-password">
    <PubHeader :right-icon="false" />
    <div class="v-account-password-main">
      <van-form ref="accountForm" @submit="updateAccountPwd">
        <van-cell-group inset>
          <van-field
            v-model="state.phone"
            name="phone"
            label="账号"
            type="number"
            maxlength="11"
            autocomplete="off"
            placeholder="请输入账号"
            :rules="[{validator: forgotPhoneValidator}]"
          />
          <van-field
            v-model="state.password_new"
            :type="!passwordStatus ? 'password' : 'text'"
            :right-icon="!passwordStatus ? 'closed-eye' : 'eye-o'"
            name="password"
            label="新密码"
            autocomplete="off"
            maxlength="20"
            placeholder="请输入6-20位数字和英文"
            :rules="[{validator: forgotPwdValidator}]"
            @click-right-icon="passwordStatus = !passwordStatus"
          />
          <van-field
            v-model="state.password_confirm"
            :type="!newPasswordStatus ? 'password' : 'text'"
            :right-icon="!newPasswordStatus ? 'closed-eye' : 'eye-o'"
            name="new_password"
            label="确认密码"
            placeholder="请再次输入密码"
            :rules="[{validator: forgotPwdValidator}]"
            @click-right-icon="newPasswordStatus = !newPasswordStatus"
          />
          <van-field
            v-model="state.captcha_code"
            name="captcha_code"
            center
            clearable
            label="验证码"
            maxlength="6"
            type="number"
            placeholder="请输入验证码"
            :rules="[{ validator: forgotCodeValidator }]"
          >
            <template #button>
              <span v-if="!codeWhether" class="code-text" @click="sendCode">{{
                codeText
              }}</span>
              <span v-else class="code-text">{{ codeNumber + 's' }}后重发</span>
            </template>
          </van-field>
        </van-cell-group>
        <div class="v-account-password-main-submit">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import PubHeader from '@/components/PubHeader/index.vue'
import store from '@/store/index.js'
import { findPassword, getPhoneCode } from '@/api/user.js'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'

export default defineComponent({
  components: {
    PubHeader
  },
  setup() {
    const router = useRouter()
    const accountForm = ref(null)
    /**
     * 验证码文字
     */
    const codeText = ref('发送验证码')
    /**
     * 是否点击验证码
     */
    const codeWhether = ref(false)
    /**
     * 验证码倒计时
     */
    const codeNumber = ref(60)
    /**
     * 账户密码显示状态
     */
    const passwordStatus = ref(false)
    /**
     * 账户确认密码显示状态
     */
    const newPasswordStatus = ref(false)
    /**
     * 用户信息
     */
    const userInfo = computed(() => store.getters.getUserInfo)
    const state = reactive({
      phone: '',
      password_new: '',
      password_confirm: '',
      captcha_code: ''
    })
    /**
     * 手机号验证
     */
    const forgotPhoneValidator = (value: any) => {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (value === '') {
        return '请输入账号'
      } else if (!reg.test(value)) {
        return '请输入正确的手机号'
      } else {
        return true
      }
    }
    /**
     * 密码验证
     */
    const forgotPwdValidator = (value: any) => {
      const reg = /(\w)*(\w)\2{2}(\w)*/g
      const reg1 = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
      const reg2 = /^(?!.*([!-~])\1{2,})(?!.*(?:012|210|123|321|234|432|345|543|456|654|567|765|678|876|789|987)).+$/i
      if (value === '') {
        return '请输入新密码'
      } else if (reg.test(value)) {
        return '密码不可使用超过3个相同的字母或数字'
      } else if (!reg1.test(value)) {
        return '密码必须包含字母和数字'
      } else if (state.phone && value.indexOf(state.phone) !== -1) {
        return '密码不可包含用户手机号'
      } else if (!reg2.test(value)) {
        return '密码不可使用超过3个连续数字'
      } else {
        return true
      }
    }
    /**
     * 验证码验证
     */
    const forgotCodeValidator = (value: any) => {
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
     * 发送验证码
     */
    const sendCode = async() => {
      if (!state.phone) return Toast.fail('请输入正确的手机号')
      await getPhoneCode({ phone: state.phone }).then((res: any) => {
        if (+res.code === 1) {
          Toast.success({
            message: '验证码发送成功',
            duration: 1000
          })
          codeWhether.value = true
          const timer = setInterval(() => {
            --codeNumber.value
            if (codeNumber.value < 1) {
              clearInterval(timer)
              codeNumber.value = 60
              codeWhether.value = false
            }
          }, 1000)
        }
      }).catch((err: any) => {
        Toast.fail(err.msg || err.message)
      })
    }
    /**
     * 修改账户密码
     * @param values 填写的参数
     */
    const updateAccountPwd = async() => {
      await findPassword(state).then((res: any) => {
        if (+res.code === 1) {
          Toast.success({
            message: '用户密码找回成功',
            duration: 1000
          })
          router.push({ name: 'Login' })
        }
      }).catch((err: any) => {
        Toast.fail(err.msg || err.message)
      })
    }
    return {
      accountForm,
      codeText,
      codeWhether,
      codeNumber,
      state,
      userInfo,
      passwordStatus,
      newPasswordStatus,
      forgotCodeValidator,
      forgotPwdValidator,
      forgotPhoneValidator,
      updateAccountPwd,
      sendCode
    }
  }
})
</script>

<style lang="less" scoped>
.v-account-password {
  &-main {
    margin: 48px 15px 25px 15px;
    :deep(.van-cell-group) {
      background-color: transparent;
    }
    :deep(.van-cell) {
      height: 40px;
      background: #2d363d;
      border-radius: 8px;
      margin-bottom: 20px;
      align-items: center;
      overflow: visible;
      .van-field__error-message {
        position: absolute;
        top: 30px;
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
      width: 80px;
      border-right: 1px solid #707d88;
      color: #b6c1cb;
      font-size: 12px;
      font-weight: 300;
      margin-left: -10px;
      text-align: center;
    }
    :deep(.van-field__control:read-only) {
      color: #707d88 !important;
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
    .code-text {
      background-image: linear-gradient(to right, #12dedf, #07c79c),
        linear-gradient(to bottom, #707d88, #707d88);
      -webkit-background-clip: text;
      color: transparent;
      font-size: 12px;
      font-weight: 300;
    }
    &-submit {
      :deep(.van-button) {
        margin-top: 5px;
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
  }
}
</style>
