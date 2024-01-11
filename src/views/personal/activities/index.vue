<template>
  <div class="v-activities">
    <ActivitiesHeader />
    <div class="v-activities-main">
      <!--      <div class="v-activities-main-tabs">-->
      <!--        <div-->
      <!--          v-for="item in bulletinTabsList"-->
      <!--          :key="item.code"-->
      <!--          :class="{ 'activities-active': bulletinTabsActive == item.code }"-->
      <!--          @click="bulletinChange(item)"-->
      <!--        >-->
      <!--          {{ item.title }}-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <ActivitiesList v-if="bulletinTabsActive === 'bulletin-list'" />-->
      <VipActivityList v-if="bulletinTabsActive === 'letter-list'" />
    <!--      <component :is="bulletinTabsActive" :key="bulletinTabsActive" />-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import ActivitiesHeader from './components/ActivitiesHeader/index.vue'
// import ActivitiesList from './components/ActivitiesList/index.vue'
import VipActivityList from './components/VipActivityList/index.vue'
import { getToken } from '@/utils/index.js'
import { Toast } from 'vant'

export default defineComponent({
  name: 'Bulletin',
  components: {
    ActivitiesHeader,
    // ActivitiesList,
    VipActivityList
  },
  setup() {
    const route = useRoute()

    /**
     * 公告、站内信默认选中
     */
    const bulletinTabsActive = ref(route.query.name || 'letter-list')

    const state = reactive({
      /**
       * tab列表
       */
      bulletinTabsList: [
        {
          code: 'bulletin-list',
          title: '优惠活动'
        },
        {
          code: 'letter-list',
          title: 'VIP活动'
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
.v-activities {
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
        border-radius: 14px;
        height: 27px;
        font-size: 12px;
        color: #b6c1cb;
        font-weight: bold;
      }
      .activities-active {
        background-image: linear-gradient(to right, #12dedf, #07c79c);
        color: #fff;
      }
    }
  }
}
</style>
