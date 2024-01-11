<template>
  <div class="v-personal">
    <Header />
    <InformationHeader />
    <Currency />
    <Benefits />
    <Group />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from '../home/components/Header/index.vue'
import InformationHeader from '../home/components/Header/components/InformationHeader/index.vue'
import Currency from './components/Currency/index.vue'
import Group from './components/Group/index.vue'
import Benefits from './components/Benefits/index.vue'

export default defineComponent({
  name: 'Personal',
  components: {
    Header,
    InformationHeader,
    Currency,
    Group,
    Benefits
  },
  setup() {
    return {}
  }
})
</script>

<style lang="less" scoped>
@import '~@/styles/home/header/index.less';
.v-personal {
  height: 100%;
  width: calc(100% - 28px);
  padding: 0 14px;
  background-image: url('../../assets/personal/personal-bg-glass.webp'),
                    url('../../assets/personal/personal-bg.webp');
  background-repeat: no-repeat, no-repeat;
  background-position: 0 86px, 0 0;
  background-size: 100%;
}
</style>
