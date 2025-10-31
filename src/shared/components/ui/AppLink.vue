<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to: string
    variant?: 'primary' | 'secondary'
  }>(),
  {
    variant: 'primary',
  }
)
</script>

<template>
  <RouterLink class="link" :class="`link--${variant}`" :to="props.to">
    <slot />
  </RouterLink>
</template>

<style scoped>
.link {
  color: var(--color-text-secondary);
  text-decoration: underline;
}

.link--primary {
  color: var(--color-accent);
}

.link--secondary {
  color: var(--color-text-secondary);
}
</style>
