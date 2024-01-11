<template>
  <div class="v-promotions">
    <div class="v-promotions-tabs">
      <span class="left-icon">
        <svg-icon
          class="home-customer-service"
          icon-class="home-customer-service"
          @click="toPath('OnlineService')"
        />
      </span>
      <van-tabs
        v-model:active="activityId"
        shrink
        color="#07c79c"
        :style="{ '--display': tabShow ? 1 : 0 }"
        ref="promotionRef"
      >
        <van-tab
          v-for="item in tabsArr"
          :key="item.id"
          :title="item.tab"
          :name="item.id"
        >
          <div class="v-promotions-tabs-main">
            <van-pull-refresh v-model="loading.refresh" @refresh="onRefresh" class="promotionRef">
              <van-list
                v-model:loading="loading.onload"
                :finished="loading.finished"
                @load="onLoad"
              >
                <template #finished>
                  <span
                    v-if="currentTabList.length > 0"
                    style="margin-bottom:20px"
                  >
                    没有更多了~
                  </span>
                  <NoDataPage v-else-if="tabsArr.length > 1" />
                  <NotActivityPage v-else />
                </template>
                <transition-group
                  name="more"
                  appear
                  :css="false"
                  @before-enter="beforeEnter"
                  @enter="paragraphEnter"
                >
                  <PromotionInfo
                    v-for="(subItem, subIndex) in currentTabList"
                    :key="subItem.id"
                    :data-index="subIndex + 1"
                    :sub-item="subItem"
                  />
                </transition-group>
              </van-list>
            </van-pull-refresh>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance, nextTick,
  onMounted,
  reactive,
  Ref,
  ref,
  watch
} from 'vue';
import { tabList, promotionList } from '@/api/promotions.js'
import listAnimateHook from '@/hooks/listAnimate'
import PromotionInfo from './components/PromotionInfo.vue'
import NotActivityPage from './components/NotActivityPage.vue'
import NoDataPage from '@/components/noData/index.vue'
import toPathHook from '@/hooks/toPath'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Promotions',
  components: { PromotionInfo, NotActivityPage, NoDataPage },
  setup() {
    const { proxy } = getCurrentInstance() as any

    const { toPath } = toPathHook()

    const tabsArr = ref([{ id: 0, remark: '全部', sort: 1, tab: '全部' }])

    const tabShow = ref(true)

    const activityList: Ref<any[]> = ref([])

    const activityId = ref(0)

    const router = useRouter()

    const scrollH = ref(0)

    const formData = reactive({
      page: 0,
      limit: 10
    })

    const currentTabList = computed(() => {
      return activityList.value.filter((item: any) => {
        // eslint-disable-next-line eqeqeq
        return item.bid == activityId.value || !activityId.value
      })
    })

    /**
     * tabs数据
     */
    const getTabList = () => {
      tabList()
        .then((res: any) => {
          // eslint-disable-next-line eqeqeq
          if (res.code == 1) {
            tabsArr.value = [
              { id: 0, remark: '全部', sort: 1, tab: '全部' },
              ...res.data
            ]
          }
        })
        .finally(() => {
          setTimeout(() => {
            if (tabsArr.value.length > 1) {
              tabShow.value = true
            } else {
              tabShow.value = false
            }
          }, 10)
        })
    }

    const loading = reactive({
      refresh: false,
      onload: false,
      finished: false
    })

    function onRefresh() {
      formData.page = 0
      loading.onload = true
      loading.finished = false
      toQuery(formData)
    }

    function onLoad() {
      toQuery(formData)
    }

    function toQuery(form: any) {
      formData.page++
      loading.refresh = true
      promotionList(form)
        .then((res: any) => {
          // eslint-disable-next-line eqeqeq
          if (res.code == 1) {
            // eslint-disable-next-line eqeqeq
            if (formData.page == 1) {
              activityList.value = res.data.data
            } else {
              activityList.value = [...activityList.value, ...res.data.data]
            }

            if (res.data.data.length < formData.limit) {
              loading.finished = true
            } else {
              loading.finished = false
            }
          } else {
            loading.finished = true
          }
        })
        .catch(() => {
          loading.finished = true
        })
        .finally(() => {
          loading.onload = false
          loading.refresh = false
          setTimeout(() => {
            if (activityList.value.length > 0) {
              tabShow.value = true
            } else {
              tabShow.value = false
            }
          }, 10)
        })
    }

    watch(
      () => tabShow.value,
      () => {
        getTabList()
      }
    )

    // watch(() => router.currentRoute.value.name, (newVal, oldVal) => {
    //   if (newVal && oldVal) {
    //     if (newVal === 'VipClub' && oldVal === 'Promotions') {
    //
    //       // console.log('滚动条高度', proxy.$refs['promotionRef'].scrollTop)
    //     } else {
    //       nextTick(() => {
    //         console.log('==============',proxy.$refs['promotionRef'].offsetHeight)
    //         proxy.$refs['promotionRef'].offsetHeight = '300px'
    //         console.log('==============',proxy.$refs['promotionRef'].offsetHeight)
    //       })
    //     }
    //     // console.log('-----------', newVal, oldVal)
    //   }
    // }, { immediate: true })

    const { beforeEnter, paragraphEnter } = listAnimateHook()

    // const scrollTop = () => {
    //   const page = document.getElementsByClassName('promotionRef')[0]
    //   if (page) {
    //     const scrollT = page.getBoundingClientRect().top * -1
    //     scrollH.value = scrollT
    //     console.log('===========', scrollT)
    //     // console.log('==========', proxy.$refs)
    //   }
    // }

    onMounted(() => {
      getTabList()
      // window.addEventListener('scroll', scrollTop, true)
    })
    return {
      tabsArr,
      activityList,
      getTabList,
      beforeEnter,
      paragraphEnter,
      loading,
      currentTabList,
      onRefresh,
      onLoad,
      formData,
      activityId,
      tabShow,
      toPath,
      scrollH
    }
  }
})
</script>

<style lang="less" scoped>
.v-promotions {
  height: 100%;
  width: calc(100% - 30px);
  margin: 0 auto;
  &-tabs {
    height: calc(100% + 40px);
    :deep(.van-tabs) {
      height: 100%;
    }

    :deep(.van-tabs__nav) {
      opacity: var(--display);
      background: transparent;
    }
    :deep(.van-tab__text) {
      font-size: 14px;
      color: #94a5b1;
    }
    :deep(.van-tab--active) {
      font-size: 14px;
      color: #fff;
    }
    :deep(.van-tabs__content) {
      height: calc(100% - 94px);
      margin-top: 15px;
      overflow: auto;
    }
  }
}
.left-icon {
  position: fixed;
  right: 19px;
  top: 15px;
  z-index: 5;
  cursor: pointer;
  .home-customer-service {
    height: 17px;
    width: 20px;
  }
}
</style>
