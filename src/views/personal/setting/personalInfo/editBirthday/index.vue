<template>
  <div class="v-edit-birthday">
    <PubHeader :right-icon="false" />
    <div class="v-edit-birthday-main">
      <van-cell-group inset>
        <van-cell is-link @click="birthdayShowPicker = true">
          <template #title>
            <span>生日</span>
          </template>
          <template #value>
            <span>{{ birthday }}</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <van-popup v-model:show="birthdayShowPicker" position="bottom">
      <van-date-picker
        v-model="birthdayDate"
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="birthdayOnConfirm"
        @cancel="birthdayShowPicker = false"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import PubHeader from '@/components/PubHeader/index.vue'
import { getPersonalInfo, setAvatar } from '@/api/user.js'
import store from '@/store/index.js'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import toPathHook from '@/hooks/toPath'

export default defineComponent({
  components: {
    PubHeader
  },
  setup() {
    const { toPath } = toPathHook()
    const router = useRouter()
    const userInfo = computed(() => store.getters.getUserInfo)
    /**
     * 生日
     */
    const birthday = ref('')
    /**
     * 生日弹窗
     */
    const birthdayShowPicker = ref(false)
    /**
     * 获取当前年月日
     * @param value（1:年,2:月,3:日）
     */
    const dealWithDate = (value: number) => {
      const date = new Date()
      const y = date.getFullYear()
      const m = date.getMonth()
      const d = date.getDate()
      if (value === 1) {
        return String(y)
      } else if (value === 2) {
        if (m < 10) {
          return String('0' + String(m + 1))
        } else {
          return String(m + 1)
        }
      } else {
        if (d < 10) {
          return String('0' + String(d))
        } else {
          return String(d)
        }
      }
    }
    /**
     * 日期
     */
    const birthdayDate = ref([
      dealWithDate(1),
      dealWithDate(2),
      dealWithDate(3)
    ])
    /**
     * 修改生日确定事件
     */
    const birthdayOnConfirm = async(val: any) => {
      birthday.value = val.selectedValues.join('-')
      const params = {
        birthday: new Date(birthday.value).getTime() / 1000
      }
      const data = await setAvatar(params)
      if (Number(data.code) === 1) {
        const userInfoData = await getPersonalInfo()
        if (userInfoData.data) {
          store.commit('user/SET_USER_INFO', JSON.stringify(userInfoData.data))
          Toast.success({
            message: '生日修改成功',
            duration: 1500
          })
          toPath({ name: 'PersonalInfo' })
        }
      }
      birthdayShowPicker.value = false
      // console.log(birthday.value)
    }
    onMounted(() => {
      if (userInfo.value.birthday) {
        router.push({ name: 'PersonalInfo' })
      }
    })
    return {
      birthday,
      birthdayShowPicker,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      birthdayOnConfirm,
      birthdayDate,
      dealWithDate,
      userInfo
    }
  }
})
</script>

<style lang="less" scoped>
.v-edit-birthday {
  :deep(.van-picker__toolbar) {
    background-color: #3e4a53;
  }
  :deep(.van-picker__cancel) {
    font-size: 14px;
    color: #b6c1cb;
  }
  :deep(.van-picker__title) {
    font-size: 15px;
    color: #fff;
  }
  :deep(.van-picker__confirm) {
    background-image: linear-gradient(to right, #12dedf, #07c79c),
      linear-gradient(to bottom, #b6c1cb, #b6c1cb);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }
  :deep(.van-picker__columns) {
    background-color: #2d363d;
  }
  :deep(.van-picker__mask) {
    background-image: linear-gradient(
        180deg,
        rgba(45, 54, 61, 0.9),
        rgba(45, 54, 61, 0.4)
      ),
      linear-gradient(0deg, rgba(45, 54, 61, 0.9), rgba(45, 54, 61, 0.4));
  }
  :deep(.van-picker-column__item) {
    color: #94a5b1;
    font-size: 12px;
  }
  :deep(.van-picker-column__item--selected) {
    font-size: 12px;
    color: #fefefe;
  }
  :deep(.van-picker__frame) {
    left: 0;
    right: 0;
  }
  :deep(.van-hairline-unset--top-bottom::after) {
    border-color: #54636f;
  }
  &-main {
    margin: 48px 15px 25px 15px;
    :deep(.van-cell-group) {
      background-color: #2d363d;
    }
    :deep(.van-cell-group--inset) {
      margin: 0;
      border-radius: 4px;
    }
    :deep(.van-cell) {
      height: 50px;
      border-radius: 4px;
      background-color: #2d363d;
      align-items: center;
      .van-cell__title {
        font-size: 14px;
        color: #fff;
      }
      .van-cell__right-icon {
        font-size: 12px;
      }
    }
  }
}
</style>
