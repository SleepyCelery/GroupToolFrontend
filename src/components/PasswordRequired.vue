<template>
  <n-modal v-model:show="showModal">
    <n-card :style="{ width: isMobile ? '90%' : '400px' }">
      <div class="modal-content">
        <div class="message">该分组为私有分组，请输入密码</div>
        <n-input
          v-model:value="password"
          type="password"
          placeholder="请输入密码"
          show-password-on="click"
          class="password-input"
          ref="passwordInput"
          @keyup.enter="handleConfirm"
        />
      </div>

      <template #footer>
        <div class="footer-buttons">
          <n-button @click="handleCancel">取消</n-button>
          <n-button type="primary" @click="handleConfirm">确定</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { NModal, NCard, NInput, NButton } from 'naive-ui'

const showModal = ref(false)
const password = ref('')
const passwordInput = ref<HTMLInputElement | null>(null)
const localId = ref(0)

const emit = defineEmits(['confirm', 'cancel'])

const isMobile = ref(false)

onMounted(() => {
  isMobile.value = window.innerWidth < 768
})

const open = (id: number) => {
  showModal.value = true
  password.value = ''
  localId.value = id
  nextTick(() => {
    passwordInput.value?.focus()
  })
}

const handleConfirm = () => {
  emit('confirm', {
    id: localId.value,
    password: password.value,
  })
  showModal.value = false
  password.value = ''
}

const handleCancel = () => {
  emit('cancel')
  showModal.value = false
  password.value = ''
}

defineExpose({
  open,
})
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  font-size: 16px;
  color: #333;
}

.password-input {
  margin-top: 12px;
}

.footer-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
