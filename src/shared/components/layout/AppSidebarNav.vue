<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/entities/auth'

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
      <button
        class="sidebar__link"
        :class="{ 'sidebar__link--active': isActive(item.to) }"
        v-for="item in navItems"
        :key="item.label"
        type="button"
        @click="handleNavigation(item)"
      >
        {{ item.label }}
      </button>
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

.sidebar__link {
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.sidebar__link--active,
.sidebar__link:hover {
  border-color: var(--color-border);
  color: var(--color-text-primary);
}
</style>
