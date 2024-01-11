<template>
  <div class="v-agent-list">
    <div class="v-agent-list-header">
      <van-icon name="arrow-left" @click.stop="toPath({ name: 'Agent' })" />
      <div class="v-agent-list-header-title">会员列表</div>
      <div class="v-agent-list-header-right" @click="toFilter">筛选</div>
    </div>
    <div class="v-agent-list-input">
      <van-field
        v-model="formData.username"
        left-icon="search"
        placeholder="查询代理自己下级账号"
        @click-left-icon="onRefresh"
      />
    </div>
    <div class="v-agent-list-box">
      <van-pull-refresh v-model="loading.refresh" @refresh="onRefresh">
        <van-list
          v-model:loading="loading.onload"
          :finished="loading.finished"
          @load="onLoad"
        >
          <template #finished>
            <span v-if="memberList.length > 0" style="margin-bottom:20px">
              没有更多了~
            </span>
            <NoDataPage v-else />
          </template>
          <transition-group
            name="more"
            appear
            :css="false"
            @before-enter="beforeEnter"
            @enter="paragraphEnter"
          >
            <UserListItem
              v-for="(list, index) in memberList"
              :key="list.id"
              :item="list"
              :data-index="index + 1"
            />
          </transition-group>
        </van-list>
      </van-pull-refresh>
      <div class="empty" />
    </div>
    <van-popup
      v-model:show="filterShow"
      round
      position="top"
      @click-overlay="closeFilter"
    >
      <div class="v-agent-list-input">
        <van-field
          v-model="formData.username"
          left-icon="search"
          placeholder="查询代理自己+直属下级代理"
        />
      </div>
      <div class="v-filter-body">
        <div class="v-filter-body-title">用户层级</div>
        <div class="v-filter-body-sort">
          <div
            v-for="user in userLevel"
            :key="user.code"
            class="v-filter-body-sort-item v-filter-body-sort-item-4"
            :class="{ 'v-item-active': user.code == formData.level_type }"
            @click.stop="changeLevel(user.code)"
          >
            {{ user.label }}
          </div>
        </div>
        <div class="v-filter-body-title">排序</div>
        <div class="v-filter-body-sort">
          <div
            v-for="sort in sortList"
            :key="sort.code"
            class="v-filter-body-sort-item"
            :class="{ 'v-item-active': sort.code == formData.sort_type }"
            @click.stop="changeSort(sort.code)"
          >
            {{ sort.label }}
          </div>
        </div>
        <div class="v-filter-footer">
          <div @click.stop="reset">重置</div>
          <div @click.stop="doFilter">确定</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, Ref, ref } from 'vue'
import UserListItem from '@/components/UserListItem/index.vue'
import toPathHook from '@/hooks/toPath'
import { getAgentUserList } from '@/api/agent.js'
import listAnimateHook from '@/hooks/listAnimate'
import NoDataPage from '@/components/noData/index.vue'

export default defineComponent({
  name: 'AgentList',
  components: { UserListItem, NoDataPage },
  setup() {
    const { toPath } = toPathHook()

    const { beforeEnter, paragraphEnter } = listAnimateHook()

    const filterShow = ref(false)

    function toFilter() {
      Object.assign(lastForm, formData)
      filterShow.value = true
    }

    const sortList = ref([
      { label: '注册时间由近至远', code: 1 },
      { label: '登录时间由近至远', code: 2 },
      { label: '存款金额由高到底', code: 3 },
      { label: '取款金额由高到底', code: 4 }
    ])

    const userLevel = ref([
      { label: '全部会员', code: 2 },
      { label: '直属会员', code: 1 }
    ])

    function doFilter() {
      filterShow.value = false
      onRefresh()
    }

    const formData = reactive({
      sort_type: 1,
      username: '',
      level_type: 1,
      page: 0,
      limit: 10
    })

    const lastForm = reactive({
      sort_type: 1,
      username: '',
      level_type: 1,
      page: 0,
      limit: 10
    })

    function changeSort(code: number) {
      formData.sort_type = code
    }

    function changeLevel(code: number) {
      formData.level_type = code
    }

    function reset() {
      Object.assign(formData, lastForm)
    }

    function closeFilter() {
      Object.assign(formData, lastForm)
    }

    const memberList: Ref<any[]> = ref([])

    const loading = reactive({
      refresh: false,
      onload: false,
      finished: false
    })

    function toQuery() {
      formData.page++
      getAgentUserList(formData)
        .then((res: any) => {
          if (res.code == 1) {
            if (formData.page == 1) {
              memberList.value = res.data.data
            } else {
              memberList.value = [...memberList.value, ...res.data.data]
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
        })
    }

    function onRefresh() {
      formData.page = 0
      loading.onload = true
      loading.finished = false
      toQuery()
    }

    function onLoad() {
      toQuery()
    }

    return {
      toPath,
      toFilter,
      filterShow,
      doFilter,
      sortList,
      formData,
      changeSort,
      reset,
      closeFilter,
      userLevel,
      changeLevel,
      loading,
      toQuery,
      onRefresh,
      memberList,
      onLoad,
      beforeEnter,
      paragraphEnter
    }
  }
})
</script>

<style lang="less" scoped>
@import '~@/styles/agent/filter.less';
.v-agent-list-header {
  position: fixed;
  height: 40px;
  width: calc(100% - 30px);
  left: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  .v-agent-list-header-title {
    font-size: 14px;
    font-weight: bold;
    font-family: PingFang-SC;
  }
  :deep(.van-icon) {
    font-size: 20px;
  }
  .v-agent-list-header-right {
    background-image: linear-gradient(to right, #12dedf, #07c79c),
      linear-gradient(to bottom, #fff, #fff);
    font-family: PingFang-SC;
    font-size: 14px;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    cursor: pointer;
  }
}

.v-agent-list {
  display: flex;
  flex-direction: column;
  height: 100px;
  width: 100%;
  font-family: PingFang-SC;
  .v-agent-list-input {
    width: calc(100% - 30px);
    margin: 50px auto 10px;
    flex-shrink: 0;
    :deep(.van-cell) {
      border-radius: 8px;
      background-color: #2d363d;
      padding: 7px 15px;
      .van-field__control {
        color: #fff;
      }
      .van-field__left-icon {
        margin-right: 10px;
      }
      .van-icon {
        color: #fff;
        font-size: 20px;
      }
    }
  }
  .v-agent-list-box {
    width: calc(100% - 30px);
    min-height: calc(100% - 150px);
    margin: auto;
    flex-grow: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;

    div {
      flex-shrink: 0;
    }
    .v-agent-list-box-title {
      height: 36px;
      line-height: 36px;
      color: #fff;
      font-size: 14px;
    }
    .v-agent-list-box-btn {
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      border: solid 0.5px #0cd1ba;
      border-radius: 8px;
      margin: 10px 0;
      background-color: #2d363d;
    }
  }
}
</style>

<style>
body {
  --van-field-placeholder-text-color: #707d88 !important;
}
.empty {
  width: 100%;
  height: 10vh;
}
</style>
