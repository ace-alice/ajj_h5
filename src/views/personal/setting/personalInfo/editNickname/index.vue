<template>
  <div class="v-edit-nickname">
    <PubHeader />
    <div class="v-edit-nickname-main">
      <van-cell-group inset>
        <van-field v-model="nickName" placeholder="请输入用户名" />
      </van-cell-group>
      <span class="v-edit-nickname-main-tip">用户名在首次进入游戏前仅限更改一次</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import PubHeader from '@/components/PubHeader/index.vue'

export default defineComponent({
  components: {
    PubHeader
  },
  setup() {
    const nickName = ref('')
    return {
      nickName
    }
  }
})
</script>

<style lang="less" scoped>
.v-edit-nickname {
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
      .van-field__control {
        font-size: 14px;
        color: #fff;
      }
      .van-cell__right-icon {
        font-size: 12px;
      }
    }
    &-tip {
      display: flex;
      font-size: 12px;
      color: #707d88;
      line-height: 40px;
      margin-left: 15px;
    }
  }
}
</style>
