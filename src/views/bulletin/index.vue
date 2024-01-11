<template>
  <div class="v-bulletin">
    <BulletinHeader :bulletin-status="bulletinTabsActive" />
    <div class="v-bulletin-main">
      <div class="v-bulletin-main-tabs">
        <div
          v-for="item in bulletinTabsList"
          :key="item.code"
          :class="{ 'bulletin-active': bulletinTabsActive == item.code }"
          @click="bulletinChange(item)"
        >
          {{ item.title }}
        </div>
      </div>
      <component :is="bulletinTabsActive" :key="bulletinTabsActive" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import BulletinHeader from './components/BulletinHeader/index.vue'
import BulletinList from './components/BulletinList/index.vue'
import LetterList from './components/LetterList/index.vue'
import { getToken } from '@/utils/index.js'
import { Toast } from 'vant'

export default defineComponent({
  name: 'Bulletin',
  components: {
    BulletinHeader,
    BulletinList,
    LetterList
  },
  setup() {
    const route = useRoute()

    /**
     * 公告、站内信默认选中
     */
    const bulletinTabsActive = ref(route.query.name || 'bulletin-list')

    const state = reactive({
      /**
       * tab列表
       */
      bulletinTabsList: [
        {
          code: 'bulletin-list',
          title: '公告'
        },
        {
          code: 'letter-list',
          title: '站内信'
        }
      ]
    })

    /**
     * 公告、站内信切换事件
     * @param row
     */
    const bulletinChange = (row: any) => {
      const token = getToken()
      if (row.code === 'letter-list' && !token) {
        return Toast('请登录后查看站内信')
      }
      bulletinTabsActive.value = row.code
    }

    return {
      ...toRefs(state),
      bulletinTabsActive,
      bulletinChange
    }
  }
})
</script>

<style lang="less" scoped>
.v-bulletin {
  &-main {
    height: 100%;
    margin: 48px 15px 15px 15px;
    &-tabs {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(50% - 5px);
        background-color: #3e4a53;
        border-radius: 18px;
        height: 36px;
        font-size: 14px;
        color: #b6c1cb;
        font-weight: bold;
      }
      .bulletin-active {
        background-image: linear-gradient(to right, #12dedf, #07c79c);
        color: #1a242c;
      }
    }
  }
}
</style>
