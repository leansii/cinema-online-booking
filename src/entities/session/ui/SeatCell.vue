<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    status: 'available' | 'selected' | 'booked'
    label: string
  }>(),
  {
    status: 'available',
  }
)

const emit = defineEmits<{
  (event: 'select'): void
}>()
</script>

<template>
  <button
    type="button"
    class="seat"
    :class="`seat--${props.status}`"
    :disabled="props.status === 'booked'"
    @click="emit('select')"
  >
    <span class="visually-hidden">{{ label }}</span>
  </button>
</template>

<style scoped>
.seat {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.seat--available:hover {
  border-color: rgba(255, 255, 255, 0.6);
}

.seat--selected {
  background-color: rgba(255, 255, 255, 0.75);
  border-color: rgba(255, 255, 255, 0.9);
}

.seat--booked {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
  cursor: not-allowed;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
