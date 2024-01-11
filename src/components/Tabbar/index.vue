<template>
  <div class="v-footer">
    <van-tabbar
      v-model="active"
      fixed
      :placeholder="true"
      :route="true"
    >
      <van-tabbar-item
        v-for="(item, index) in tabbarData"
        :key="index"
        :to="item.to"
      >
        <span>{{ item.title }}</span>
        <template #icon="props">
          <svg-icon
            :icon-class="props.active ? item.active : item.icon"
            :class-name="item.class"
          />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import SvgIcon from '@/components/SvgIcon';

export default {
  name: 'Tabbar',
  components: { SvgIcon },
  setup(props) {
    const active = ref(0)
    const tabbarData = reactive([
      {
        icon: 'tabbar-home',
        active: 'tabbar-home-active',
        title: '首页',
        class: 'tabbar-svg-icon1',
        to: {
          name: 'Home'
        }
      },
      {
        icon: 'tabbar-promotions',
        active: 'tabbar-promotions-active',
        title: '优惠',
        class: 'tabbar-svg-icon2',
        to: {
          name: 'Promotions'
        }
      },
      {
        icon: 'tabbar-wallet',
        active: 'tabbar-wallet-active',
        title: '钱包',
        class: 'tabbar-svg-icon2',
        to: {
          name: 'Wallet'
        }
      },
      {
        icon: 'tabbar-personal',
        active: 'tabbar-personal-active',
        title: '我的',
        class: 'tabbar-svg-icon1',
        to: {
          name: 'Personal'
        }
      }
    ])
    return {
      active,
      tabbarData
    }
  }
}
</script>

<style lang="less" scoped>
.v-footer {
  :deep(.van-tabbar) {
    background-color: #2d363d;
  }
  :deep(.van-icon) {
    color: #748d9e;
  }
  :deep(.van-tabbar-item__text) {
    font-size: 12px;
    color: #748d9e;
  }
  :deep(.van-tabbar-item--active) {
    background-color: #2d363d;
    .van-tabbar-item__text, .van-icon {
      color: #fff;
    }
  }
  :deep(.van-hairline--top-bottom::after) {
    border-width: 0;
  }
  .tabbar-svg-icon1 {
    width: 14px;
    height: 16px;
  }
  .tabbar-svg-icon2 {
    width: 16px;
    height: 16px;
  }
}
</style>
