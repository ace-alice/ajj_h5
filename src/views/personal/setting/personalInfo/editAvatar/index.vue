<template>
  <div class="v-edit-avatar">
    <PubHeader />
    <div class="v-edit-avatar-main">
      <van-row gutter="10">
        <van-col
          v-for="(item, index) in imageList"
          :key="index"
          :span="8"
          @click="avatarChange(index)"
        >
          <van-image
            :class="imageActive === index ? 'active-image' : ''"
            :src="item.file_url"
          />
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import PubHeader from '@/components/PubHeader/index.vue'
import { avatarList, setAvatar, getPersonalInfo } from '@/api/user.js'
import store from '@/store/index.js'
import { Toast } from 'vant'
import useCurrentInstance from '@/hooks/useCurrentInstance'
import toPathHook from '@/hooks/toPath'

export default defineComponent({
  components: {
    PubHeader
  },
  setup() {
    const { toPath } = toPathHook()
    /**
     * 获取挂载在全局的属性和获取上下文
     */
    const { proxy } = useCurrentInstance()
    /**
     * 个人信息
     */
    const userInfo = computed(() => store.getters.getUserInfo)
    /**
     * 头像默认选中
     */
    const imageActive = ref(0)
    /**
     * 头像列表
     */
    const imageList = ref([])
    /**
     * 头像改变
     * @param index
     */
    const avatarChange = (index: number) => {
      imageActive.value = index
    }
    /**
     * 获取头像列表
     */
    const getAvatarList = async() => {
      const params = {
        page: 1,
        limit: 99
      }
      const data = await avatarList(params)
      if (Number(data.code) === 1) {
        imageList.value = data.data.data
        for (const i in imageList.value) {
          const imageArr: any = imageList.value[i]
          if (imageArr.file_id === userInfo.value.avatar_id) {
            imageActive.value = Number(i)
          }
        }
      }
    }
    /**
     * 修改头像
     */
    const updateAvatar = async() => {
      const filedId: any = imageList.value[imageActive.value]
      const params = {
        avatar_id: filedId.file_id
      }
      const data = await setAvatar(params)
      if (Number(data.code) === 1) {
        const userInfoData = await getPersonalInfo()
        if (userInfoData.data) {
          store.commit('user/SET_USER_INFO', JSON.stringify(userInfoData.data))
          Toast.success({
            message: '头像修改成功',
            duration: 1500
          })
          toPath({ name: 'PersonalInfo' })
        }
      }
    }
    onMounted(() => {
      getAvatarList()
      /**
       * 接收编辑头像
       */
      proxy.mittBus.on('updateAvatar-bus', (val: any) => {
        if (val.value === 'EditAvatar') {
          updateAvatar()
        }
      })
    })
    onUnmounted(() => {
      proxy.mittBus.off('updateAvatar-bus')
    })
    return {
      imageActive,
      avatarChange,
      getAvatarList,
      imageList,
      updateAvatar,
      userInfo,
      toPath
    }
  }
})
</script>

<style lang="less" scoped>
.v-edit-avatar {
  &-main {
    height: calc(100% - 63px);
    margin: 48px 15px 0px 15px;
    overflow: auto;
    padding-bottom: 25px;
    :deep(.van-image) {
      width: 106px;
      height: 106px;
      border-radius: 106px;
      border: 1px solid transparent;
      margin-bottom: 3px;
      overflow: hidden;
    }
    .active-image {
      border: 1px solid #0cd2bd;
    }
  }
}
</style>
