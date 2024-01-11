import { computed } from 'vue'
import { RouteLocationRaw, useRoute, useRouter } from 'vue-router'

export default function toPathHook() {
  const router = useRouter()
  const route = useRoute()
  function toPath(route: RouteLocationRaw) {
    router.push(route)
  }

  const query = computed(() => {
    return route.query
  })

  return { toPath, query }
}
