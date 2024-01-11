<template>
  <div class="v-add-bank-card">
    <AddHeader card-name="bank-list" :step="step" @changeStep="changeStep" />
    <div class="v-add-bank-card-main">
      <van-form @submit="nextStep">
        <van-cell-group inset>
          <van-field
            v-model="formData.owner_name"
            name="开户人"
            label="开户人"
            autocomplete="off"
            placeholder="请输入开户人真实姓名"
            maxlength="20"
            :disabled="step == 2"
            :rules="[{ required: true, message: '请输入开户人真实姓名' }]"
          />
          <van-field
            v-model="formData.bank_id"
            name="开户银行"
            label="开户银行"
            placeholder="请选择开户行"
            readonly
            :rules="[{ required: true, message: '请选择开户行' }]"
            @click="showBankClick"
          >
            <template v-if="formData.bank_id" #input>
              <div class="bank-img-box">
                <van-image
                  height="20"
                  width="20"
                  style="margin-right:10px"
                  :src="formData.bank_logo"
                >
                  <template #error>
                    <img :src="bankDefaultImage" style="width:20px" alt="">
                  </template>
                  <template #loading>
                    <img :src="bankDefaultImage" style="width:20px" alt="">
                  </template>
                </van-image>
                {{ formData.bank_name }}
              </div>
            </template>
          </van-field>
          <van-field
            v-model="formData.place"
            name="开户城市"
            label="开户城市"
            is-linked
            readonly
            placeholder="请选择开户城市"
            :rules="[{ required: true, message: '请选择开户城市' }]"
            @click="showAreaClick"
          >
            <template v-if="formData.province && formData.place" #input>
              <div v-show="formData.province && formData.place">
                {{ formData.province }} >> {{ formData.place }}
              </div>
            </template>
          </van-field>
          <van-field
            v-model="formData.bank_account"
            name="银行卡号"
            label="银行卡号"
            autocomplete="off"
            :disabled="step == 2"
            placeholder="请输入银行卡号"
            maxlength="20"
            :rules="[{ required: true, message: '请输入银行卡号' }]"
          />
          <template v-if="step == 1">
            <van-field
              v-model="formData.phone"
              name="手机号"
              label="手机号"
              placeholder="请输入手机号"
              :formatter="phoneHandling"
              maxlength="11"
              disabled
            />
            <van-field
              v-model="formData.captcha_code"
              name="验证码"
              label="验证码"
              placeholder="请输入验证码"
              maxlength="6"
              :rules="[{ required: true, message: '请输入验证码' }]"
            >
              <template #button>
                <div
                  v-if="!countDown"
                  style="color:#07c79c"
                  @click.stop="sendCode"
                >
                  发送验证码
                </div>
                <div v-else>
                  <span style="color:#07c79c">{{ countDown }}s</span>后重新发送
                </div>
              </template>
            </van-field>
          </template>
        </van-cell-group>
        <div class="v-add-bank-card-main-submit">
          <van-button
            v-if="step == 1"
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading.next"
          >
            下一步
          </van-button>
          <van-button
            v-else
            :loading="loading.submit"
            round
            block
            type="primary"
            @click.stop="submitInfo"
          >
            确认提交
          </van-button>
        </div>
      </van-form>
    </div>
    <van-popup v-model:show="showArea" position="bottom">
      <van-picker
        v-model="popupAddr"
        title="请选择开户城市"
        :columns="areaList"
        :columns-field-names="areaFieldName"
        @cancel="showArea = false"
        @confirm="addressSure"
      />
    </van-popup>
    <van-popup v-model:show="showBank" position="bottom">
      <div class="v-popup-header">
        <span @click.stop="showBank = false">取消</span>
        <span>请选择开户银行</span>
        <span @click.stop="bankSure">确定</span>
      </div>
      <div class="bank-Box">
        <van-radio-group v-model="popupBank.bank_id">
          <van-cell-group inset>
            <van-cell
              v-for="item in bankList"
              :key="item.id"
              clickable
              :style="{ color: item.id == popupBank.bank_id ? '#fff' : '' }"
              @click="bankIdClick(item)"
            >
              <template #title>
                <span>{{ item.bank_name }}</span>
                <span v-if="item.bank_status === 2" class="radio-maintain">维护中</span>
              </template>
              <template #icon>
                <van-image
                  height="20"
                  width="20"
                  style="margin-right:10px"
                  :src="item.bank_logo"
                >
                  <template #error>
                    <img :src="bankDefaultImage" style="width:20px" alt="">
                  </template>
                  <template #loading>
                    <img :src="bankDefaultImage" style="width:20px" alt="">
                  </template>
                </van-image>
              </template>
              <template #right-icon>
                <van-radio :class="item.id == popupBank.bank_id ? 'van-radio__icon--checked' : ''" :name="item.id" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, Ref, ref } from 'vue'
