<template>
  <div class="v-edit-phone">
    <div class="v-edit-phone-main">
      <van-form>
        <van-cell-group>
          <van-field
            v-model="phone.old_phone"
            name="oldPhone"
            :rules="[{ validator: registerPhoneValidator }]"
            placeholder="旧手机"
            autocomplete="off"
            maxlength="20"
          />
          <van-field
            v-model="phone.new_phone"
            name="newPhone"
            :rules="[{ validator: registerPhoneValidator }]"
            placeholder="新手机"
            autocomplete="off"
            maxlength="20"
          />
          <van-field
            v-model="phone.captcha_code"
            name="captcha_code"
            type="number"
            center
            clearable
            autocomplete="off"
            maxlength="6"
            placeholder="验证码"
            :rules="[{ validator: accountCodeValidator }]"
          >
          </van-field>
          <div class="send-code">
            <span v-if="!codeWhether" class="code-text" @click="sendCode">{{ codeText }}</span>
            <span v-else class="code-text">{{ codeNumber + 's' }}后重发</span>
          </div>
        </van-cell-group>
      </van-form>
    </div>
    <div class="v-edit-phone-footer">
      <van-button class="cancel" color="#3e4a53" @click="cancel">
        取消
      </van-button>
      <van-button class="submit" @click="submit" type="primary">
        保存
      </van-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted, reactive } from 'vue';
import PubHeader from '@/components/PubHeader/index.vue';
import store from '@/store/index.js';
import { parseTime, phoneHandling } from '@/utils/index.js';
import { setPhone, phoneCaptcha } from '@/api/setting.js';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
export default defineComponent({
  components: { PubHeader },
  emit: ['cancel'],
  setup(props, content) {
    const router = useRouter();
    const userInfo = computed(() => store.getters.getUserInfo);
    const visiable = ref(false);
    const phone = reactive({
      old_phone: '',
      new_phone: '',
      captcha_code: ''
    });
    /**
     * 验证码文字
     */
    const codeText = ref('发送验证码');
    /**
     * 是否点击验证码
     */
    const codeWhether = ref(false);
    /**
     * 验证码倒计时
     */
    const codeNumber = ref(120);
    /**
     * 验证码验证
     */
    const accountCodeValidator = (value: any) => {
      const reg = /^\d{6}$/;
      if (value === '') {
        return '验证码不能为空';
      } else if (!reg.test(value)) {
        return '请输入6位短信验证码';
      } else {
        return true;
      }
    };
    /**
     * 发送验证码
     */
    const sendCode = async () => {
      await phoneCaptcha({ phone: phone.new_phone })
        .then((res: any) => {
          if (+res.code === 1) {
            Toast.success({
              message: '验证码发送成功',
              duration: 1000
            });
            codeWhether.value = true;
            const timer = setInterval(() => {
              --codeNumber.value;
              if (codeNumber.value < 1) {
                clearInterval(timer);
                codeNumber.value = 60;
                codeWhether.value = false;
              }
            }, 1000);
          }
        })
        .catch((err: any) => {
          Toast.fail(err.msg || err.message);
        });
    };
    /**
     * 账号验证
     */
    const registerPhoneValidator = (value: any) => {
      const reg = /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/;
      if (value === '') {
        return '请输入手机号';
      } else if (!reg.test(value)) {
        return '请输入正确的手机号';
      } else {
        return true;
      }
    };
    /**
     * 取消
     */
    const cancel = () => {
      content.emit('cancel');
    };
    const submit = async () => {
      await setPhone(phone)
        .then((res: any) => {
          if (+res.code === 1) {
            Toast.success({
              message: '手机号修改成功',
              duration: 1000
            });
            setTimeout(() => {
              content.emit('cancel');
            }, 2000);
          }
        })
        .catch((err: any) => {
          Toast.fail(err.msg || err.message);
        });
    };
    return {
      userInfo,
      visiable,
      phone,
      codeWhether,
      codeNumber,
      codeText,
      phoneHandling,
      accountCodeValidator,
      sendCode,
      registerPhoneValidator,
      cancel,
      submit
    };
  }
});
</script>
<style lang="less" scoped>
.v-edit-phone {
  &-main {
    margin: 18px 15px;
    position: relative;
    :deep(.van-cell-group) {
      background-color: #2d363d !important;
    }
    :deep(.van-cell) {
      height: 40px;
      background: #3e4a53 !important;
      border-radius: 8px;
      margin-bottom: 18px !important;
      align-items: center;
      overflow: visible;
      .van-field__error-message {
        position: absolute;
        top: 35px;
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
    // :deep(.van-dialog__cancel) {
    //   background-color: #3e4a53 !important;
    //   color: #94a5b1 !important;
    // }
    .send-code {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }
    .code-text {
      background-image: linear-gradient(to right, #12dedf, #07c79c), linear-gradient(to bottom, #707d88, #707d88);
      -webkit-background-clip: text;
      color: transparent;
      font-size: 12px;
      font-weight: 300;
    }
    &-submit {
      position: relative;
      left: 0;
      bottom: 0;
      right: 0;
      margin-top: 20px;
      // display: flex;
      // justify-content: flex-end;
      // :deep(.van-button) {
      //   height: 40px;
      //   border-radius: 8px;
      //   font-size: 13px;
      //   margin-left: 25px;
      // }
      // :deep(.van-button--primary) {
      //   background-image: linear-gradient(to right, #12dedf, #07c79c);
      //   border: none;
      // }
    }
  }
  &-footer {
    position: relative;
    bottom: -10px;
    button {
      width: 50%;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
    .cancel {
      background-color: #3e4a53;
      color: #94a5b1;
      border-bottom-right-radius: 0;
    }
    .submit {
      border-bottom-left-radius: 0;
      background-image: linear-gradient(to top, #12dedf, #07c79c);
      color: #1a242c;
      border: 1px solid #07c79c !important;
    }
  }
}
</style>
