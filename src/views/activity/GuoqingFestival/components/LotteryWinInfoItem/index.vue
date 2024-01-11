<template>
  <div :class="{ LotteryWinInfoItem: true }">
    <div class="box-1 range" :class="`range-${index}`">{{ index + 1 }}</div>
    <div class="box-2">
      恭喜<span>{{ price.member_name }}</span>
    </div>
    <div class="box-3">抽中</div>
    <div class="box-4">{{ price['prize_name'] }}</div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LotteryWinInfoItem',
  props: {
    price: {
      type: Object,
      default: () => {
        return {};
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  setup(props: any) {
    function getRanking() {
      // if (props.index < 3) {
      // return require(`@/assets/activity/no${props.index + 1}.png`)
      // } else {
      return props.index + 1;
      // }
    }
    return { getRanking };
  }
};
</script>

<style lang="less" scoped>
.LotteryWinInfoItem {
  // width: calc(100% - 30px);
  margin: 0 auto;
  height: 40px;
  border-radius: 8px;
  display: flex;
  flex-wrap: nowrap;
  font-size: 12px;
  // justify-content: space-evenly;
  align-items: center;
  color: #433403;

  > div {
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .box-1 {
    width: 30px;
    text-align: center;
    color: #433403;
    font-weight: bold;
  }

  .box-2 {
    width: 110px;

    span {
      color: #433403;
      font-weight: 600;
    }
  }

  .box-3 {
    width: 35px;
    text-align: center;
  }

  .box-4 {
    width: 130px;
    margin-left: 30px;
    color: #433403;
  }
  .range {
    border-radius: 2px;
    width: 21px;
    height: 21px;
    line-height: 21px;
    color: #fff;
    background: #cfcfcf;
    margin-right: 3px;
  }
  .range-0 {
    background: #ed3f69;
  }
  .range-1 {
    background: #edc43f;
  }
  .range-2 {
    background: #3fc6ed;
  }
}
</style>
