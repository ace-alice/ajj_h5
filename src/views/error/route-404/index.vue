<template>
  <div class="route-err-main">
    <div class="route-err-main-title">页面出错</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: '',
  setup() {
    return {
    }
  }
})
</script>

<style lang="less" scoped>
.route-err-main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-image: url('../../../assets/err/route-error.webp');
  background-size: 187px 150px;
  background-repeat: no-repeat;
  background-position: center;
  font-family: PingFang-SC;
  &-title {
    display: flex;
    margin-top: 150px;
    font-size: 16px;
    font-weight: 500;
    color: #3e4a53;
  }
}
</style>
