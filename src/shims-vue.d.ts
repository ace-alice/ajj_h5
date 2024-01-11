/* eslint-disable */
declare module '*.vue' {
    import type { DefineComponent, getCurrentInstance } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
declare module '*.js'
declare module '@/hooks/useCurrentInstance'
declare module '@vant/area-data'
