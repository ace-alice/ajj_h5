<template>
  <div class="MyPriceListItem">
    <div class="box">
      <div class="box-left">
        <div>{{ price?.prize_name }}</div>
        <div>中奖时间：{{ price?.create_time }}</div>
      </div>
      <div class="box-right" :class="{ 'is-send': +price.receive_status === 0 }">
        {{ +price.receive_status === 0 ? '未' : '已' }}派发
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MyPriceListItem',
  props: {
    price: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  setup() {}
};
</script>

<style lang="less" scoped>
.MyPriceListItem {
  width: calc(100% - 30px);
  margin: 0 auto;
  padding: 20px 0;
  background-color: #2d363d;
  border-radius: 8px;

  &+.MyPriceListItem{
    margin: 10px auto 0;
  }

  .box {
    width: calc(100% - 40px);
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      flex-shrink: 0;
    }
    .box-left {
      flex-grow: 1;
      div {
        &:nth-child(1) {
          font-size: 14px;
          font-weight: bold;
          color: #fff;
          margin-bottom: 15px;
        }
        &:nth-child(2) {
          font-size: 12px;
          color: #adbfcf;
        }
      }
    }
    .box-right {
      font-size: 13px;
      color: #fff;
    }
    .is-send {
      background-image: linear-gradient(to left, #12dedf, #07c79c), linear-gradient(to right, #fff, #fff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>
