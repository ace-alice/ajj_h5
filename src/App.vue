<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
export default defineComponent({
  name: 'App',
  setup() {
    window.onresize = () => {
      return (() => {
        toJump();
      })();
    };
    const toJump = () => {
      const width = document.body.clientWidth;
      const origin = window.location.origin;
      if (+width > 1199 && origin.indexOf('pc.') === -1) {
        const originArr = origin.split('//');
        document.location.href = originArr[0] + '//pc.' + originArr[1];
      }
    };
    onMounted(() => {
      toJump();
    });
  }
});
</script>

<style></style>