import AddHeader from '../components/AddHeader/index.vue'
import { getAreaList, getBankInfoList } from '@/api/accountReceivable.js'
import { getUserInfo } from '@/utils/index.js'
import { addBankCard } from '@/api/accountReceivable.js'
import { Toast } from 'vant'
import toPathHook from '@/hooks/toPath'
import defaultImages from '@/hooks/defaultImages'
import { phoneHandling } from '@/utils/index.js'
import { phoneCaptcha, checkBank } from '@/api/withdraw.js'

const defaultForm = reactive({
  bank_account: null,
  bank_name: null,
  bank_address: null,
  place: null,
  province: null,
  owner_name: null,
  bank_id: null,
  bank_logo: null,
  captcha_code: null,
  phone: getUserInfo().phone
})

export default defineComponent({
  components: {
    AddHeader
  },
  setup() {
    const { bankDefaultImage } = defaultImages()

    const showArea = ref(false)
    const showBank = ref(false)
    const result = ref('')

    const formData:any = reactive(Object.assign({}, defaultForm))

    const popupAddr: Ref<any> = ref([])

    const popupBank = reactive({
      bank_id: null,
      bank_logo: null,
      bank_name: null
    })

    const areaList: Ref<any[]> = ref([])

    const areaFieldName = {
      text: 'cname',
      value: 'cname',
      children: 'children'
    }

    const bankList: Ref<any[]> = ref([])

    function getAreaListFun() {
      getAreaList().then((res: any) => {
        if (Number(res.code) === 1) {
          areaList.value = res.data
        }
      })
    }

    function getBankListFun() {
      getBankInfoList().then((res: any) => {
        if (Number(res.code) === 1) {
          bankList.value = res.data
        }
      })
    }

    function bankIdClick(item: any) {
      popupBank.bank_id = item.id
      popupBank.bank_name = item.bank_name
      popupBank.bank_logo = item.bank_logo
    }

    function bankSure() {
      formData.bank_id = popupBank.bank_id
      formData.bank_name = popupBank.bank_name
      formData.bank_logo = popupBank.bank_logo
      showBank.value = false
    }

    function addressSure() {
      if (popupAddr.value.length == 2) {
        formData.province = popupAddr.value[0]
        formData.place = popupAddr.value[1]
      }
      showArea.value = false
    }

    /**
     * 展示地区弹窗
     */
    const showAreaClick = () => {
      if (step.value == 2) return
      popupAddr.value = []
      if (formData.province) {
        popupAddr.value.push(formData.province)
        if (formData.place) {
          popupAddr.value.push(formData.place)
        }
      }
      showArea.value = true
    }

    /**
     * 展示地区弹窗
     */
    const showBankClick = () => {
      if (step.value == 2) return
      if (formData.bank_id) {
        Object.assign(popupBank, {
          bank_id: formData.bank_id,
          bank_name: formData.bank_name,
          bank_logo: formData.bank_logo
        })
      }
      showBank.value = true
    }

    const step = ref(1)

    const countDown = ref(0)

    const isPass = ref(false)

    let timer: any = null

    const sendCode = async() => {
      await phoneCaptcha().then((res: any) => {
        if (+res.code === 1) {
          countDown.value = 60
          timer = setInterval(() => {
            countDown.value--
            if (+countDown.value === 0) {
              clearInterval(timer)
              timer = null
            }
          }, 1000)
        }
      }).catch((err: any) => {
        Toast.fail(err.msg || err.message)
      })
    }

    function nextStep() {
      if (formData.captcha_code.length < 6) {
        return Toast.fail('请输入6位短信验证码')
      }
      checkBank(formData).then((res: any) => {
        if (+res.code === 1) {
          step.value = 2
        }
      }).catch((err: any) => {
        Toast.fail(err.msg || err.message)
      })
      // step.value = 2
    }

    const loading = reactive({
      next: false,
      submit: false
    })

    const { toPath } = toPathHook()

    function submitInfo() {
      loading.submit = true
      addBankCard(formData)
        .then((res: any) => {
          if (+res.code === 1) {
            Toast(res.msg || res.message)
            toPath({ name: 'AccountReceivable', query: { name: 'bank-list' }})
          }
        }).catch((err: any) => {
          Toast.fail(err.msg || err.message)
        })
        .finally(() => {
          loading.submit = false
        })
    }
    function changeStep() {
      formData.captcha_code = null
      countDown.value = 0
      clearInterval(timer)
      timer = null
      step.value = 1
    }
    onMounted(() => {
      getAreaListFun()
      getBankListFun()
    })

    return {
      result,
      showArea,
      areaList,
      showAreaClick,
      formData,
      showBankClick,
      showBank,
      areaFieldName,
      bankList,
      bankIdClick,
      popupAddr,
      popupBank,
      bankSure,
      addressSure,
      sendCode,
      countDown,
      isPass,
      phoneHandling,
      step,
      nextStep,
      loading,
      submitInfo,
      bankDefaultImage,
      changeStep
    }
  }
})
</script>

