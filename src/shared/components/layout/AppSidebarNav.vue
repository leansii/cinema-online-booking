<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/entities/auth'
import AppButton from '@/shared/components/ui/AppButton.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = computed(() => {
  if (authStore.isAuthenticated) {
    return [
      { label: 'Фильмы', to: '/movies' },
      { label: 'Кинотеатры', to: '/cinemas' },
      { label: 'Мои билеты', to: '/tickets' },
      { label: 'Выход', to: '/logout', action: 'logout' as const },
    ]
  }

  return [
    { label: 'Фильмы', to: '/movies' },
    { label: 'Кинотеатры', to: '/cinemas' },
    { label: 'Мои билеты', to: '/auth/login?redirect=/tickets' },
    { label: 'Вход', to: '/auth/login' },
  ]
})

function isActive(to: string) {
  if (to === '/logout') {
    return false
  }
  return route.path.startsWith(to)
}

function handleNavigation(item: (typeof navItems)['value'][number]) {
  if (item.action === 'logout') {
    authStore.clearAuth()
    router.push('/movies')
    return
  }

  router.push(item.to)
}
</script>

<template>
  <aside class="sidebar">
    <h1 class="sidebar__title">Cinema</h1>
    <nav class="sidebar__nav">
      <AppButton
        v-for="item in navItems"
        :key="item.label"
        variant="nav"
        kind="a"
        :is-active="isActive(item.to)"
        @click="handleNavigation(item)"
      >
        {{ item.label }}
      </AppButton>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  border-right: 1px solid var(--color-border);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.sidebar__title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

</style>
