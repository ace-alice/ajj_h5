<template>
  <div class="v-choose-language">
    <PubHeader :right-icon="false" />
    <div class="v-choose-language-main">
      <van-radio-group v-model="languageChecked">
        <van-cell-group inset>
          <van-cell title="中文" clickable @click="changeLang('zh')">
            <template #right-icon>
              <van-radio name="1" />
            </template>
          </van-cell>
          <van-cell title="English" clickable @click="changeLang('en')">
            <template #right-icon>
              <van-radio name="2" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import PubHeader from '@/components/PubHeader/index.vue'
// import { i18n } from '@/lang/index.js'

export default defineComponent({
  components: {
    PubHeader
  },
  setup() {
    const languageChecked = ref('1')
    const changeLang = (row: string) => {
      // i18n.locale = row
    }
    return {
      languageChecked,
      changeLang
    }
  }
})
</script>

<style lang="less" scoped>
.v-choose-language {
  &-main {
    margin: 48px 15px 25px 15px;
    :deep(.van-cell-group) {
      background: transparent;
    }
    :deep(.van-cell-group--inset) {
      margin: 0;
      border-radius: 4px;
    }
    :deep(.van-cell) {
      height: 50px;
      align-items: center;
      border-radius: 4px;
      background-color: #2d363d;
      margin-bottom: 5px;
      color: #fff;
      font-size: 14px;
    }
    :deep(.van-cell::after) {
      border-bottom: 0;
    }
    :deep(.van-radio__icon .van-icon) {
      border: 0;
    }
    :deep(.van-radio__icon--checked .van-icon) {
      background-image: linear-gradient(to right, #12dedf, #07c79c);
      background-color: transparent;
      border-color: transparent;
    }
    :deep(.van-icon-success:before) {
      font-size: 14px;
    }
  }
}
</style>