<style lang="less" scoped>
.v-add-bank-card {
  &-main {
    margin: 48px 15px 0 15px;
    :deep(.van-cell-group) {
      background-color: transparent;
    }
    :deep(.van-cell) {
      min-height: 40px;
      background: #2d363d;
      border-radius: 8px;
    }
    :deep(.van-cell) {
      margin-bottom: 20px;
      overflow: visible;
      .van-field__error-message {
        position: absolute;
        bottom: -30px;
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
      width: 100px;
      border-right: 1px solid #707d88;
      color: #b6c1cb;
      font-size: 12px;
      font-weight: 300;
      text-align: center;
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
  }
}

:deep(.van-popup) {
  .van-picker {
    background: none;
    .van-picker__confirm {
      color: #07c79c;
    }
    .van-picker__title {
      color: #fff;
    }
    .van-picker__cancel {
      color: #b6c1cb;
    }
    .van-picker-column__item {
      color: #94a5b1;
    }
    .van-picker-column__item--selected {
      color: #fff;
    }
    .van-picker__mask {
      background-image: linear-gradient(180deg, #2d363d90, #2d363d20),
        linear-gradient(0deg, #2d363d90, #2d363d20);
    }
  }
}

.v-popup-header {
  display: flex;
  width: calc(100% - 32px);
  padding: 0 16px;
  height: 40px;
  line-height: 40px;
  background-color: #3e4a53;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 14px;
  border-start-start-radius: 8px;
  border-start-end-radius: 8px;
  span:nth-child(1) {
    color: #b6c1cb;
  }
  .price-refresh {
    width: 19px;
    height: 19px;
  }
}
:deep(.van-popup) {
  background: #2d363d;
  border-start-start-radius: 8px;
  border-start-end-radius: 8px;
  .bank-Box {
    width: 100%;
    max-height: 40vh;
    overflow: auto;
    .radio-maintain {
      height: 18px;
      line-height: 18px;
      padding: 3px 10px;
      border-radius: 9px;
      background-color: #999;
      font-size: 10px;
      color: #fff;
      margin-left: 5px;
    }
  }
}
:deep(.van-cell-group) {
  background: #2d363d;
  .van-cell-group--inset {
    margin: 0;
  }
}

:deep(.van-cell-group--inset) {
  margin: 0;
}
:deep(.van-cell) {
  background: transparent;
  color: #94a5b1;
  font-size: 14px;
  align-items: center;
  .van-cell__label {
    margin-top: 0;
    line-height: 20px;
    color: #6c7984;
    font-size: 12px;
  }
}

:deep(.van-cell::after) {
  border-bottom: 1px solid #6c7984;
}
:deep(.van-radio__icon .van-icon) {
  border: 0;
  background-color: transparent;
}
:deep(.van-radio__icon--checked .van-icon) {
  color: #12dedf;
  background-image: linear-gradient(to right, #12dedf, #07c79c);
  -webkit-background-clip: text;
  background-clip: text;
}
.bank-img-box {
  display: flex;
  align-items: center;
}
</style>
