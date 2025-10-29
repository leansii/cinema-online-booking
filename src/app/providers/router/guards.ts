import type { Router } from 'vue-router'

export function registerRouterGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    // Placeholder for future auth/navigation guards.
    next()
  })
}
