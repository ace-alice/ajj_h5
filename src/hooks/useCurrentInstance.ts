import { getCurrentInstance } from 'vue'
export default function useCurrentInstance() {
  const { appContext }: any = getCurrentInstance()
  const proxy = appContext.config.globalProperties
  return {
    proxy
  }
}
