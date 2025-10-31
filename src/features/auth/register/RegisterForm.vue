<script setup lang="ts">
import { reactive, computed } from 'vue'
import AppFormField from '@/shared/components/ui/AppFormField.vue'
import AppTextField from '@/shared/components/ui/AppTextField.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'
import {
  validatePassword,
  validatePasswordConfirmation,
  validateUsername,
} from '@/shared/utils/validation'
import { register, useAuthStore } from '@/entities/auth'
import { normalizeApiError } from '@/shared/api/normalizeApiError'

const state = reactive({
  username: '',
  password: '',
  passwordConfirmation: '',
  isSubmitting: false,
  error: '',
  touched: {
    username: false,
    password: false,
    passwordConfirmation: false,
  },
})

const usernameError = computed(() => {
  if (!state.touched.username) return ''
  const result = validateUsername(state.username)
  return result.valid ? '' : result.message ?? ''
})

const passwordError = computed(() => {
  if (!state.touched.password) return ''
  const result = validatePassword(state.password)
  return result.valid ? '' : result.message ?? ''
})

const passwordConfirmationError = computed(() => {
  if (!state.touched.passwordConfirmation) return ''
  const result = validatePasswordConfirmation(state.password, state.passwordConfirmation)
  return result.valid ? '' : result.message ?? ''
})

const isFormValid = computed(() => {
  return (
    validateUsername(state.username).valid &&
    validatePassword(state.password).valid &&
    validatePasswordConfirmation(state.password, state.passwordConfirmation).valid
  )
})

const authStore = useAuthStore()

async function handleSubmit() {
  state.touched.username = true
  state.touched.password = true
  state.touched.passwordConfirmation = true

  if (!isFormValid.value || state.isSubmitting) {
    return
  }

  state.isSubmitting = true
  state.error = ''

  try {
    const response = await register({
      username: state.username.trim(),
      password: state.password,
      passwordConfirmation: state.passwordConfirmation,
    })
    authStore.setAuthToken(response.token)
  } catch (error) {
    const normalized = normalizeApiError(error)
    state.error = normalized.payload?.message ?? 'Ошибка регистрации. Попробуйте снова'
  } finally {
    state.isSubmitting = false
  }
}
</script>

<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <h2 class="auth-form__title">Регистрация</h2>

    <AppFormField label="Логин" for-id="register-username" :error="usernameError">
      <AppTextField
        id="register-username"
        v-model="state.username"
        autocomplete="username"
        placeholder="Введите логин"
        @blur="state.touched.username = true"
      />
    </AppFormField>

    <AppFormField label="Пароль" for-id="register-password" :error="passwordError">
      <AppTextField
        id="register-password"
        v-model="state.password"
        type="password"
        autocomplete="new-password"
        placeholder="Введите пароль"
        @blur="state.touched.password = true"
      />
    </AppFormField>

    <AppFormField
      label="Подтвердите пароль"
      for-id="register-password-confirmation"
      :error="passwordConfirmationError"
    >
      <AppTextField
        id="register-password-confirmation"
        v-model="state.passwordConfirmation"
        type="password"
        autocomplete="new-password"
        placeholder="Повторите пароль"
        @blur="state.touched.passwordConfirmation = true"
      />
    </AppFormField>

    <p v-if="state.error" class="auth-form__error">{{ state.error }}</p>

    <AppButton type="submit" :disabled="!isFormValid || state.isSubmitting">
      {{ state.isSubmitting ? 'Регистрация...' : 'Зарегистрироваться' }}
    </AppButton>
  </form>
</template>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
}

.auth-form__title {
  margin: 0 0 8px;
  font-size: 28px;
}

.auth-form__error {
  color: #ff6b6b;
  font-size: 14px;
}
</style>
