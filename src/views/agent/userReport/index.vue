<template>
  <div class="v-agent-list">
    <div class="v-agent-list-header">
      <van-icon name="arrow-left" @click.stop="toPath({ name: 'Agent' })" />
      <div class="v-agent-list-header-title">会员盈亏</div>
      <div class="v-agent-list-header-right" @click="toFilter">筛选</div>
    </div>
    <div class="v-agent-list-input">
      <van-field
        v-model="formData.username"
        left-icon="search"
        placeholder="查询代理自身或代理的下级账号"
        @click-left-icon="onRefresh"
      />
    </div>
    <div class="v-agent-list-box">
      <van-pull-refresh v-model="loading.refresh" @refresh="onRefresh">
        <van-list v-model:loading="loading.onload" :finished="loading.finished" @load="onLoad">
          <template #finished>
            <span v-if="memberList.length > 0" style="margin-bottom:20px">
              没有更多了~
            </span>
            <NoDataPage v-else />
          </template>
          <div class="v-agent-list-box-title">当前层级: {{ currentLevel }}</div>
          <UserReportItem :item="currentInfo" :is-current="true" @toDetail="toDetail(currentInfo)" />
          <van-divider :style="{ color: '#3e4a53', borderColor: '#3e4a53' }" />
          <transition-group name="more" appear :css="false" @before-enter="beforeEnter" @enter="paragraphEnter">
            <UserReportItem
              v-for="(list, index) in memberList"
              :key="list.username"
              :item="list"
              :data-index="index + 1"
              @toChangeUser="toChangeUser"
              @toDetail="toDetail(list)"
            />
          </transition-group>
        </van-list>
      </van-pull-refresh>
    </div>
    <van-popup v-model:show="filterShow" round position="top" @click-overlay="closeFilter">
      <div class="v-agent-list-input">
        <van-field v-model="formData.username" left-icon="search" placeholder="查询代理自己+直属下级代理" />
      </div>
      <div class="v-filter-body">
        <div class="v-filter-body-title">统计时间</div>
        <div class="v-filter-body-sort">
          <div
            v-for="sort in dateTypeList"
            :key="sort.code"
            class="v-filter-body-sort-item v-filter-body-sort-item-4"
            :class="{ 'v-item-active': sort.code == formData.date_type }"
            @click.stop="changeSort('date_type', sort.code)"
          >
            {{ sort.label }}
          </div>
        </div>
        <div class="v-filter-body-title">用户层级</div>
        <div class="v-filter-body-sort">
          <div
            v-for="sort in levelTypeList"
            :key="sort.code"
            class="v-filter-body-sort-item v-filter-body-sort-item-4"
            :class="{ 'v-item-active': sort.code == formData.level_type }"
            @click.stop="changeSort('level_type', sort.code)"
          >
            {{ sort.label }}
          </div>
        </div>
        <div class="v-filter-body-title">排序</div>
        <div class="v-filter-body-sort">
          <div
            v-for="sort in sortList"
            :key="sort.code"
            class="v-filter-body-sort-item"
            :class="{ 'v-item-active': sort.code == formData.sort_type }"
            @click.stop="changeSort('sort_type', sort.code)"
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
import { defineComponent, reactive, Ref, ref } from 'vue';
import UserReportItem from '@/components/UserReportItem/index.vue';
import toPathHook from '@/hooks/toPath';
import { getUserReportList } from '@/api/agent.js';
import listAnimateHook from '@/hooks/listAnimate';
import NoDataPage from '@/components/noData/index.vue';

const defaultForm = {
  sort_type: 1,
  username: '',
  level_type: 1,
  date_type: 1,
  page: 0,
  limit: 10
};

export default defineComponent({
  name: 'UserReport',
  components: { UserReportItem, NoDataPage },
  setup() {
    const { toPath } = toPathHook();

    const filterShow = ref(false);

    function toFilter() {
      Object.assign(lastForm, formData);
      filterShow.value = true;
    }

    const sortList = ref([
      { label: '总盈亏由高到底', code: 1 },
      { label: '总盈亏由低到高', code: 2 },
      { label: '总投注高到低', code: 3 },
      { label: '总投注低到高', code: 4 },
      { label: '游戏盈亏高到低', code: 5 },
      { label: '游戏盈亏低 到高', code: 6 }
    ]);

    const levelTypeList = [
      { label: '直属会员', code: 1 },
      { label: '全部会员', code: 2 }
    ];

    const dateTypeList = [
      { label: '昨天', code: 1 },
      { label: '前天', code: 2 },
      { label: getMountNumber(), code: 3 },
      { label: getMountNumber(1), code: 4 },
      { label: getMountNumber(2), code: 5 }
    ];

    function getMountNumber(offset: number = 0) {
      const now = new Date();
      const CM = now.getMonth();
      const rm = CM - offset + 1;
      if (rm < 1) {
        return rm + 12 + '月';
      } else {
        return rm + '月';
      }
    }

    const loading = reactive({
      refresh: false,
      onload: false,
      finished: false
    });

    function doFilter() {
      onRefresh();
      filterShow.value = false;
    }

    const formData = reactive(Object.assign({}, defaultForm));

    const lastForm = reactive(Object.assign({}, defaultForm));

    const currentLevel = ref('我');

    const currentInfo = ref({});

    function changeSort(keyL: string, code: number) {
      formData[keyL] = code;
    }

    function reset() {
      Object.assign(formData, lastForm);
    }

    function closeFilter() {
      Object.assign(formData, lastForm);
    }

    const memberList: Ref<any[]> = ref([]);

    function toQuery() {
      formData.page++;
      loading.refresh = true;
      getUserReportList(formData)
        .then((res: any) => {
          // eslint-disable-next-line eqeqeq
          if (res.code == 1) {
            // eslint-disable-next-line eqeqeq
            if (formData.page == 1) {
              memberList.value = res.data.data;
            } else {
              memberList.value = [...memberList.value, ...res.data.data];
            }

            Object.assign(currentInfo.value, res.data.agent, {
              username: '所有人统计'
            });
            if (res.data.data.length < formData.limit) {
              loading.finished = true;
            } else {
              loading.finished = false;
            }
          } else {
            loading.finished = true;
          }
        })
        .catch(() => {
          loading.finished = true;
        })
        .finally(() => {
          loading.onload = false;
          loading.refresh = false;
        });
    }

    function onRefresh() {
      formData.page = 0;
      loading.onload = true;
      loading.finished = false;
      toQuery();
    }

    function onLoad() {
      toQuery();
    }

    function toChangeUser(username: string) {
      formData.username = username;
      onRefresh();
    }

    function toDetail(item: any) {
      toPath({
        name: 'UserReportDetail',
        query: { date_type: formData.date_type, username: item.username }
      });
    }

    const { beforeEnter, paragraphEnter } = listAnimateHook();
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
      loading,
      memberList,
      onRefresh,
      onLoad,
      beforeEnter,
      paragraphEnter,
      currentLevel,
      currentInfo,
      levelTypeList,
      dateTypeList,
      toChangeUser,
      toDetail
    };
  }
});
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
    background-image: linear-gradient(to right, #12dedf, #07c79c), linear-gradient(to bottom, #fff, #fff);
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
