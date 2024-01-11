<template>
  <div class="image-load-box">
    <div class="g-container">
      <div class="g-first" />
      <div class="g-ball" />
      <div class="g-ball" />
      <div class="g-ball" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ImageLoadBox',
  components: {},
  setup() {
    return {};
  }
});
</script>

<style lang="less" scoped>
.image-load-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .g-container {
    margin: auto;
    position: relative;
    width: 10px;
    height: 10px;
  }

  .g-ball,
  .g-first {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgb(175, 178, 178);
    border-radius: 50%;
    transform: translate(-400%, 0);
    opacity: 0;
  }

  .loop(@i) when (@i < 4) {
    .loop((@i + 1));
    .g-ball:nth-child(@{i}) {
      @ss: @i * 0.2+ 0.1;
      animation: move 2.7s infinite @ss*1s linear;
    }
  }
  .loop(1);

  .g-first {
    animation: scaleMove 2.7s infinite linear;
  }

  @keyframes move {
    25% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    50% {
      opacity: 1;
      transform: translate(130%, 0);
    }
    75%,
    100% {
      opacity: 0;
      transform: translate(400%, 0);
    }
  }

  @keyframes scaleMove {
    25% {
      opacity: 1;
      transform: translate(-100%, 0);
    }
    35% {
      opacity: 1;
      transform: scale(1);
    }
    70% {
      opacity: 1;
      transform: translate(100%, 0) scale(1.7);
    }
    85% {
      opacity: 1;
      transform: translate(100%, 0) scale(1.7);
    }
    100% {
      opacity: 0;
      transform: translate(250%, 0) scale(1);
    }
  }
}
</style>
